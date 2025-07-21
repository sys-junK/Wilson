const { ApplicationCommandOptionType, PermissionFlagsBits, userMention } = require("discord.js");
const { description } = require("../misc/ping");

module.exports = {
    name: 'ban',
    description: 'ban orang',
    options: [
        {
            name: 'target-user',
            description: 'The user you want to ban',
            required: true,
            type: ApplicationCommandOptionType.Mentionable,
        },
        {
            name: 'reason',
            description: 'The reason of banning',
            type: ApplicationCommandOptionType.String,
        },
    ],
    // devOnly: Boolean,
    // testOnly: Boolean,
    permissionsRequired: [PermissionFlagsBits.Administrator],
    botPermission: [PermissionFlagsBits.Administrator],

    callback: (Client, interaction) => {
        interaction.reply(`<@${userId}> has been banned from the server.`)
    },
};