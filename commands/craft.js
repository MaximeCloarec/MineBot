const { checkBlock, checkRecipe } = require("../utils/block");

async function craftPlank(bot) {
    const mcData = require("minecraft-data")(bot.version);
    const recipe = bot.recipesFor(
        mcData.itemsByName["oak_planks"].id,
        null,
        null,
        null
    )[0];
    console.log(recipe);

    await bot.craft(recipe, 1);
}

async function craftTable(bot) {
    const mcData = require("minecraft-data")(bot.version);
    const recipe = bot.recipesFor(
        mcData.itemsByName["crafting_table"].id,
        null,
        null,
        null
    )[0];
    console.log(recipe);
    try {
        await bot.craft(recipe, 1);
        bot.chat("J'ai craft une table !!!");
    } catch (err) {
        console.error(err);
    }
}

async function craft(bot, args) {
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

module.exports = { craftPlank, craftTable, craft     };
