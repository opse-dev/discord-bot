require('dotenv-flow').config();
const
    { BOT_TOKEN, CLIENT_ID, ADMIN_SERVER_ID } = require('./config'),
    axios = require('axios'),
    cmdName = process.argv[2];

if (!cmdName) console.log("No Command Specified");
else {
    axios({
        method: "GET",
        url: `https://discord.com/api/v8/applications/${CLIENT_ID}/guilds/${ADMIN_SERVER_ID}/commands`,
        headers: {
            "Authorization": `Bot ${BOT_TOKEN}`
        }
    })
    .then(res => {
        let cID = null;
        let prom = res.data.map(c => {if (c.name == cmdName) cID = c.id});
        Promise.all(prom).then(() => {
            if (cID != null) {
                axios({
                    method: "DELETE",
                    url: `https://discord.com/api/v8/applications/${CLIENT_ID}/guilds/${ADMIN_SERVER_ID}/commands/${cID}`,
                    headers: {
                        "Authorization": `Bot ${BOT_TOKEN}`
                    }
                })
                .then(() => {
                    console.log(`Deleted ${cmdName}`);
                })
                .catch(e => {
                    console.log(e.response.data);
                });
            }
            else console.log("Command does not exist")
        });
    })
    .catch(e => {
        console.log(e.response.data);
    });
}