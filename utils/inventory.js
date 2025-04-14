export function itemToString(item) {
    return `${item.name} x ${item.count}`;
}

export function checkInventory(bot, itemName) {
    return bot.inventory.slots.some((slot) => slot && slot.name === itemName);
}

