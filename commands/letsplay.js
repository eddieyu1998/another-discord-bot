const fs = require("fs")
const { parse } = require("path")
const util = require("util")
const { allowExecute } = require("../common")
const readFile = util.promisify(fs.readFile)
const writeFile = util.promisify(fs.writeFile)

const guildOnly = true

exports.command = "/letsplay [game] [player] [at]"

exports.aliases = "/p"

exports.describe = "Start a matchmaking for a game"

exports.builder = {
    game: {
        requiresArg: true,
        nargs: 1, // currently support only 1 game
        describle: "",
        type: "string",
    },
    player: {
        requiresArg: true,
        nargs: 1,
        describle: "",
        type: "string",
    },
    at: {
        requiresArg: true,
        narg: 1,
        describle: "",
        type: "string",
    },
}

exports.handler = function (argv) {
    // handler called when command parsed
    if (!allowExecute(argv, guildOnly)) {
        return
    }
    execute(argv)
}

async function execute(argv) {
    console.log(argv)
    try {
        const gameName = argv.game ? parseGame(argv.game) : null
        const player = argv.player ? parsePlayer(argv.player) : null
        const at = argv.at ? parseAt(argv.at) : null

        const lobby = {}
        if (argv.game) lobby.game = parseGame(argv.game)
        if (argv.player) lobby.player = parsePlayer(argv.player)
        if (argv.at) lobby.at = parseAt(argv.at)
        lobby.calledAt = Date.now()
        lobby.status = "waiting"
        lobby.participants = []

        const guildId = argv.message.guild.id
        await addLobby(lobby, guildId)
        const lobbyMessage = await argv.message.channel.send(newLobbyMessage(argv.message, lobby))
        lobbyMessage.react("✅")
    } catch (err) {
        argv.message.reply(err.message)
    }
}

function newLobbyMessage(message, lobby) {
    const game = lobby.game ? `**${lobby.game}**` : "any games"
    const player = lobby.player ? `**${lobby.player.display}**` : "any number of"
    const deadline = lobby.at ? `at **${lobby.at.display}**` : ""
    const response = `${message.author} wants to play ${game} with ${player} players ${deadline}. React below to join. @everyone`
    return response
}

// A function to add the new lobby to the guild file
async function addLobby(lobby, guildId) {
    try {
        const guildFile = await readFile(`./guilds/${guildId}.json`)
        const guild = JSON.parse(guildFile)
        guild["lobbies"].push(lobby)
        const data = JSON.stringify(guild)
        await writeFile(`./guilds/${guildId}.json`, data)
    } catch (err) {
        if (err.code === "ENOENT") {
            // guild file not exist yet
            let guild = { lobbies: [lobby] }
            let data = JSON.stringify(guild)
            await writeFile(`./guilds/${guildId}.json`, data)
            return
        }
        console.error(err)
        throw new Error("Error creating lobby, please try again later")
    }
}

function parseGame(gameOption) {
    return gameOption
}

/**
 * @typedef {Object} Player
 * @property {string} display
 * @property {number} exact
 * @property {number} min
 * @property {number} max
 */
/**
 * A function to parse the player option
 *
 * @param {string} playerOption - player option in the command
 * @returns {Player}
 *
 * player option can take the following 3 forms:
 * 4
 * 4+
 * 4-6
 */
function parsePlayer(playerOption) {
    const re = /^([1-9]\d*)(\+|-([1-9]\d*))?$/
    const match = playerOption.match(re)
    if (!match) {
        throw new Error("Unsupported format for option [player]")
    }
    // for playerOption "1-9" match return [ '1-9', '1', '-9', '9', index: 0, input: '1-9', groups: undefined ]
    const player = {}
    if (match[3]) {
        // e.g. 1-9
        if (parseInt(match[3]) <= parseInt(match[1])) {
            throw new Error("Invalid player number")
        }
        player.min = parseInt(match[1])
        player.max = parseInt(match[3])
    } else if (match[2]) {
        // e.g. 2+
        player.min = parseInt(match[1])
    } else {
        // e.g. 4
        player.exact = parseInt(match[1])
    }
    player.display = playerOption
    return player
}

/**
 * @typedef {Object} At
 * @property {string} display
 * @property {number} deadline - deadline in unix epoch
 */
/**
 * A function to parse the at option
 * Currently only support time in the next 24 hours
 *
 * @param {string} atOption
 * @returns {At}
 * supported format (in 24-hour):
 * H:mm / HH:mm / HHmm / Hmm / HH / H
 */
function parseAt(atOption) {
    const re = /^(\d{1,2}):?(\d{2})?$/
    const match = atOption.match(re)
    if (!match) {
        throw new Error("Unsupported format for option [at]")
    }
    let hour = null,
        minute = null
    hour = match[1]
    if (match[2]) {
        minute = match[2]
    }
    if (parseInt(hour) >= 24 || (minute && parseInt(minute) >= 60)) {
        throw new Error("Invalid time value")
    }
    const at = {}
    at.display = hour.padStart(2, "0") + ":" + (minute ? minute : "00")
    let deadline = new Date()
    deadline.setHours(hour)
    deadline.setMinutes(minute)
    if (deadline < new Date()) {
        deadline.setDate(deadline.getDate() + 1)
    }
    at.deadline = deadline.getTime()
    return at
}

/*
command examples

looking to play any game with any number of people
/letsplay any

looking to play Minecraft with any number of people
/letsplay Minecraft

looking to play CSGO with 5 people 
/letsplay CSGO 5

looking to play World of Warcraft with at least 4 people
/letsplay WoW 4+

looking to play Among Us with between 8 and 10 people
/letsplay "Among Us" 8-10

looking to play Among Us at or before 22:00
/letsplay "Among Us" 8-10 22:00

*/
