import { sayItems } from "./commands/inventory.js";
import { getOverHere } from "./commands/moveTo.js";
import { gather } from "./commands/gather.js";
import { craftResource } from "./commands/craft.js";
import { place } from "./commands/place.js";

export default {
    loaded: async (bot) => {
        await bot.waitForChunksToLoad();
        bot.chat("Ready");
    },

    list: (bot) => sayItems(bot),

    getOverHere: (bot) => getOverHere(bot),

    gather: (bot, args) => {
        if (args.length > 0) {
            gather(bot, args[0], args[1]);
        } else {
            bot.chat("Tu dois me dire quoi récupérer !");
        }
    },

    craft: (bot, args) => {
        if (args.length > 0) {
            craftResource(bot, args[0]);
        } else {
            bot.chat("Tu dois me dire quoi crafter !");
        }
    },

    place: (bot, args) => {
        if (args.length > 0) {
            place(bot, args[0]);
        } else {
            bot.chat("Tu dois me dire quoi mettre au sol !");
        }
    },
};
