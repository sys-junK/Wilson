require('dotenv').config();
const { Client, IntentsBitField, EmbedBuilder, Options, ActivityType } = require('discord.js');
const eventHandler = require('./handlers/event-handler');
const mongoose = require('mongoose');

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.GuildPresences,
        IntentsBitField.Flags.MessageContent,
        IntentsBitField.Flags.GuildVoiceStates,
    ],
});

//connect to mongodb
(async () => {
    try {
        mongoose.set('strictQuery', false);
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to mongodb', mongoose.connection.name);

        eventHandler(client); 

        client.login(process.env.TOKEN);
    } catch (error) {
        console.log(`There was an error while connecting to mongodb: ${error}`);
    }
})();