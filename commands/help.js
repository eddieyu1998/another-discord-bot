const { allowExecute } = require("../common")

const guildOnly = false

exports.command = "/help"

exports.aliases = "/h"

exports.describe = "Show help message"

exports.builder = {}

exports.handler = function (argv) {
    // handler called when command parsed
    if (!allowExecute(argv, guildOnly)) {
        return
    }
    execute(argv)
}

function execute(argv) {
    argv.message.channel.send(helpMessage)
}

const helpMessage = `**Commands:**
__Show this help message__
**\`/help\`**

__Look for a group to play__
**\`/letsplay [game] [player] [at]\`**

**Examples:**
__looking to play Among Us with 8-10 people at 22:00__
**\`/letsplay "Among Us" 8-10 22:00\`**

__looking to play LOL with 5 people at 22:00__
**\`/letsplay LOL 5 2200\`**

__looking to play Minecraft with 2+ people at 22:00__
**\`/letsplay Minecraft 2+ 22\`**

__looking to play any game with 2+ people at 22:00__
**\`/letsplay --player 2+ 22\`**
`
