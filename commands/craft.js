import MinecraftData from "minecraft-data";

function getCraftingTable(bot) {
    const mcData = MinecraftData(bot.version);

    // Si une table est en mémoire
    if (bot.memory?.craftingTable?.length) {
        const pos = bot.memory.craftingTable[0];
        const block = bot.blockAt(pos);
        if (block && block.name === "crafting_table") return block;
    }

    // Sinon, on en cherche une autour
    const table = bot.findBlock({
        matching: (block) => block.name === "crafting_table",
        maxDistance: 6,
    });

    if (table) {
        bot.memory = bot.memory || {};
        bot.memory.craftingTable = [table.position];
        return table;
    }

    return null;
}

async function tryCraft(bot, recipe, itemName, count = 1) {
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

async function generateCraftPlan(bot, itemName, amount, plan = {}, path = []) {
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

export async function craftResource(bot, itemName) {
    const mcData = MinecraftData(bot.version);
    const plan = {};

    bot.chat(`🔍 Planification du craft de : ${itemName}`);

    const canCraft = await generateCraftPlan(bot, itemName, 1, plan);
    if (!canCraft) {
        bot.chat(`❌ Impossible de créer un plan pour ${itemName}`);
        console.log("📦 Plan final :", plan);
        console.log("📦 Réservations :", plan._reserved || {});
        return false;
    }

    bot.chat(`🧩 Plan établi pour ${itemName} :`);
    console.log("📦 Plan :", plan);
    console.log("📦 Réservations :", plan._reserved || {});

    for (const name of plan._order) {
        const item = mcData.itemsByName[name];
        if (!item) continue;

        const recipes = bot.recipesAll(item.id, null, getCraftingTable(bot));

        let recipe = null;
        console.log(`🔍 Vérification des recettes pour ${name}`);
        for (const r of recipes) {
            console.log(`Recette :`, r.delta);
            const canCraft = r.delta.flat().every((entry) => {
                if (!entry || entry.count >= 0) return true;
                const ingName = mcData.items[entry.id]?.name;
                const count = bot.inventory.count(entry.id, null);
                console.log(
                    `- ${ingName} : ${count} en stock, requis : ${Math.abs(
                        entry.count
                    )}`
                );
                return count >= Math.abs(entry.count);
            });
            console.log(`Recette réalisable : ${canCraft}`);
            if (canCraft) {
                recipe = r;
                break;
            }
        }

        if (!recipe) {
            bot.chat(`❌ Aucune recette réalisable pour ${name}`);
            return false;
        }

        const craftPerOp = recipe.result?.count || 1;
        const totalNeeded = (plan[name] || 0) * craftPerOp;
        const inInventory = bot.inventory.count(item.id, null);

        if (inInventory >= totalNeeded) {
            bot.chat(`✔️ ${name} déjà présent (${inInventory}/${totalNeeded})`);
            continue;
        }

        const remainingToCraft = Math.ceil(
            (totalNeeded - inInventory) / craftPerOp
        );
        if (remainingToCraft <= 0) {
            bot.chat(
                `✔️ ${name} suffisant après vérif (${inInventory}/${totalNeeded})`
            );
            continue;
        }

        // 🛠️ DEBUG : Affichage recette
        console.log(`🛠️ Tentative de craft : ${name} x${remainingToCraft}`);
        console.log(`📦 Recette delta :`);
        for (const line of recipe.delta) {
            const entries = Array.isArray(line) ? line : [line];
            console.log(
                entries
                    .filter((entry) => entry && entry.count < 0)
                    .map((entry) => {
                        const ingName =
                            mcData.items[entry.id]?.name || entry.id;
                        return `${ingName} x${Math.abs(entry.count)}`;
                    })
            );
        }

        console.log(`📦 Inventaire actuel des ingrédients :`);
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
