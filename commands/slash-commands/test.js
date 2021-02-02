const
    { BOT_TOKEN, CLIENT_ID, ADMIN_SERVER_ID } = require('../../config'),
    path = require('path'),
    axios = require('axios');

module.exports = (client) => {
    axios({
        method: "POST",
        url: `https://discord.com/api/v8/applications/${CLIENT_ID}/guilds/${ADMIN_SERVER_ID}/commands`,
        headers: {
            "Authorization": `Bot ${BOT_TOKEN}`
        },
        data: {
            name: path.basename(__filename, '.js'),
            description: "Test Command",
            options: [
                {
                    "name": "action",
                    "description": "Yes or No",
                    "type": 3,
                    "required": true,
                    "choices": [
                        {
                            "name": "yes",
                            "value": "yes"
                        },
                        {
                            "name": "no",
                            "value": "no"
                        }
                    ]
                }
            ]
        }
    }).catch(e => {
        console.log(e.response.data);
    });

    client.ws.on('INTERACTION_CREATE', async interaction => {
        const guild = client.guilds.cache.get(interaction.guild_id),
            member = await guild.members.fetch(interaction.member.user.id),
            command = interaction.data.name.toLowerCase(),
            args = interaction.data.options;
    
        if (command == path.basename(__filename, '.js')) {
            // HANDLE COMMAND
            console.log("TEST")
        }
    });
};