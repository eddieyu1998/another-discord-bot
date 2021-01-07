require("dotenv").config()
const Discord = require("discord.js")
const client = new Discord.Client()

client.once("ready", () => {
    console.log("Bot Ready!")
})

client.on("message", (message) => {
    if (!message.content.startsWith(process.env.COMMAND_PREFIX) || message.author.bot) {
        return
    }

    console.log(message.content)
})

client.login(process.env.TOKEN)
