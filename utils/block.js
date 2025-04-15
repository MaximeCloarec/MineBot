import { Vec3 } from "vec3";
import MinecraftData from "minecraft-data";

export function find(bot, resource, count) {
    const search = bot.findBlocks({
        matching: (block) => block.name.includes(resource),
        maxDistance: 15,
        count: count,
    });
    return search;
}

export async function digBlock(bot, resource) {
    try {
        // Regarde le bloc pour commencer à le miner
        await bot.lookAt(resource.position.offset(0.5, 0.5, 0.5), true);
        await bot.dig(resource);
    } catch (err) {
        bot.chat("Erreur lors du minage du bloc !");
        console.error(err);
    }
}

export function checkBlock(bot, resource) {
    const item = MinecraftData(bot.version).itemsByName[resource];
    const block = MinecraftData(bot.version).blocksByName[resource];
    if (!item && !block) {
        return null;
    }

    return {
        name: resource,
        type: block ? "block" : "item",
        data: block || item,
    };
}

export function checkRecipe(bot, resource) {
    const recipe = bot.recipesAll(
        MinecraftData(bot.version).itemsByName[resource].id,
        null,
        null,
        bot.memory.craftingTable
    );
    console.log(recipe,bot.memory.craftingTable);
    return recipe;
}

export function checkAvailable(bot, recipes) {
    for (const recipe of recipes) {
        // Vérifie chaque ingrédient nécessaire
        const ingredients = recipe.delta.filter((item) => item.count < 0);
        const hasAllIngredients = ingredients.every((ingredient) => {
            const itemInInventory = bot.inventory.count(ingredient.id, null);
            return itemInInventory >= Math.abs(ingredient.count);
        });

        if (hasAllIngredients) {
            return recipe; // Retourne la première recette valide
        }
    }
    return null; // Aucune recette disponible
}

export async function putDown(bot) {
    try {
        await bot.placeBlock(
            bot.blockAt(bot.entity.position.offset(0, 0, 1)),
            new Vec3(0, 1, 0)
        );
    } catch (err) {
        console.log(err);
    }
}
