const { checkBlock, putDown } = require("../utils/block");
const { checkInventory } = require("../utils/inventory");
const { equip } = require("../utils/equip");

// async function placeBlock() {
//     const mcData = require("minecraft-data")(bot.version);
//     try {
//         await bot.equip(mcData.itemsByName["crafting_table"].id, "hand");
//     } catch (err) {
//         console.error(err);
//     }
//     try {
//         await bot.placeBlock(
//             bot.blockAt(bot.entity.position.offset(0, 0, 1)),
//             new Vec3(0, 1, 0)
//         );
//         bot.world.blockUpdate(null, bot.entity.position.offset(0, 0, 1));
//     } catch (err) {
//         console.error(err);
//     }
// }

async function place(bot, args) {
    const result = checkBlock(bot, args);
    if (!result || result.type !== "block") {
        bot.chat("Ce block n'existe pas !");
        return;
    }
    if (!checkInventory(bot, args)) {
        bot.chat("Je n'ai pas ce block dans mon inventaire");
        return;
    }
    equip(bot, args);
    putDown(bot);
}

module.exports = { place };
