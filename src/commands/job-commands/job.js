const { EmbedBuilder } = require('discord.js');
const Job = require('../../models/Job')

module.exports = {
    name: 'job',
    description: 'Choose a job to apply for',
    options: false,


    /**
     * 
     * @param {interaction} interaction 
     */
    callback: async (interaction) => {
        try {
            const job = await Job.findOne();
            if (job.length === 0) {
                return interaction.reply('No job available now. Please try again later.');
            }

            const embed = new EmbedBuilder()
                .setTitle('Available Jobs')
                .setColor('#4CC9F0')
                .setDescription(job.map(Job => `${job.emoji || '🔧'} ${job.name}`).join('\n'));

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            return interaction.reply('An error occured while processing your request. Please try again later.')
        }
    }
};