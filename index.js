module.exports = {
    loaded: async (bot) => {
        await bot.waitForChunksToLoad();
        bot.chat("Ready");
    },
    list: (bot) => require("./commands/inventory").sayItems(bot),
    getOverHere: (bot) => require("./commands/moveTo").getOverHere(bot),
    gather: (bot, args) => {
        const { gather } = require("./commands/gather");
        if (args.length > 0) {
            gather(bot, args[0],args[1]);
        } else {
            bot.chat("Tu dois me dire quoi récupérer !");
        }
    },
    craft: (bot, args) => {
        const { craft } = require("./commands/craft");
        if (args.length > 0) {
            craft(bot, args[0]);
        } else {
            bot.chat("Tu doit me dire quoi crafter !");
        }
    },
    place: (bot,args) => {
        const {place } = require("./commands/place");
        if (args.length > 0){
            place(bot,args[0]);
        }else{
            bot.chat("Tu doit me dire quoi mettre au sol !")
        }
    }
    // Ajouter d'autres commandes ici...
};
