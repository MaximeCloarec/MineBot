const config = require("./config.json");
const mineflayer = require("mineflayer");

const { pathfinder } = require("mineflayer-pathfinder");

const bot = mineflayer.createBot({
    host: config.host,
    port: config.port,
    username: config.username,
    hideErrors: false,
});

bot.loadPlugin(require("mineflayer-collectblock/lib").plugin);
bot.loadPlugin(pathfinder);

const commands = require("./index");


bot.on("chat", async (username, message) => {
    const [command, ...args] = message.split(" ");
    if (username === bot.username) return;

    if (commands[command]) {
        commands[command](bot, args);
    } else {
        bot.chat(`Commande inconnue : ${command}`);
    }
});


bot.on("kicked", (reason, loggedIn) => console.log(reason, loggedIn));
bot.on("error", (err) => console.log(err));
