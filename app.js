require('dotenv-flow').config();
const
    { BOT_TOKEN } = require('./config'),
    discord = require('discord.js'),
    commands = require('./commands');

const client = new discord.Client();

client.on('ready', () => {
    console.log(`Logged in as: ${client.user.tag}!`);

    commands.loadCommands();
});


client.ws.on('INTERACTION_CREATE', async interaction => {
    const guild = client.guilds.cache.get(interaction.guild_id);
    const member = await guild.members.fetch(interaction.member.user.id);
    const command = interaction.data.name.toLowerCase();
    const args = interaction.data.options;

    // SWITCH command
    console.log(command)
});


client.login(BOT_TOKEN);