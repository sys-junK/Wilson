// File: commands/misc/say.js
const { MessageFlags } = require('discord.js');
const { callback } = require("./ping");

module.exports = {
    name: 'say',
    description: 'Replies with the message you provide.',
    options: [
      {
        name: 'text',
        description: 'Text to say',
        type: 3, // 3 = STRING
        required: true,
      }
    ],
    callback: async (client, interaction) => {
      const text = interaction.options.getString('text');
      //hapus otomatis reply
      await interaction.deferReply({ flags: MessageFlags.Ephemeral });
      await interaction.deleteReply().catch(() => {});
      //kirim ulang pesan sebagai bot
      await interaction.channel.send({ content: text });
    }
  };
  