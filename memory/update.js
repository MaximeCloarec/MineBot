import { find } from "../utils/block.js";

export function scanNearbyBlocks(bot) {
bot.memory.craftingTable = find(bot, "crafting_table", 1);
bot.memory.furnace = find(bot, "furnace", 1);
bot.memory.chests = find(bot, "chest", 5);
}

export function updateMemory(bot) {
    scanNearbyBlocks(bot);
}
