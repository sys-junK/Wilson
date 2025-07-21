const { Client, Interaction, ApplicationCommandOptionType, EmbedBuilder } = require('discord.js')
const User = require('../../models/User');

module.exports = {
  /**
   * 
   * @param {Client} client 
   * @param {Interaction} interaction 
   */
  callback: async (client, interaction) => {
    if (!interaction.inGuild) {
      interaction.reply({
        content: 'You can only run this command inside a server.',
        ephemeral: true,
      });
      return;
    }

    const targetUserId = interaction.options.get('user')?.value || interaction.member.id;

    await interaction.deferReply()

    const user = await User.findOne({ userId: targetUserId, guildId: interaction.guild.id });

    if (!user) {
      interaction.editReply(`<@${targetUserId}> doesn't have a profile yet.`);
      return;
    }

    const targetUser = await interaction.guild.members.fetch(targetUserId);

    const embed = new EmbedBuilder()
      .setColor('#4CC9F0')
      .setTitle('Balance')
      .setDescription(`💰 ${targetUserId === interaction.member.id ? 'Your' : `<@${targetUserId}>'s`} balance is $**${user.balance}**`)
      .setThumbnail(targetUser.user.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setFooter({ text: `Requested by ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL() })

    interaction.editReply({ embeds: [embed] });
  },

  name: 'balance',
  description: "Check your or someone else's balance.",
  options: [
    {
      name: 'user',
      description: 'The user whose balance you want to see.',
      type: ApplicationCommandOptionType.User,
    }
  ]
}