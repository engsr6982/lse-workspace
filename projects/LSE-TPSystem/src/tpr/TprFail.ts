import { money_Instance } from "../include/money.js";
import { config } from "../utils/data.js";
import { formatAndPrintingError, sendMessage } from "../utils/util.js";

export function tprFail(player: Player, e: Error, BackUpPos: FloatPos | IntPos, Interval_ID?: number) {
    // 清除周期执行任务
    if (Interval_ID) {
        clearInterval(Interval_ID);
    }
    // 由于玩家退出，但玩家对象依然存在，故判断坐标是否不存在
    if (player.pos != null) {
        formatAndPrintingError(e);
        player.teleport(BackUpPos);
        sendMessage(player, "§c插件遇到未知错误, 传送失败！");
        money_Instance.addPlayerMoney(player, config.Tpr.Money);
    } else {
        logger.warn("Players quit the game and TPR failed.");
    }
}
