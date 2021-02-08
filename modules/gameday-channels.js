const
    client = global.client,
    { BOT_TOKEN } = require('../config'),
    axios = require('axios'),
    schedule = require('node-schedule'),
    leagues = ["", "hs", "lol", "ow", "rl"],
    league_roleIDs = ["", "745728783667167425", "745729115482619945", "745729087716327425", "745729175242932235"],
    teamsInfo = require('../teamsInfo.json');

let delete_channels = () => {
    return new Promise(resolve => {
        let prom = client.channels.cache.filter(c => c.parentID == "806861228114837554").map(async c => { await c.delete(); });

        Promise.all(prom).then(() => {resolve()});
    });
}

let sendMsgNoPings = (channelID, msg) => {
	return new Promise((resolve, reject) => {
		axios({
			method: "POST",
			url: `https://discord.com/api/channels/${channelID}/messages`,
			headers: {
				"Authorization": `Bot ${BOT_TOKEN}`
			},
			data: {
				content: msg,
				allowed_mentions: {
					users: [],
					roles: []
				}
			}
		})
		.then(() => {resolve()})
		.catch(e => {
			console.log(e.response.data);
			reject(e);
		});
	})
}

let sendDefaultMSG = (cID, game) => {
    let date = new Date();
	let week = Math.floor(((date.getDate()-18)+(date.getMonth()+1))/7)+15;
	let short_month = new Intl.DateTimeFormat('en', { month: 'short' }).format(date);
	let msg = `
**Match Date:** ${short_month} ${date.getDate()}, ${date.getFullYear()}
­**Home Team:** <@&${teamsInfo.filter(t => t.id == game.teamID1)[0].roleID}>
**Away Team:** <@&${teamsInfo.filter(t => t.id == game.teamID2)[0].roleID}>
­
`;

	sendMsgNoPings(cID, msg).then(() => {
		sendMsgNoPings(cID, `http://api.opsesports.ca/image-generator/create/h2h?game=${leagues[game.leagueID]}&away_logo=${teamsInfo.filter(t => t.id == game.teamID1)[0].imgID}&home_logo=${teamsInfo.filter(t => t.id == game.teamID2)[0].imgID}&line1=${short_month}%20${date.getDate()},%20${date.getFullYear()}&line2=Regular+Season&line3=Week+${week}&download=true`)
	})
}

let create_channels = () => {
    let guild = client.guilds.cache.get("745724034490302494");
    axios({
        method: "GET",
        url: `http://api.opsesports.ca/games-today`,
    }).then(res => {
        res.data.map(g => {
            guild.channels.create(`${g.ID}-${leagues[g.leagueID]}-${teamsInfo.filter(t => t.id == g.teamID1)[0].abbr}-vs-${teamsInfo.filter(t => t.id == g.teamID2)[0].abbr}`, { type: 'text' }).then(c => {
                c.setParent("806861228114837554");
                c.overwritePermissions([
                    {
                        id: "745724034490302494",
                        deny: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY'],
                    },
                    {
                        id: "806833582605467658",
                        allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY'],
                    },
                    {
                        id: teamsInfo.filter(t => t.id == g.teamID1)[0].roleID,
                        allow: ['VIEW_CHANNEL'],
                        deny: ['SEND_MESSAGES', 'READ_MESSAGE_HISTORY'],
                    },
                    {
                        id: teamsInfo.filter(t => t.id == g.teamID2)[0].roleID,
                        allow: ['VIEW_CHANNEL'],
                        deny: ['SEND_MESSAGES', 'READ_MESSAGE_HISTORY'],
                    },
                    {
                        id: league_roleIDs[g.leagueID],
                        allow: ['SEND_MESSAGES', 'READ_MESSAGE_HISTORY'],
                    },
                ]);

                c.setTopic(`Game Time: ${new Intl.DateTimeFormat('en', {
                    timeZone: 'America/Toronto',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                }).format(new Date(g.date))}`);
                sendDefaultMSG(c.id, g);
            }).catch(e => console.log(e));
            
            guild.channels.create(`[${leagues[g.leagueID].toLocaleUpperCase()}] ${teamsInfo.filter(t => t.id == g.teamID1)[0].name}`, { type: 'voice' }).then(async c => {
                c.setParent("806861228114837554");
                c.overwritePermissions([
                    {
                        id: "745724034490302494",
                        deny: ['VIEW_CHANNEL'],
                    },
                    {
                        id: "806833582605467658",
                        allow: ['VIEW_CHANNEL'],
                    },
                    {
                        id: teamsInfo.filter(t => t.id == g.teamID1)[0].roleID,
                        allow: ['VIEW_CHANNEL'],
                        deny: ['CONNECT'],
                    },
                    {
                        id: league_roleIDs[g.leagueID],
                        allow: ['CONNECT'],
                    },
                ]);
            }).catch(e => console.log(e));
            
            guild.channels.create(`[${leagues[g.leagueID].toLocaleUpperCase()}] ${teamsInfo.filter(t => t.id == g.teamID2)[0].name}`, { type: 'voice' }).then(async c => {
                c.setParent("806861228114837554");
                c.overwritePermissions([
                    {
                        id: "745724034490302494",
                        deny: ['VIEW_CHANNEL'],
                    },
                    {
                        id: "806833582605467658",
                        allow: ['VIEW_CHANNEL'],
                    },
                    {
                        id: teamsInfo.filter(t => t.id == g.teamID2)[0].roleID,
                        allow: ['VIEW_CHANNEL'],
                        deny: ['CONNECT'],
                    },
                    {
                        id: league_roleIDs[g.leagueID],
                        allow: ['CONNECT'],
                    },
                ]);
            }).catch(e => console.log(e));
        });
    }).catch(e => {
        console.log(e.response.data);
    });
}

let run_schedule = () => {
    delete_channels().then(setTimeout(create_channels, 2000))
}

// schedule.scheduleJob('35 * * * * *', run_schedule);
schedule.scheduleJob('00 09 * * *', run_schedule);