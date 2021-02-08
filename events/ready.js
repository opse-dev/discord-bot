module.exports = (client) => {
	require('../modules/gameday-channels');
	console.log(` \nLogged in as ${client.user.tag}!`);

	console.log(new Intl.DateTimeFormat('en', {
		timeZone: 'America/Toronto',
		year: 'numeric',
		month: 'short',
		day: 'numeric',
		hour: 'numeric',
		minute: 'numeric',
	}).format(new Date()))
};