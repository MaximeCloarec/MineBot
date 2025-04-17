// Description: This is the main file for the bot. It loads the configuration, creates the bot instance, and sets up the commands and events.
import repl from "repl";
// Import the configuration file
// Note: The config.json file should be in the same directory as this file
import config from "./config.json" assert { type: "json" };

// Import the required modules
import { createBot } from "mineflayer";
import { loader as autoEat } from "mineflayer-auto-eat";
import { plugin as collectBlockPlugin } from "mineflayer-collectblock";
import { pathfinder } from "mineflayer-pathfinder";

//Create the bot instance
const bot = createBot({
    host: config.hosthost,
    port: config.port,
    username: config.username,
    hideErrors: false,
});


// Load plugins
bot.loadPlugin(collectBlockPlugin);
bot.loadPlugin(pathfinder);
bot.loadPlugin(autoEat);


// Set up the bot commands
import commands from "./index.js";
bot.on("chat", async (username, message) => {
    const [command, ...args] = message.split(" ");
    if (username === bot.username) return;
    
    if (commands[command]) {
        commands[command](bot, args);
    } else {
        bot.chat(`Commande inconnue : ${command}`);
    }
});

// Set the bot's memory
import { initMemory, updateMemory } from "./memory/index.js";

bot.once("spawn", async () => {
    initMemory(bot);
    await bot.waitForChunksToLoad(); 
    updateMemory(bot);
    const r = repl.start("> ");
    r.context.bot = bot
});

// Handle bot events
bot.on("kicked", (reason, loggedIn) => console.log(reason, loggedIn));
bot.on("error", (err) => console.log(err));
