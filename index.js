require("dotenv").config()
const Discord = require("discord.js")
const yargs = require("yargs").commandDir("commands").demandCommand(1).help(false).version(false)
//.showHelpOnFail(false)    // suppress console message
//.exitProcess(false)   // do not need when callback provided to parse()

const client = new Discord.Client({ partials: ["MESSAGE", "REACTION"] })

// a function to parse the command
function parseCommand(yargs, message) {
    return new Promise((resolve, reject) => {
        try {
            yargs.parse(message.content, { message: message }, (err, argv, output) => {
                if (err) {
                    // YError
                    console.error(err)
                    argv.err = err
                    argv.output = output
                }
                resolve(argv)
            })
        } catch (err) {
            // errors other than YError
            reject(err)
        }
    })
}

client.once("ready", () => {
    console.log(`Bot Ready! Current default timezone: ${process.env.TZ}`)
})

client.on("message", (message) => {
    if (!message.content.startsWith(process.env.COMMAND_PREFIX) || message.author.bot) {
        return
    }

    parseCommand(yargs, message)
        .then((argv) => {
            // parse success, do anything with the command argv
            // Yargs will automatically execute the corresponding command handler
        })
        .catch((err) => {
            // errors other than YError
            console.error(err)
            message.reply("Error parsing command")
        })
})

process.on("uncaughtException", (err) => {
    console.error("There was an uncaught error", err)
    process.exit(1)
})

client.login(process.env.TOKEN)

/*
functions:

1. /letsplay: Matchmaking

required supporting functionality:

set server time zone
/timezone +8

prevent user double join

game end (voice channel) detection

guild file loading on bot start up + cleaning up expired/ended game sessions
*/
