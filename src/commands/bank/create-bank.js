const { Client, Interaction } = require('discord.js')
const User = require('../../models/User')

module.exports = {
  name: 'create-bank',
  description: 'Buat akun bank.',

  /**
   * 
   * @param {Client} client 
   * @param {Interaction} interaction 
   */
  callback: async (client, interaction) => {
    const userId = interaction.user.id;
    const guildId = interaction.guild.id;

    let user = await User.findOne({ userId, guildId });

    if (!user) {
      user = new User({ userId, guildId });
    }

    if (user.bank?.hasAccount) {
      return interaction.reply('❌ Kamu sudah punya akun bank.');
    }

    user.bank = {
      hasAccount: true,
      createdAt: new Date()
    };

    await user.save();
    interaction.reply('🏦 Akun bank berhasil dibuat! Sekarang kamu bisa deposit dan withdraw.');
  }
};