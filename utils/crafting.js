import MinecraftData from "minecraft-data";
import { getCraftingTable } from "./block.js";

export async function tryCraft(bot, recipe, itemName, count = 1) {
    try {
        const table = getCraftingTable(bot, recipe);
        await bot.craft(recipe, count, table);
        bot.chat(`✅ Crafté ${itemName} x${count}`);
        return true;
    } catch (err) {
        bot.chat(`❌ Échec du craft de ${itemName} : ${err.message}`);
        console.error(err);
        return false;
    }
}

export async function generateCraftPlan(
    bot,
    itemName,
    amount,
    plan = {},
    path = []
) {
    const mcData = MinecraftData(bot.version);
    const item = mcData.itemsByName[itemName];
    if (!item) {
        bot.chat(`❌ L'objet ${itemName} n'existe pas.`);
        return false;
    }

    if (path.includes(itemName)) return false;
    const newPath = [...path, itemName];

    const inInventory = bot.inventory.count(item.id, null);
    const existingPlanned =
        (plan[itemName] || 0) * (plan._craftedCount?.[itemName] || 1);
    const reserved = plan._reserved?.[itemName] || 0;
    const totalNeeded = Math.max(
        0,
        amount + reserved - inInventory - existingPlanned
    );

    if (totalNeeded <= 0) return true;

    const recipes = bot.recipesAll(item.id, null, getCraftingTable(bot));
    for (const recipe of recipes) {
        if (!recipe?.delta) continue;

        const resultCount = recipe.result?.count || 1;
        const craftsNeeded = Math.ceil(totalNeeded / resultCount);
        const flatIngredients = recipe.delta
            .flat()
            .filter((x) => x && x.count < 0);

        let canCraft = true;
        for (const ingredient of flatIngredients) {
            const ingredientName = mcData.items[ingredient.id]?.name;
            if (!ingredientName) continue;

            const requiredAmount = Math.abs(ingredient.count) * craftsNeeded;

            const success = await generateCraftPlan(
                bot,
                ingredientName,
                requiredAmount,
                plan,
                newPath
            );

            if (!success) {
                canCraft = false;
                break;
            }

            if (!plan._reserved) plan._reserved = {};
            plan._reserved[ingredientName] =
                (plan._reserved[ingredientName] || 0) + requiredAmount;
        }

        if (canCraft) {
            if (!plan._order) plan._order = [];
            if (!plan[itemName]) {
                plan[itemName] = craftsNeeded;
                plan._order.push(itemName);
            } else {
                plan[itemName] += craftsNeeded;
            }

            if (!plan._craftedCount) plan._craftedCount = {};
            plan._craftedCount[itemName] = resultCount;

            return true;
        }
    }

    return false;
}
