const { ApplicationCommandOptionType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle,
   ModalBuilder, TextInputBuilder, TextInputStyle} = require("discord.js");


module.exports = {
  name: 'surat',
  description: 'Kirim surat ke seseorang',
  options: [
    {
      name: 'penerima',
      description: 'Mau dikirm ke siapa?',
      type: ApplicationCommandOptionType.User,
      required: true,
    },
    {
      name: 'isi',
      description: 'Isi suratnya',
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: 'pengirim',
      description: 'Dari siapa surat ini dikirimkan?',
      type: ApplicationCommandOptionType.String,
      required: false,
    },
    {
      name: 'gambar',
      description: 'Gambar pendukung surat (opsional)',
      type: ApplicationCommandOptionType.Attachment,
      required: false,
    },      
  ],
  
  callback: async (client, interaction) => {
    try {
      if (interaction.commandName === 'surat') {
        const penerima = interaction.options.getUser('penerima');
        const pengirim = interaction.options.getString('pengirim') || "Anonim";
        const isiSurat = interaction.options.getString('isi');
        const gambar = interaction.options.getAttachment('gambar');

        //embed suratnya
        const suratEmbed = new EmbedBuilder()
          .setTitle(`📬 Surat Masuk!`)
          .setDescription(`Dari: **${pengirim}**\nUntuk: ${penerima.toString()}\n\n"${isiSurat}"`)
          .setColor('4CC9F0')
          .setTimestamp();

          if (gambar) {
            suratEmbed.setImage(gambar.url);
          };
                        
        //logic bales surat
        const customId = `balas_surat|${pengirim}`;

        const row = new ActionRowBuilder()
          .addComponents(
            new ButtonBuilder()
              .setCustomId(customId)
              .setLabel('Balas Surat 💌')
              .setStyle(ButtonStyle.Primary)
          );

          //kalo si penerima gak ketemu
          if (!penerima) return interaction.reply({ content: 'Gagal: penerima tidak ditemukan.', ephemeral: true });

          await interaction.channel.send({
            embeds: [suratEmbed],
            components: [row],
            allowedMentions: {
              users: [penerima.id]
            }
          });

          // Biar gak ada pesan reply ke user
          await interaction.deferReply({ ephemeral: true }); 
          await interaction.deleteReply(); 
        }
      } catch (error) {
          console.log(`There was an error: ${error}`);
        }
  }
};