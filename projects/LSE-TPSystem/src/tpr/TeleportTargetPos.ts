import { sendMessage } from "../utils/util.js";
import { tprFail } from "./TprFail.js";

// 传送函数
export function tprTeleportTargetPos(player: Player, pos: IntPos) {
    try {
        player.teleport(new FloatPos(pos.x, pos.y + 2, pos.z, pos.dimid));
        sendMessage(player, "传送完成！");
    } catch (e) {
        tprFail(player, e, undefined, undefined);
    }
}
