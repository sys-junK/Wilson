const { Client, Interaction } = require('discord.js');
const { joinVoiceChannel } = require('@discordjs/voice');

module.exports = {
  name: 'join',
  description: 'Join to voice channel',

  callback: async (client, interaction) => {
    const guild = interaction.guild;
    const member = await guild?.members?.fetch(interaction.user.id);
    const voiceChannel = member.voice.channel;

    if (!voiceChannel) {
      return interaction.reply('You need to join to voice channel to use this command.');
    }

    try {
      const connection = joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: interaction.guild.id,
        adapterCreator: interaction.guild.voiceAdapterCreator,
        selfDeaf: true,
      });

      interaction.reply('Berhasil join kedalam voice channel!');
    } catch (error) {
      console.log(`There is an error in your code ${error}`)
    }
  }
}