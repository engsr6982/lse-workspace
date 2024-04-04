import { sendMessage } from "../utils/util.js";
import { tprFail } from "./ProcessingResults.js";

type funcType = (player: Player, forPosInfo: Arg2, targetPos: IntPos, BackUpPos: IntPos) => any;

export function tprAwaitChunkLoad(player: Player, targetPos: IntPos | FloatPos, forPosInfo: Arg2, func: funcType) {
    let Interval_ID: number = null;
    let BackUpPos: FloatPos = null;

    try {
        BackUpPos = player.blockPos; // 备份玩家当前坐标

        player.teleport(targetPos);
        sendMessage(player, "等待区块加载...");

        Interval_ID = setInterval(() => {
            try {
                if (player.blockPos.y !== targetPos.y) {
                    func(player, forPosInfo, targetPos, BackUpPos);
                    clearInterval(Interval_ID);
                }
            } catch (e) {
                tprFail(player, e, BackUpPos, Interval_ID);
            }
        }, 400);
    } catch (e) {
        tprFail(player, e, BackUpPos, Interval_ID);
    }
}
