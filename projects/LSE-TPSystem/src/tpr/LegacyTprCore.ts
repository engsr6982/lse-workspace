import { sendMessage } from "../utils/util.js";
import { tprTeleportTargetPos } from "./TeleportTargetPos.js";
import { tprFail } from "./TprFail.js";

export function legacyTprCore(player: Player, forPosInfo: Arg2, targetPos: IntPos, BackUpPos: IntPos) {
    try {
        let block_Obj = mc.getBlock(targetPos);

        sendMessage(player, "寻找安全坐标...");
        player.addEffect(11, 80, 255, true);

        let to_Pos: IntPos;
        let Pos_Y = forPosInfo.startingValue;
        // 遍历方块对象
        for (Pos_Y; Pos_Y > forPosInfo.endValue; Pos_Y--) {
            // 打印Debug信息
            // logger.debug(`Y轴: ${Pos_Y}  方块对象: ${block_Obj != null ? block_Obj.pos : null}   方块ID: ${block_Obj != null ? block_Obj.type : null}   坐标对象: ${to_Pos}  玩家坐标: ${player.blockPos}`);                    // 方块对象为null 或 空气方块
            if (block_Obj == null || block_Obj.type === "minecraft:air") {
                to_Pos = new IntPos(targetPos.x, Pos_Y, targetPos.z, targetPos.dimid);
                block_Obj = mc.getBlock(to_Pos);
            } else if (Pos_Y <= forPosInfo.stopValue || ["minecraft:lava", "minecraft:flowing_lava"].indexOf(block_Obj.type) !== -1) {
                throw Error(`Search for safe coordinates failed`); // 到达结束位置或落脚点是岩浆方块
            } else if (player.pos.dimid !== 1) {
                tprTeleportTargetPos(player, new IntPos(targetPos.x, Pos_Y, targetPos.z, targetPos.dimid));
                return;
            } else if (
                // 地狱特判
                player.pos.dimid == 1 &&
                mc.getBlock(new IntPos(to_Pos.x, Pos_Y + 2, to_Pos.z, to_Pos.dimid)).type === "minecraft:air" &&
                mc.getBlock(new IntPos(to_Pos.x, Pos_Y + 3, to_Pos.z, to_Pos.dimid)).type === "minecraft:air"
            ) {
                tprTeleportTargetPos(player, new IntPos(targetPos.x, Pos_Y, targetPos.z, targetPos.dimid));
                return;
            } else {
                to_Pos = new IntPos(targetPos.x, Pos_Y, targetPos.z, targetPos.dimid);
                block_Obj = mc.getBlock(to_Pos);
            }
        }
        throw Error(`No safety coordinates found in dimension [${player.pos.dim}]`);
    } catch (e) {
        tprFail(player, e, BackUpPos);
    }
}
