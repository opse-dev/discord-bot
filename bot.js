const
    { BOT_TOKEN, CLIENT_ID, SERVER_MAIN_ID, SERVER_TEST_ID } = require('./config'),
    discord = require('discord.js'),
    interactions = require("discord-slash-commands-client"),
    commands = require('./commands');

const client = new discord.Client();
client.interactions = new interactions.Client(BOT_TOKEN, CLIENT_ID);

client.on('ready', () => {
    console.log(`Logged in as: ${client.user.tag}!`);

    commands.loadCommands(client);
});


client.ws.on('INTERACTION_CREATE', async interaction => {
    const guild = client.guilds.cache.get(interaction.guild_id);
    const member = await guild.members.fetch(interaction.member.user.id);
    const command = interaction.data.name.toLowerCase();
    const args = interaction.data.options;

    // SWITCH command
});


client.login(BOT_TOKEN);