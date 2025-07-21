const { Client, Interaction, ApplicationCommandOptionType, VoiceChannel } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, StreamType } = require('@discordjs/voice');
const play = require('play-dl');
const ffmpegPath = require('ffmpeg-static');

module.exports = {
  name: 'play',
  description: 'Play music in your voice channel.',
  options: [
    {
      name: 'url',
      description: 'URL song',
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],

  /**
   * 
   * @param {Client} client 
   * @param {Interaction} interaction 
   */
  callback: async (client, interaction) => {
    const query = interaction.options.getString('url');
    console.log('Query:', query);
    if (!query) {
      await interaction.followUp('URL tidak ditemukan.');
      return;
    }
    await interaction.deferReply();

    const voiceChannel = interaction.member.voice.channel;
    if (!voiceChannel) {
      await interaction.reply('Kamu harus join voice channel terlebih dahulu.');
      return;
    }

    const connection = joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: interaction.guild.id,
      adapterCreator: interaction.guild.voiceAdapterCreator,
    });

    try {
      const video = play.video_basic_info(query);
      const stream = await play.stream(video.video_details.url);
      const resource = createAudioResource(stream.stream, {
        inputType: stream.type === 'opus' ? StreamType.Opus : StreamType.Arbitrary
      });

      if (!stream || !stream.stream) {
        await interaction.followUp('Gagal mengambil stream dari URL');
        return;
      }

      if (!play.is_explicit(query)) {
        await interaction.followUp('Input yang kamu masukan bukan URL yang valid.');
      }

      const player = createAudioPlayer();
      connection.subscribe(player);
      player.play(resource);

      player.on(AudioPlayerStatus.Playing, () => {
        console.log('Sedang memutar musik...');
      });

      player.on(AudioPlayerStatus.Idle, () => {
        connection.destroy();
        console.log('Musik selesai. Bot keluar dari channel.');
      });

      await interaction.followUp(`Memutar: ${query}`);
    } catch (error) {
      console.error('Terjadi error saat streaming.', error);
      await interaction.followUp('Gagal memutar lagu. Coba URL lain atau cek koneksi internet.');
    }
  }
}