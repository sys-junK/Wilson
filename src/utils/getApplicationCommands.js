module.exports = async (client, guildId) => {
    let applicationCommnads;

    if (guildId) {
        const guild = await client.guilds.fetch(guildId);
        applicationCommnads = guild.commands;
    } else {
        applicationCommnads = await client.application.commands;
    }

    await applicationCommnads.fetch();
    return applicationCommnads;
} 