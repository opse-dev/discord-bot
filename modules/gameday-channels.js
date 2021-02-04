const
    client = global.client,
    axios = require('axios'),
    schedule = require('node-schedule'),
    leagues = ["", "hs", "lol", "ow", "rl"],
    league_roleIDs = ["", "745728783667167425", "745729115482619945", "745729087716327425", "745729175242932235"],
    teamsInfo = require('../teamsInfo.json');

let delete_channels = () => {
    return new Promise(resolve => {
        let prom = client.channels.cache.filter(c => c.parentID == "806861228114837554").map(c => { c.delete(); });

        Promise.all(prom).then(() => {resolve()});
    });
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

// schedule.scheduleJob('05 * * * * *', run_schedule);
schedule.scheduleJob('00 09 * * *', run_schedule);