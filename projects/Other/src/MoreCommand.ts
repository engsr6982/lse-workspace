// import { time } from "../../LSE-Modules/src/Time.js";

// const backupMap = new Map();

// setInterval(() => {
//     backupMap.forEach();
// }, 60 * 1000); // 1 min

// // backup
// const backup = mc.newCommand("backups", "立即备份服务端地图", PermType.Any);
// backup.overload([]);
// backup.setCallback((_, ori, out, res) => {
//     if (!ori.player) return;
//     const { realName } = ori.player;
//     if (backupMap.has(realName)) return;
// });
// backup.setup();

// killme
const killme = mc.newCommand("killme", "立即杀死自己", PermType.Any);
killme.overload([]);
killme.setCallback((_, ori, out) => {
    ori.player ? ori.player.kill() : out.error(`获取玩家对象失败！`);
});
killme.setup();
