function itemToString(item) {
    return `${item.name} x ${item.count}`;
}

function checkInventory(bot, itemName) {
    return bot.inventory.slots.some((slot) => slot && slot.name === itemName);
}

module.exports = { itemToString, checkInventory };
