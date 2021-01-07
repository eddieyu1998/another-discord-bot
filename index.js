require("dotenv").config()
const Discord = require("discord.js")
const yargs = require("yargs").commandDir("commands").demandCommand(1).help(false).version(false)
//.showHelpOnFail(false)    // suppress console message
//.exitProcess(false)   // do not need when callback provided to parse()

const client = new Discord.Client()

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
    console.log("Bot Ready!")
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

    console.log(message.content)
})

client.login(process.env.TOKEN)

/*
functions:

1. Matchmaking

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



required supporting functionality:

set server time zone
/timezone +8
*/
