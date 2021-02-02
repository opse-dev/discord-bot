exports.run = (client, message, args) => {
    let user = message.author

    console.log(`${user.username} typed the 'test' command.`);
};