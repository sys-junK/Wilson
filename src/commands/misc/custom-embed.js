const { ApplicationCommandOptionType, EmbedBuilder, ModalBuilder, TextInputStyle, TextInputBuilder, ActionRowBuilder, ActionRow } = require("discord.js");
const { name, description, callback } = require("./ping");
const { options } = require("./say");


module.exports = {
    name: 'custom-embed',
    description: 'Make a custom embed',
    devOnly: false,
    options: [
        {
          name: 'image',
          description: 'Set custom image for your embed',
          type: ApplicationCommandOptionType.Attachment,
          required: false,
        },
        {
          name: 'thumbnail',
          description: 'Embed thumbnail',
          type: ApplicationCommandOptionType.Attachment,
        }
    ],

    callback: async (client, interaction) => {
        if (interaction.commandName === 'custom-embed') {
            const image = interaction.options.getAttachment('image')
            const thumbnail = interaction.options.getAttachment('thumbnail')
          
            const modal = new ModalBuilder()
              .setCustomId('customEmbedModal')
              .setTitle('Buat Embed');

            const titleInput = new TextInputBuilder()
              .setCustomId("embedTitle")
              .setLabel("Judul")
              .setStyle(TextInputStyle.Short)
              .setRequired(true);

            const descInput = new TextInputBuilder()
              .setCustomId('embedDesc')
              .setLabel('Deskripsi')
              .setStyle(TextInputStyle.Paragraph)
              .setRequired(true);

            const footerInput = new TextInputBuilder()
              .setCustomId('embedFooter')
              .setLabel('Footer')
              .setStyle(TextInputStyle.Short)
              .setRequired(false);

            const modalComponents = [
              new ActionRowBuilder().addComponents(titleInput),
              new ActionRowBuilder().addComponents(descInput),
              new ActionRowBuilder().addComponents(footerInput),
            ];

            modal.addComponents(...modalComponents);

            await interaction.showModal(modal)
            client.once('interactionCreate', async (modalSubmit) => {
              if (!modalSubmit.isModalSubmit()) return;
              if (modalSubmit.customId !== 'customEmbedModal') return;
            

              const judul = modalSubmit.fields.getTextInputValue('embedTitle');
              const deskripsi = modalSubmit.fields.getTextInputValue('embedDesc');
              const footer = modalSubmit.fields.getTextInputValue('embedFooter');

              const embed = new EmbedBuilder()
                .setTitle(judul)
                .setDescription(deskripsi)
                .setColor('#4CC9F0')
                .setFooter({ text: footer })
                .setTimestamp()

              if (footer) embed.setFooter({ text: footer });
              if (image?.url) embed.setImage(image.url);
              if (thumbnail?.url) embed.setThumbnail(thumbnail.url);
              
              await modalSubmit.deferReply({ ephemeral: true });
              await modalSubmit.channel.send({ embeds: [embed] });
            });
        }
    }
};