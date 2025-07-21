const { Client, Integration, ApplicationCommandOptionType, AttachmentBuilder, Guild } = require('discord.js')
const calculateLevelXp = require('../../utils/calculateLevelXp')
const canvacord = require('canvacord')
const { RankCardBuilder, Font } = require('canvacord')
const Level = require('../../models/Level')

Font.loadDefault();

module.exports = {
  /**
   * 
   * @param {Client} client 
   * @param {Interaction} interaction 
   * @returns 
   */

  callback: async (client, interaction)  => {
    if (!interaction.inGuild()) {
        interaction.reply('You can only run this command inside a server.');
      return;
    }

    await interaction.deferReply();

    const mentionUserId = interaction.options.getUser('target-user')?.value;
    const targetUserId = mentionUserId || interaction.member.id;
    const targetUserObj = await interaction.guild.members.fetch(targetUserId);

    const fetchedLevel = await Level.findOne({
      userId: targetUserId,
      guildId: interaction.guild.id,
    });

    if (!fetchedLevel) {
      interaction.editReply(
        mentionUserId 
          ? `${targetUserObj.user.tag} doesn't have any level yet. Try again when they yapp a lil' bit more.` 
          : "You don't have any level yet. Chat a lil' bit more and try again."
        );
      return;
    }

    let allLevels = await Level.find({ guildId: interaction.guild.id }).select('-_id userId level xp');

      allLevels.sort((a, b) => {
        if (a.level === b.level) {
          return b.xp - a.xp;
        } else {
          return b.level - a.level;
        }
      });

      let currentRank = allLevels.findIndex((lvl) => lvl.userId === targetUserId) + 1;

      try {
        const rank = new RankCardBuilder()
        .setAvatar(targetUserObj.displayAvatarURL({ size: 256 }))
        .setRank(currentRank)
        .setLevel(fetchedLevel.level)
        .setCurrentXP(fetchedLevel.xp)
        .setRequiredXP(calculateLevelXp(fetchedLevel.level))
        .setStatus(targetUserObj.presence?.status || 'Offline')
        .setUsername(targetUserObj.user.username)
        
        const data = await rank.build();
        const attachment = new AttachmentBuilder(data, { name: 'rank.png' });
        interaction.editReply({ files: [attachment] });
      } catch (error) {
        console.log(`There was an error while genereting rank card: ${error}`);
      }
    },

    name: 'level',
    description: "Show your level/someone level.",
    options: [
      {
        name: 'target-user',
        description: 'The user you want to see',
        type: ApplicationCommandOptionType.Mentionable,
      }
    ]
}