const { Client, Interaction, ApplicationCommandOptionType, EmbedBuilder } = require("discord.js");
const User = require('../../models/User');

module.exports = {
  name: 'withdraw',
  description: 'Tarik saldo dari akun bank.',
  options: [
    {
      name: 'jumlah',
      description: 'Berapa banyak yang ingin kamu ambil?',
      type: ApplicationCommandOptionType.Integer,
    },
  ],

  /**
   * 
   * @param {Client} client 
   * @param {Interaction} interaction 
   */
  callback: async (client, interaction) => {
    const jumlah = interaction.options.getInteger('jumlah');
    const userId = interaction.user.id;
    const guildId = interaction.guild.id;

    const user = await User.findOne({ userId, guildId });

    if (!user || !user.bank?.hasAccount) {
      return interaction.reply('❌ Kamu belum punya akun bank.');
    }

    if (jumlah > user.bankBalance) {
      return interaction.reply('❌ Saldomu tidak cukup!');
    }

    if (jumlah <= 0) {
      return interaction.reply('❌ Jumlah yang kamu masukan tidak valid!');
    }

    user.bankBalance -= jumlah;
    user.balance += jumlah;

    await user.save();

    const embed = new EmbedBuilder()
      .setTitle('Withdraw')
      .setDescription(`✅ Kamu berhasil tarik $${jumlah} dari bank.\n\nSaldo bank mu menjadi: $${user.bankBalance}`)
      .setColor('#4CC9F0')
      .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setFooter({ text: 'Wilsonomy 2k25' })

    interaction.reply({ embeds: [embed] });
  }
}