import pkg from "mineflayer-pathfinder";
import MinecraftData from "minecraft-data";
const { Movements, goals } = pkg;

export function getOverHere(bot) {
    const xylosil = bot.players["Xylosil"];

    if (!xylosil.entity) {
        bot.chat("Je ne te trouve pas!");
    } else {
        const movements = new Movements(bot, MinecraftData(bot.version));

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
