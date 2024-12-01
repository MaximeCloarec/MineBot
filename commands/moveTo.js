const { Movements, goals } = require("mineflayer-pathfinder");

function getOverHere(bot) {
    const xylosil = bot.players["Xylosil"];
    console.log(xylosil);

    if (!xylosil.entity) {
        bot.chat("Je ne te trouve pas!");
    } else {
        const mcData = require("minecraft-data")(bot.version);
        const movements = new Movements(bot, mcData);
        console.log(xylosil.entity.position.x);

        const goal = new goals.GoalNear(
            xylosil.entity.position.x,
            xylosil.entity.position.y,
            xylosil.entity.position.z,
            3
        );
        bot.pathfinder.setMovements(movements);
        bot.pathfinder.setGoal(goal);
        bot.chat("J'arrive !");
    }
}

module.exports = { getOverHere };
