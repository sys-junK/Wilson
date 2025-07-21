const { Client } = require("discord.js");

module.exports = {
    name: 'ping',
    description: 'Show your ping!',
    // devOnly: Boolean,
    // testOnly: Boolean,
    // options: Object[],
    // deleted: Boolean,

    callback: (client, interaction) => {
        interaction.reply(`Pong! ${client.ws.ping}ms`)
    },
};