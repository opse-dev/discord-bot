const
    { BOT_TOKEN, CLIENT_ID, SERVER_ID } = require('../../config'),
    path = require('path'),
    axios = require('axios');

module.exports = (client) => {
    axios({
        method: "POST",
        url: `https://discord.com/api/v8/applications/${CLIENT_ID}/guilds/${SERVER_ID}/commands`,
        headers: {
            "Authorization": `Bot ${BOT_TOKEN}`
        },
        data: {
            name: path.basename(__filename, '.js'),
            description: "Summon a user in the voice channel",
            options: [
                {
                    "name": "user",
                    "description": "Who do you want to summon?",
                    "type": 6,
                    "required": true
                },
                {
                    "name": "channel",
                    "description": "Where do you want to summon (defaults to your voice channel).",
                    "type": 3,
                    "required": false,
                    "choices": [
                        {
                            "name": "Observer",
                            "value": "765652867427205150"
                        },
                        {
                            "name": "On-Deck",
                            "value": "765652809000550451"
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
            if (!member.permissions.has("MOVE_MEMBERS")) return client.api.interactions(interaction.id, interaction.token).callback.post({data: {
                type: 4,
                data: {
                    content: `You don have permissions to use this command`
                }
            }});

            let summon_user = await guild.members.fetch(args[0].value);

            if (!summon_user.voice.channelID) client.api.interactions(interaction.id, interaction.token).callback.post({data: {
                type: 4,
                data: {
                    content: `<@${summon_user.id}> is not in a voice channel`,
                    allowed_mentions: {
                        users: []
                    }
                }
            }});
            else {
                if (!args[1] && !member.voice.channelID) client.api.interactions(interaction.id, interaction.token).callback.post({data: {
                    type: 4,
                    data: {
                        content: `No voice channel specified. Join a voice channel or provide one.`
                    }
                }});
                else {
                    summon_user.voice.setChannel(args[1]?args[1].value:member.voice.channelID);
                    client.api.interactions(interaction.id, interaction.token).callback.post({data: {
                        type: 5
                    }});
                }
            }
        }
    });
};