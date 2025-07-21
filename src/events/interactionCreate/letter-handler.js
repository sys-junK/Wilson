const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, EmbedBuilder } = require('discord.js');

module.exports = async (client, interaction) => {
  if (interaction.isButton() && interaction.customId.startsWith(`balas_surat`)) {
    const pengirim = interaction.customId.split('|')[1]; //string nama pengirim

    const modal = new ModalBuilder()
      .setCustomId(`modal_balas_surat|${pengirim}`)
      .setTitle('Balas Surat 💌');

     const input = new TextInputBuilder()
      .setCustomId('isi_balasan')
      .setLabel('Tulis balasn kamu.')
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(true);

     const actionRow = new ActionRowBuilder().addComponents(input);
     modal.addComponents(actionRow);

     await interaction.showModal(modal);
  }

  if (interaction.isModalSubmit() && interaction.customId.startsWith('modal_balas_surat')) {
    const pengirim = interaction.customId.split('|')[1];
    const isiBalasan = interaction.fields.getTextInputValue('isi_balasan');

    //kirim balasan ke publik
    const balasanEmbed = new EmbedBuilder()
      .setTitle('💌 Balasan Surat')
      .setDescription(`Dari: **${interaction.user.username}**\nUntuk: **${pengirim}**\n\n"${isiBalasan}"`)
      .setColor('#FFB7C5')
      .setTimestamp();

    await interaction.channel.send({ embeds: [balasanEmbed] });
  };
}
