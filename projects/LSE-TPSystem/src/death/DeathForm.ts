import { ModalForms } from "../../../LSE-Modules/src/form/ModalForms.js";
import { config } from "../utils/data.js";
import { pluginInformation, tellTitle } from "../utils/GlobalVars.js";
import { leveldb } from "../utils/leveldb.js";
import { formatVec3ToString, hasOwnProperty_, sendCloseFormTip, sendMessage } from "../utils/util.js";
import { money_Instance } from "../include/money.js";
import { deathCore_Instance } from "./DeathCore.js";
import { ruleCore_Instance } from "../rule/RuleCore.js";
import { SimpleForms } from "../../../LSE-Modules/src/form/SimpleForms.js";

function initListen() {
    if (config.Death.Enable) {
        mc.listen("onRespawn", (player) => {
            if (player.isSimulatedPlayer() || !player || !player.pos) return; // 过滤模拟玩家
            // deathForm_Instance.sendGoDeath(player);
            const rule = ruleCore_Instance.getPlayerRule(player.realName);
            rule.deathPopup ? deathForm_Instance.sendGoDeath(player) : undefined;
        });
        logger.info("玩家重生事件已注册");
    }
}

class DeathForm {
    constructor() {
        initListen();
    }

    sendGoDeath(player: Player) {
        if (!config.Death.Enable) return sendMessage(player, "此功能已关闭！");

        const d = leveldb.getDeath();
        if (!hasOwnProperty_(d, player.realName)) return sendMessage(player, "你还没有死亡点信息！");
        if (d[player.realName].length === 0) return sendMessage(player, "你还没有死亡点信息！");

        const death = d[player.realName][0];
        const md = new ModalForms(pluginInformation.name);

        md.contentText = `时间: ${death.time}\n坐标: ${formatVec3ToString(death)}\n\n${money_Instance.getPlayerMoneyStr(
            player,
            config.Death.GoDeathMoney,
        )}`;

        md.setConfirm("确认传送", () => {
            deathCore_Instance.goDeath(player);
        });
        md.setCancel("取消", () => {
            sendCloseFormTip(player);
        });
        md.setDefault(() => {
            sendCloseFormTip(player);
        });

        md.send(player);
    }

    sendQueryDeath(player: Player) {
        if (!config.Death.Enable) return sendMessage(player, "此功能已关闭！");

        const d = leveldb.getDeath();

        if (!hasOwnProperty_(d, player.realName)) return sendMessage(player, "你还没有死亡点信息！");

        const fm = new SimpleForms(tellTitle);

        d[player.realName].forEach((info) => {
            fm.addButton(`${info.time}\n${formatVec3ToString(info)}`, () => {
                this.showQueryDeathValue(player, info);
            });
        });

        fm.close = () => {
            sendCloseFormTip(player);
        };

        fm.send(player);
    }

    private showQueryDeathValue(
        player: Player,
        info: Vec3 & {
            time: string;
        },
    ) {
        const fm = new ModalForms(pluginInformation.name);
        fm.contentText = `时间: ${info.time}\n坐标: ${formatVec3ToString(info)}`;

        fm.setConfirm("返回", () => {
            this.sendQueryDeath(player);
        });
        fm.setCancel("关闭", () => {
            sendCloseFormTip(player);
        });
        fm.setDefault(() => {
            sendCloseFormTip(player);
        });

        fm.send(player);
    }
}

export const deathForm_Instance = new DeathForm();
