import { checkBlock,checkRecipe,checkAvailable } from "../utils/block.js";
import MinecraftData from "minecraft-data";

export async function craftResource(bot, args) {
    // const mcData = require("minecraft-data")(bot.version);
    // Vérifie si l'élément existe
    const result = checkBlock(bot, args);
    if (!result) {
        bot.chat("Ceci n'existe pas !");
        return false;
    }

    // Parcourt toutes les recettes possibles pour l'item
    const recipes = checkRecipe(bot, args);
    for (const recipe of recipes) {
        // Vérifie si cette recette est directement réalisable
        if (checkAvailable(bot, [recipe])) {
            try {
                await bot.craft(recipe);
                bot.chat(`J'ai crafté ${args}`);
                return true;
            } catch (err) {
                console.error(`Erreur lors du craft de ${args} :`, err);
                return false;
            }
        }

        // Récupère les ingrédients manquants pour cette recette
        const missing = recipe.delta.filter((item) => item.count < 0);
        for (const ingredient of missing) {
            const ingName = MinecraftData(bot.version).items[ingredient.id]?.name;
            const count = bot.inventory.count(ingredient.id, null);

            // Si l'ingrédient est manquant, tente de le crafter
            if (count < Math.abs(ingredient.count)) {
                const success = await craftResource(bot, ingName);
                if (!success) {
                    break; // Abandonne cette recette et passe à la suivante
                }
            }
        }

        // Re-vérifie si le craft est possible après avoir obtenu les ingrédients
        if (checkAvailable(bot, [recipe])) {
            try {
                await bot.craft(recipe);
                bot.chat(`J'ai crafté ${args}`);
                return true;
            } catch (err) {
                console.error(`Erreur lors du craft final de ${args} :`, err);
                return false;
            }
        }
    }

    // Si aucune recette n'a fonctionné
    return false;
}

