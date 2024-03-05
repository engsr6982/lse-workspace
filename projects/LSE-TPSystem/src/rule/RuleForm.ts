import { tellTitle } from "../utils/GlobalVars.js";
import { sendCloseFormTip, sendMessage } from "../utils/util.js";
import { ruleCore_Instance } from "./RuleCore.js";

class RuleForm {
    constructor() {
        this.initEvent();
    }

    private initEvent() {
        mc.listen("onJoin", (player) => {
            // const r = leveldb.getRule();
            // if (hasOwnProperty_(r, player.realName)) return;
            // r[player.realName] = config.Rule;
            // leveldb.setRule(r);
            if (!ruleCore_Instance.hasPlayerRule(player.realName)) {
                ruleCore_Instance.initPlayerRule(player.realName);
                logger.warn(`初始化玩家 ${player.realName} 规则成功!`);
            }
        });
        logger.info("玩家进入游戏 事件已注册");
    }

    index(player: Player) {
        const fm = mc.newCustomForm();
        fm.setTitle(tellTitle);

        // const allRules = leveldb.getRule();
        // const rule = allRules[player.realName];
        const rule = ruleCore_Instance.getPlayerRule(player.realName);
        fm.addSwitch("TPA 弹窗", rule.tpaPopup);
        fm.addSwitch("死亡弹窗", rule.deathPopup);
        fm.addSwitch("允许对我发送TPA请求", rule.allowTpa);

        player.sendForm(fm, (pl, dt) => {
            if (!dt) return sendCloseFormTip(player);

            const convertBool = (stringBool: string) => {
                return Boolean(stringBool).valueOf();
            };
            // 构建新数据
            const newData: levelDB_and_Config_Rule_Structure_Item = {
                tpaPopup: convertBool(dt[0]),
                deathPopup: convertBool(dt[1]),
                allowTpa: convertBool(dt[2]),
            };
            // allRules[player.realName] = newData;

            // leveldb.setRule(allRules) ? sendMessage(player, "操作成功!") : sendMessage(player, "操作失败!");

            ruleCore_Instance.updateRule(player.realName, newData) ? sendMessage(player, "操作成功!") : sendMessage(player, "操作失败!");
        });
    }
}

export const ruleForm_Instance = new RuleForm();
