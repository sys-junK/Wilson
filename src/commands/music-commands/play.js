const { Interaction, ApplicationCommandOptionType } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const playdl = require('play-dl');

module.exports = {
  name: 'play',
  description: 'Play a song in your voice channel',
  options: [
    {
      name: 'youtube-url',
      description: 'Youtube URL',
      options: ApplicationCommandOptionType.String,
    },
  ],

  /**
   * 
   * @param {interaction} interaction 
   */
  callback: async (interaction) => {
    const url = interaction.options.getString('youtube-url');
    const member = interaction.member;

    // ngecek kalo member ada di voice channel or not
    const voiceChannel = member.voice.channel;
    if (!voiceChannel) {
      return interaction.reply('You have to join voice channel to use this commands!');
    }

    await interaction.deferReply();

    try {
      const stream = await playdl.stream(url);

      const connection = joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: interaction.guild.id,
        adapterCreator: interaction.guild.voiceAdapterCreator
      });

      const player = createAudioPlayer();
      const resource = createAudioResource(stream.stream, {
        inputType: stream.type
      });

      player.play(resource);
      connection.subscribe(player);

      player.on(AudioPlayerStatus.Idle, () => {
        connection.destroy();
      });

      await interaction.deferReply(`Start playing ${url}!`);
    } catch (error) {
      await interaction.editReply('Gagal memutar lagu...');
    }
  }
}