const { checkBlock, checkRecipe } = require("../utils/block");

async function craft(bot, args,qty) {
    const result = checkBlock(bot, args);
    if (!result || result.type !== "block") {
        bot.chat("Ce block n'existe pas !");
        return;
    }
    
    const recipe = checkRecipe(bot, args);
    if (!recipe) {
        bot.chat("Impossible de crafter cela !");
        return;
    }
    
    try {
        await bot.craft(recipe);
    } catch (err) {
        console.error(err);
    }
}

module.exports = { craft };
