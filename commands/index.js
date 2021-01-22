const
    { BOT_TOKEN, CLIENT_ID, SERVER_ID } = require('../config'),
    fs = require('fs'),
    axios = require('axios').default;


let commands = require('./commands.json');

exports.createCommand = (cmd_name, cmd_description, cmd_options) => {
    return new Promise(async resolve => {
        axios({
            method: "POST",
            url: `https://discord.com/api/v8/applications/${CLIENT_ID}/guilds/${SERVER_ID}/commands`,
            headers: {
                "Authorization": `Bot ${BOT_TOKEN}`
            },
            data: {
                name: cmd_name,
                description: cmd_description,
                options: cmd_options
            }
        })
        .then(res => {
            let c = res.data;

            commands.push({
                id: c.id,
                server: SERVER_ID,
                name: c.name,
                description: c.description,
                options: c.options
            });

            fs.writeFile('./commands/commands.json', JSON.stringify(commands, null, 4), (err) => {
                if (err) console.log(err);
                else {
                    console.log(`Created "/${c.name}" command with id "${c.id}"`);
                    resolve(true);
                }
            });
        })
        .catch(e => {
            console.log(e.response.data);
            resolve(false);
        });
    });
}

exports.deleteCommand = (cmd_id) => {
    return new Promise(async resolve => {
        axios({
            method: "DELETE",
            url: `https://discord.com/api/v8/applications/${CLIENT_ID}/guilds/${SERVER_ID}/commands/${cmd_id}`,
            headers: {
                "Authorization": `Bot ${BOT_TOKEN}`
            }
        })
        .then(() => {
            console.log(`Deleted '${cmd_id}' command.`);
            resolve(true);
        })
        .catch(e => {
            console.log(e.response.data);
            resolve(false);
        });
    });
}

exports.loadCommands = () => {
    console.log(`\nLoading Commands:`)
    commands.map(c => {
        axios({
            method: "PATCH",
            url: `https://discord.com/api/v8/applications/${CLIENT_ID}/guilds/${SERVER_ID}/commands/${c.id}`,
            headers: {
                "Authorization": `Bot ${BOT_TOKEN}`
            },
            data: {
                name: c.name,
                description: c.description,
                options: c.options
            }
        }).then(() => console.log(`  • Updated '/${c.name}' command.`)).catch(() => console.log(`  • Loaded '/${c.name}' command.`));
    });
}