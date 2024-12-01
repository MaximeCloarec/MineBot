const { find, checkBlock, digBlock } = require("../utils/block");
const { goToBlock } = require("../utils/navigation");

async function gather(bot, resourceName) {
    try {
        const result = checkBlock(bot, resourceName);
        if (!result || result.type !== "block") {
            bot.chat("Je ne peux pas récolter cela !");
            
            return;
        }
        
        const block = find(bot, resourceName);
        if (!block) {
            bot.chat("Aucun bloc correspondant trouvé à proximité.");
            return;
        }

        await goToBlock(bot, block);
        await digBlock(bot, block);
        bot.chat(`J'ai collecté du ${resourceName} !`);
    } catch (err) {
        bot.chat("Une erreur est survenue lors de la collecte.");
        console.error(err);
    }
}

module.exports = { gather };
