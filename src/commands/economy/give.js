const { Client, Interaction, ApplicationCommandOptionType, EmbedBuilder } = require("discord.js");
const User = require('../../models/User');

module.exports = {
  name: 'give',
  description: 'Transfer uang ke orang lain',
  options: [
    {
      name: 'target',
      description: 'Target user',
      required: true,
      type: ApplicationCommandOptionType.User,
    },
    {
      name: 'amount',
      description: 'Berapa banyak uang yang ingin diberikan?',
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
    const targetUser = interaction.options.getUser('target');
    const amount = interaction.options.getInteger('amount');
    const giverId = interaction.user.id;
    const guildId  = interaction.guild.id;

    if (targetUser.id === giverId) {
      return interaction.reply('Kamu tidak bisa memberikan uang ke diri sendiri.');
    }

    if (amount < 0) {
      return interaction.reply('Tidak bisa memberikan uang kurang dari 0!');
    }

    const giver = await User.findOne({ userId: giverId, guildId });
    const reciever = await User.findOneAndUpdate(
      { userId: targetUser.id, guildId },
      { $setOnInsert: { balance: 0, lastDaily: new Date() } },
      { upsert: true, new: true }
    );

    if (!giver || giver.balance < amount) {
      return interaction.reply('Uang kamu tidak cukup.');
    }

    giver.balance -= amount;
    reciever.balance += amount;

    await giver.save();
    await reciever.save();

    const embed = new EmbedBuilder()
      .setTitle('💸 Transfer berhasil')
      .setDescription(`${interaction.user.username} memberikan $${amount} kepada ${targetUser.username}`)
      .setColor('#4CC9F0')
      .setThumbnail(targetUser.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setFooter({
        text: `Requested by ${interaction.user.username}`,
        iconURL: interaction.user.displayAvatarURL({ dynamic: true })
      });

    await interaction.reply({ embeds: [embed] });
  }
}