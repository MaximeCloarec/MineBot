async function placeBlock() {
    const mcData = require("minecraft-data")(bot.version);
    try {
        await bot.equip(mcData.itemsByName["crafting_table"].id, "hand");
    } catch (err) {
        console.error(err);
    }
    try {
        await bot.placeBlock(
            bot.blockAt(bot.entity.position.offset(0, 0, 1)),
            new Vec3(0, 1, 0)
        );
        bot.world.blockUpdate(null, bot.entity.position.offset(0, 0, 1));
    } catch (err) {
        console.error(err);
    }
}

module.exports = { placeBlock };
