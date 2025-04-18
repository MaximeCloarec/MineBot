import MinecraftData from "minecraft-data";
import { getCraftingTable } from "../utils/block.js";
import { tryCraft, generateCraftPlan } from "../utils/crafting.js";

export async function craftResource(bot, itemName) {
    const mcData = MinecraftData(bot.version);
    const plan = {};
    const canCraft = await generateCraftPlan(bot, itemName, 1, plan);
    
    if (!canCraft) {
        console.log(`Impossible de créer un plan pour ${itemName}`);
        return false;
    }

    for (const name of plan._order) {
        const item = mcData.itemsByName[name];
        if (!item) continue;

        const recipes = bot.recipesAll(item.id, null, getCraftingTable(bot));

        let recipe = null;
        for (const r of recipes) {
            const canCraft = r.delta.flat().every((entry) => {
                if (!entry || entry.count >= 0) return true;
                const ingName = mcData.items[entry.id]?.name;
                const count = bot.inventory.count(entry.id, null);
                return count >= Math.abs(entry.count);
            });
            if (canCraft) {
                recipe = r;
                break;
            }
        }

        if (!recipe) {
            console.log(`❌ Aucune recette réalisable pour ${name}`);
            return false;
        }

        const craftPerOp = recipe.result?.count || 1;
        const totalNeeded = (plan[name] || 0) * craftPerOp;
        const inInventory = bot.inventory.count(item.id, null);

        if (inInventory >= totalNeeded) {
            continue;
        }

        const remainingToCraft = Math.ceil(
            (totalNeeded - inInventory) / craftPerOp
        );
        if (remainingToCraft <= 0) {
            continue;
        }

        for (const line of recipe.delta) {
            const entries = Array.isArray(line) ? line : [line];
            for (const entry of entries) {
                if (!entry || entry.count >= 0) continue;
                const ingName = mcData.items[entry.id]?.name;
                const count = bot.inventory.count(entry.id, null);
                console.log(`- ${ingName} : ${count} en stock`);
            }
        }

        const success = await tryCraft(bot, recipe, name, remainingToCraft);
        if (!success) return false;

        await bot.waitForTicks(1);
    }

    return true;
}
