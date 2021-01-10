const dateFnsTz = require("date-fns-tz")
const { parsePlayer, parseAt, createLobby } = require("../commands/letsplay")

// test for parsePlayer function
describe("parsePlayer", () => {
    test("throw if it is not a number or accepted string format", () => {
        expect(() => parsePlayer("test")).toThrow("Invalid option for player number")
    })

    test("throw if it is 0", () => {
        expect(() => parsePlayer("0")).toThrow("Invalid option for player number")
    })

    test("throw if it is negative number", () => {
        expect(() => parsePlayer("-1")).toThrow("Invalid option for player number")
    })

    test("throw if max is smaller than min", () => {
        expect(() => parsePlayer("1-0")).toThrow("Invalid option for player number")
    })

    test("accept an exact number: 1", () => {
        expect(parsePlayer("1")).toEqual({ exact: 1, display: "1" })
    })

    test("accept expression x+", () => {
        expect(parsePlayer("1+")).toEqual({ min: 1, display: "1+" })
    })

    test("accept a range of numbers", () => {
        expect(parsePlayer("1-10")).toEqual({ min: 1, max: 10, display: "1-10" })
    })
})

// test for parseAt function
// accepted format: HH:mm / H:mm / HHmm / Hmm / HH / H
describe("parseAt", () => {
    jest.mock("date-fns-tz")
    const constantDate = new Date(1610265600000) // 2021-01-10T08:00:00.000Z

    test("accept time format of HH:mm", () => {
        dateFnsTz.utcToZonedTime = jest.fn().mockReturnValueOnce(constantDate)
        expect(parseAt("08:01", null, dateFnsTz.utcToZonedTime, dateFnsTz.zonedTimeToUtc)).toEqual({
            display: "08:01",
            deadline: 1610265660000,
        })
    })

    test("accept time format of H:mm", () => {
        dateFnsTz.utcToZonedTime = jest.fn().mockReturnValueOnce(constantDate)
        expect(parseAt("8:01", null, dateFnsTz.utcToZonedTime, dateFnsTz.zonedTimeToUtc)).toEqual({
            display: "08:01",
            deadline: 1610265660000,
        })
    })

    test("accept time format of HHmm", () => {
        dateFnsTz.utcToZonedTime = jest.fn().mockReturnValueOnce(constantDate)
        expect(parseAt("0801", null, dateFnsTz.utcToZonedTime, dateFnsTz.zonedTimeToUtc)).toEqual({
            display: "08:01",
            deadline: 1610265660000,
        })
    })

    test("accept time format of Hmm", () => {
        dateFnsTz.utcToZonedTime = jest.fn().mockReturnValueOnce(constantDate)
        expect(parseAt("801", null, dateFnsTz.utcToZonedTime, dateFnsTz.zonedTimeToUtc)).toEqual({
            display: "08:01",
            deadline: 1610265660000,
        })
    })

    test("accept time format of HH", () => {
        dateFnsTz.utcToZonedTime = jest.fn().mockReturnValueOnce(constantDate)
        expect(parseAt("09", null, dateFnsTz.utcToZonedTime, dateFnsTz.zonedTimeToUtc)).toEqual({
            display: "09:00",
            deadline: 1610269200000,
        })
    })

    test("accept time format of H", () => {
        dateFnsTz.utcToZonedTime = jest.fn().mockReturnValueOnce(constantDate)
        expect(parseAt("9", null, dateFnsTz.utcToZonedTime, dateFnsTz.zonedTimeToUtc)).toEqual({
            display: "09:00",
            deadline: 1610269200000,
        })
    })

    test("throw if hour is >= 24", () => {
        expect(() => parseAt("24:00", null, dateFnsTz.utcToZonedTime, dateFnsTz.zonedTimeToUtc)).toThrow(
            "Invalid option for deadline at"
        )
    })

    test("throw if minute is >= 60", () => {
        expect(() => parseAt("08:60", null, dateFnsTz.utcToZonedTime, dateFnsTz.zonedTimeToUtc)).toThrow(
            "Invalid option for deadline at"
        )
    })

    test("default timezone with 1.5 hours deadline", () => {
        dateFnsTz.utcToZonedTime = jest.fn().mockReturnValueOnce(constantDate)
        expect(parseAt("09:30", null, dateFnsTz.utcToZonedTime, dateFnsTz.zonedTimeToUtc)).toEqual({
            display: "09:30",
            deadline: 1610271000000,
        })
    })

    test("default timezone with 12 hours deadline", () => {
        dateFnsTz.utcToZonedTime = jest.fn().mockReturnValueOnce(constantDate)
        expect(parseAt("20:00", null, dateFnsTz.utcToZonedTime, dateFnsTz.zonedTimeToUtc)).toEqual({
            display: "20:00",
            deadline: 1610308800000,
        })
    })

    test("default timezone with 23 hours deadline", () => {
        dateFnsTz.utcToZonedTime = jest.fn().mockReturnValueOnce(constantDate)
        expect(parseAt("07:00", null, dateFnsTz.utcToZonedTime, dateFnsTz.zonedTimeToUtc)).toEqual({
            display: "07:00",
            deadline: 1610348400000,
        })
    })

    test("default timezone with 23 hours 59 minutes deadline", () => {
        dateFnsTz.utcToZonedTime = jest.fn().mockReturnValueOnce(constantDate)
        expect(parseAt("07:59", null, dateFnsTz.utcToZonedTime, dateFnsTz.zonedTimeToUtc)).toEqual({
            display: "07:59",
            deadline: 1610351940000,
        })
    })

    test("Hong Kong timezone with 1.5 hours deadline", () => {
        dateFnsTz.utcToZonedTime = jest.fn().mockReturnValueOnce(new Date("2021-01-10T16:00:00.000Z"))
        expect(parseAt("17:30", "Asia/Hong_Kong", dateFnsTz.utcToZonedTime, dateFnsTz.zonedTimeToUtc)).toEqual({
            display: "17:30",
            deadline: 1610271000000,
        })
    })

    test("Hong Kong timezone with 12 hours deadline", () => {
        dateFnsTz.utcToZonedTime = jest.fn().mockReturnValueOnce(new Date("2021-01-10T16:00:00.000Z"))
        expect(parseAt("04:00", "Asia/Hong_Kong", dateFnsTz.utcToZonedTime, dateFnsTz.zonedTimeToUtc)).toEqual({
            display: "04:00",
            deadline: 1610308800000,
        })
    })

    test("default timezone with 23 hours deadline", () => {
        dateFnsTz.utcToZonedTime = jest.fn().mockReturnValueOnce(new Date("2021-01-10T16:00:00.000Z"))
        expect(parseAt("15:00", "Asia/Hong_Kong", dateFnsTz.utcToZonedTime, dateFnsTz.zonedTimeToUtc)).toEqual({
            display: "15:00",
            deadline: 1610348400000,
        })
    })

    test("default timezone with 23 hours 59 minutes deadline", () => {
        dateFnsTz.utcToZonedTime = jest.fn().mockReturnValueOnce(new Date("2021-01-10T16:00:00.000Z"))
        expect(parseAt("15:59", "Asia/Hong_Kong", dateFnsTz.utcToZonedTime, dateFnsTz.zonedTimeToUtc)).toEqual({
            display: "15:59",
            deadline: 1610351940000,
        })
    })
})

// test for createLobby function
describe("createLobby", () => {
    test("lobby", () => {
        const lobby = createLobby({ game: "Among Us", player: "5+", at: "2200" })
        console.log(lobby)
        expect(1).toBe(1)
    })
})
