const { Interaction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
  name: 'help',
  description: 'Menampilkan daftar perintah yang tersedia.',

  /**
   * 
   * @param {Interaction} interaction 
   */
  callback: async (interaction) => {
    const embed = new EmbedBuilder()
      .setTitle('Help')
      .setDescription('Penis')
      .setColor('#4CC9F0')
      .setFooter({
        text: 'Wilson',
      })
      .setTimestamp()

    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('help_test')
          .setLabel('test')
          .setStyle(ButtonStyle.Primary)
      )

    await interaction.channel.send({
      embeds: [embed],
      components: [row],
    });
  }
}