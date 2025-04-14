export default {
    checkHealth(bot) {
        if (bot.health < 10) {
            bot.chat("Ma santé est basse");
        }
    },
    checkFood(bot) {
        if (bot.food < 10) {
            bot.chat("J'ai faim");
        }
    },
};
