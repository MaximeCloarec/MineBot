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
        bot.memory.craftingTable[0]
    );
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

export function getCraftingTable(bot) {
    // Si une table est en mémoire
    if (bot.memory?.craftingTable?.length) {
        const pos = bot.memory.craftingTable[0];
        const block = bot.blockAt(pos);
        if (block && block.name === "crafting_table") return block;
    }

    // Sinon, on en cherche une autour
    const table = bot.findBlock({
        matching: (block) => block.name === "crafting_table",
        maxDistance: 10,
    });

    if (table) {
        bot.memory = bot.memory || {};
        bot.memory.craftingTable = [table.position];
        return table;
    }

    return null;
}

export function getFurnace(bot) {
    // Si un four est en mémoire
    if (bot.memory?.furnace?.length) {
        const pos = bot.memory.furnace[0];
        const block = bot.blockAt(pos);
        if (block && block.name === "furnace") return block;
    }

    // Sinon, on en cherche un autour
    const furnace = bot.findBlock({
        matching: (block) => block.name === "furnace",
        maxDistance: 10,
    });

    if (furnace) {
        bot.memory = bot.memory || {};
        bot.memory.furnace = [furnace.position];
        return furnace;
    }

    return null;
}
