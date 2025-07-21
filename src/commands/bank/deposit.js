const { Client, Interaction, ApplicationCommandOptionType, EmbedBuilder } = require("discord.js");
const User = require('../../models/User');

module.exports = {
  name: 'deposit',
  description: 'Deposit uang ke akun bank.',
  options: [
    {
      name: 'jumlah',
      description: 'Berapa banyak uang yang ingin di depositkan?',
      required: true,
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

    if (jumlah > user.balance) {
      return interaction.reply('❌ Uang kamu tidak cukup!');
    }

    if (jumlah <= 0) {
      return interaction.reply('❌ Jumlah uang yang kamu masukan tidak valid!');
    }

    user.balance -= jumlah;
    user.bankBalance += jumlah;

    await user.save();
    
    const embed = new EmbedBuilder()
      .setTitle('Deposit')
      .setDescription(`Berhasil deposit $${jumlah} ke akun bank mu!\n\nSaldo mu di bank menjadi: $${user.bankBalance}`)
      .setColor('#4CC9F0')
      .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setFooter({ text: 'Wilsonomy 2k25' })

    interaction.reply({ embeds: [embed] });
  }
}