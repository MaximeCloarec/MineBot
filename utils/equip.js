export async function equip(bot, args) {
    const mcData = require("minecraft-data")(bot.version);
    try {
        await bot.equip(mcData.itemsByName[args].id, "hand");
    } catch (err) {
        console.log(err);
    }
    return;
}

