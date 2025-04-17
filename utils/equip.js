import MinecraftData from "minecraft-data";

export async function equip(bot, args) {
    const mcData = MinecraftData(bot.version);
    try {
        await bot.equip(mcData.itemsByName[args].id, "hand");
    } catch (err) {
        console.log(err);
    }
    return;
}

