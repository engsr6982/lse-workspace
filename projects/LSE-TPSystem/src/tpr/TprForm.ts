import { config } from "../utils/data.js";
import { pluginInformation } from "../utils/GlobalVars.js";
import { sendCloseFormTip, sendMessage } from "../utils/util.js";
import { money_Instance } from "../include/money.js";
import { prepareTpr } from "./PrePareTpr.js";

/**随机传送-表单 */
export function tprForm(player: Player) {
    // 检查功能状态
    if (!config.Tpr.Enable) return sendMessage(player, "管理员关闭了此功能！");
    // 发送表单确认一下
    player.sendModalForm(
        pluginInformation.introduce,
        `确认执行此操作？\n${money_Instance.getPlayerMoneyStr(player, config.Tpr.Money)}`,
        "确认",
        "返回",
        (pl, res) => {
            switch (res) {
                // 调用传送函数
                case true:
                    prepareTpr(pl);
                    break;
                // 返回上一页
                case false:
                    // Main(pl, MainUI);
                    break;
                default:
                    sendCloseFormTip(pl);
                    break;
            }
        },
    );
}
