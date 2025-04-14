import { find } from "../utils/block.js";

export async function gather(bot, resourceName, qty) {
    const targets = [];

    const blocks = find(bot, resourceName, qty);
    for (let i = 0; i < Math.min(blocks.length, qty); i++) {
        targets.push(bot.blockAt(blocks[i])); 
    }

    try {
        await bot.collectBlock.collect(targets);

        bot.chat("Terminé");
    } catch (err) {
        bot.chat("Une erreur est survenue lors de la collecte.");
        console.error(err);
    }
}
