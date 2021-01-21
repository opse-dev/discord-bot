const
    fs = require('fs'),
    axios = require('axios');
const { resolve } = require('path');

let commands = require('./commands.json');

exports.createCommand = (client, cmd_name, cmd_description, cmd_options, cmd_server) => {
    return new Promise(async resolve => {
        client.interactions.createCommand({
            name: cmd_name,
            description: cmd_description,
            options: cmd_options
        }, cmd_server).then(c => {
            commands.push({
                id: c.id,
                server: cmd_server,
                name: cmd_name,
                description: cmd_description,
                options: cmd_options
            });

            fs.writeFile('./commands/commands.json', JSON.stringify(commands, null, 4), (err) => {
                if (err) console.log(err);
                else {
                    console.log(`Created "/${c.name}" command with id "${c.id}"`);
                    resolve(c.id);
                }
            });
        })
    })
}

exports.deleteCommand = (client, cmd_id) => {
    return new Promise(async resolve => {
        client.interactions.deleteCommand(cmd_id)
            .then(e => {
                console.log(`Deleted command`);
                resolve("Deleted");
            });
    })
}

exports.loadCommands = (client) => {
    commands.map(c => {
        client.interactions.editCommand({
            name: c.name,
            description: c.description,
            options: c.options
        }, c.id, c.server).then(console.log(`Loaded "/${c.name}" command`));
    });
}