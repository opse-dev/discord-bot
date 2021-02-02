const
    { BOT_PREFIX } = require('../config');

module.exports = async (client, message) => {
    if (message.author.bot) return;

    if (message.content.indexOf(BOT_PREFIX) !== 0) return;

	let args = message.content
		.slice(BOT_PREFIX.length)
		.trim()
		.split(/ +/g);
    
    const
        command = args.shift().toLocaleLowerCase(),
        cmd = client.commands[command];

	if (!cmd) return;
    cmd.run(client, message, args);
};