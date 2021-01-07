function isDM(message) {
    return message.channel.type === "dm"
}

function allowExecute(argv, guildOnly) {
    if (guildOnly && isDM(argv.message)) {
        argv.message.reply("Command not available in DM")
        return false
    }

    if (argv.err) {
        // parsing error from YError
        argv.message.reply("There is an error in your command.", argv.output)
        return false
    }

    return true
}

module.exports = { allowExecute }
