module.exports = (client) => {
	require('../modules/gameday-channels');
	console.log(` \nLogged in as ${client.user.tag}!`);
};