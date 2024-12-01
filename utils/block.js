//Permet de trouver un maximum de 8 block contenant le mot "log" a une distance de 15 block autour de lui et renvoie un tableau de coordonée GPS (X,Y,Z)
function find(bot, resource) {
    const search = bot.findBlock({
        matching: (block) => block.name.includes(resource),
        maxDistance: 15,
    });
    return search;
}

async function digBlock(bot, resource) {
    try {
        // Regarde le bloc pour commencer à le miner
        await bot.lookAt(resource.position.offset(0.5, 0.5, 0.5), true);
        await bot.dig(resource);
    } catch (err) {
        bot.chat("Erreur lors du minage du bloc !");
        console.error(err);
    }
}

function checkBlock(bot, resource) {
    const mcData = require("minecraft-data")(bot.version);
    const item = mcData.itemsByName[resource];
    const block = mcData.blocksByName[resource];

    if (!item && !block) {
        bot.chat(`Je ne connais pas la ressource : ${resource}`);
        return null;
    }

    return {
        name: resource,
        type: block ? "block" : "item",
        data: block || item,
    };
}
function checkRecipe(bot, resource) {
    const mcData = require("minecraft-data")(bot.version);
    const recipe = bot.recipesFor(
        mcData.itemsByName[resource].id,
        null,
        null,
        null
    )[0];
    return recipe;
}

module.exports = { find, digBlock, checkBlock, checkRecipe };
