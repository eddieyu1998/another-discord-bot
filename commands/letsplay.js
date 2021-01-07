const { Message } = require("discord.js")
const { parse } = require("yargs")
const { allowExecute } = require("../common")
const guildOnly = true

exports.command = "/letsplay [game] [player] [at]"

exports.aliases = "/p"

exports.describe = "Start a matchmaking for a game"

exports.builder = {
    game: {
        requiresArg: true,
        nargs: 1, // currently support only 1 game
        describle: "",
    },
    player: {
        requiresArg: true,
        nargs: 1,
        describle: "",
    },
    at: {
        requiresArg: true,
        narg: 1,
        describle: "",
    },
}

exports.handler = function (argv) {
    // handler called when command parsed
    if (!allowExecute(argv, guildOnly)) {
        return
    }
    execute(argv)
}

function execute(argv) {
    console.log(argv)
    try {
        const game = argv.game ? parseGame(argv.game) : null
        const player = argv.player ? parsePlayer(argv.player) : null
        const at = argv.at ? parseAt(argv.at) : null
    } catch (err) {
        argv.message.reply(err.message)
    }
}

function parseGame(gameOption) {
    return gameOption
}

/**
 * @typedef {Object} Player
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
