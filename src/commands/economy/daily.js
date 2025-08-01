const { Client, Interaction } = require('discord.js')
const User = require('../../models/User');

const dailyAmount = 1000;

module.exports = {
  name: 'daily',
  description: "Collect your dailies!",
  /**
   * 
   * @param {Client} client 
   * @param {Interaction} interaction 
   */
  callback: async (client, interaction) => {
    if (!interaction.inGuild()) {
      interaction.reply({ 
        content: 'You can only run this command inside a server.', 
        ephemeral: true 
      });
      return;
    }

    try {
      await interaction.deferReply();

      const query = {
        userId: interaction.member.id,
        guildId: interaction.guild.id,
      };

      let user = await User.findOne(query);

      if (user) {
        const lastDailyDate = user.lastDaily.toDateString();
        const currentDate = new Date().toDateString();

        if (lastDailyDate === currentDate) {
          interaction.editReply('You have collected your dailies today. Comeback tomorrow to collect your dailies!');
          return;
        }
        
        user.lastDaily = new Date();
      } else {
        user = new User({
          ...query,
          lastDaily: new Date(),
        });
      }

      user.balance += dailyAmount;
      await user.save();

      interaction.editReply(`${dailyAmount} Was added to your. Your new balance is ${user.balance}. `);
    } catch (error) {
      console.log(`Error with /daily: ${error}`)
    } 
  },
};