require('dotenv-flow').config();
const
    { BOT_TOKEN } = require('./config'),
    discord = require('discord.js'),
    fs = require('fs'),
    client = new discord.Client();

client.commands = {};
console.log(` \nLoading Commands and events:\n `);

// Loading Events
fs.readdir('./events/', async (err, files) => {
    if (err) return console.error;
    console.log('• Events:');
    files.forEach(file => {
        if (!file.endsWith('.js')) return;
        const evt = require(`./events/${file}`);
        let evtName = file.split('.')[0];
        console.log(` - Loaded → ${evtName}`);
        client.on(evtName, evt.bind(null, client));
    });
    console.log(' ');
});

// Loading Commands
fs.readdir('./commands/', async (err, files) => {
    if (err) return console.error;
    console.log('• Commands:');
    files.forEach(file => {
        if (!file.endsWith('.js')) return;
        let cmdName = file.split('.')[0];
        client.commands[cmdName] = require(`./commands/${file}`);
        console.log(` - Loaded → ${cmdName}`);
    });
    console.log(' ');
});

// Loading Slash Commands
fs.readdir('./commands/slash-commands', async (err, files) => {
    if (err) return console.error;
    console.log('• Slash Commands:');
    files.forEach(file => {
        if (!file.endsWith('.js')) return;
        require(`./commands/slash-commands/${file}`)(client);
        console.log(` - Loaded → /${file.split('.')[0]}`);
    });
    console.log(' ');
});

global.client = client;
client.login(BOT_TOKEN);