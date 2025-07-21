const Discord = require('discord.js');  

module.exports = (client, interaction) => {
    console.log(`${client.user.tag} is online!`);

    //activity status
    client.user.setActivity('Keluh Kesah Alekg.mp3', { type: Discord.ActivityType.Listening });
};