//Utilise la position de coordonée du block pour se déplacer vers le block le plus proche
export async function goToBlock(bot, block) {
    const mcData = require("minecraft-data")(bot.version);
    const { Movements, goals } = require("mineflayer-pathfinder");

    const movements = new Movements(bot, mcData);
    const goal = new goals.GoalBlock(
        block.position.x,
        block.position.y,
        block.position.z
    );

    bot.pathfinder.setMovements(movements);
    bot.pathfinder.setGoal(goal);

    return new Promise((resolve, reject) => {
        bot.once("goal_reached", resolve);
        bot.once("path_update", (results) => {
            if (results.status === "noPath") {
                reject(`Je ne peux pas atteindre le bloc ${block.name}`);
            }
        });
    });
}
