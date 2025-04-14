import { checkBlock,putDown } from "../utils/block.js";
import { checkInventory } from "../utils/inventory.js";
import { equip } from "../utils/equip.js";

export async function place(bot, args) {
    const result = checkBlock(bot, args);
    if (!result || result.type !== "block") {
        bot.chat("Ce block n'existe pas !");
        return;
    }
    if (!checkInventory(bot, args)) {
        bot.chat("Je n'ai pas ce block dans mon inventaire");
        return;
    }
    await equip(bot, args);
    await putDown(bot);
}

