import { itemToString } from "../utils/inventory.js";

export function sayItems(bot) {
    const items = bot.inventory.items();

    // Ajoute l'objet dans la main gauche si nécessaire
    if (bot.registry.isNewerOrEqualTo("1.9") && bot.inventory.slots[45]) {
        items.push(bot.inventory.slots[45]);
    }

    const output = Array.from(items).map(itemToString).join(", ");
    bot.chat(output || "empty");
}
