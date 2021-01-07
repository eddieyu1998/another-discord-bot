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
}

/*
command examples

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
