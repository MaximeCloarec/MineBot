import config from "./config.json" assert { type: "json" };

import { createBot } from "mineflayer";
import { loader as autoEat } from "mineflayer-auto-eat";
import { plugin as collectBlockPlugin } from "mineflayer-collectblock";

import { pathfinder } from "mineflayer-pathfinder";

const bot = createBot({
    host: config.hosthost,
    port: config.port,
    username: config.username,
    hideErrors: false,
});

bot.loadPlugin(collectBlockPlugin);
bot.loadPlugin(pathfinder);
bot.loadPlugin(autoEat);

import commands from "./index.js";
import stateChecks from "./stateChecks.js";

bot.once("spawn", () => {
    bot.autoEat.enableAuto();
});

bot.on("chat", async (username, message) => {
    const [command, ...args] = message.split(" ");
    if (username === bot.username) return;

    if (commands[command]) {
        commands[command](bot, args);
    } else {
        bot.chat(`Commande inconnue : ${command}`);
    }
});

bot.on("health", () => {
    stateChecks.checkHealth(bot);
    stateChecks.checkFood(bot);
});

bot.on("kicked", (reason, loggedIn) => console.log(reason, loggedIn));
bot.on("error", (err) => console.log(err));
