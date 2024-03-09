import { SimpleFormWithBack } from "../../../LSE-Modules/src/form/SimpleForms.js";
import { prCore_Instance } from "../pr/PrCore.js";
import { tellTitle } from "../utils/GlobalVars.js";
import { leveldb } from "../utils/leveldb.js";
import { convertVec3ToPos, formatVec3ToString, getRegCommand, sendCloseFormTip, sendMessage } from "../utils/util.js";

class PrManager {
    constructor() {}

    index(player: Player) {
        this.selectPr(player);
    }

    private selectPr(player: Player) {
        const fm = new SimpleFormWithBack(
            tellTitle,
            (pl) => {
                pl.runcmd(`${getRegCommand()} mgr`);
            },
            "top",
        );

        const prs = leveldb.getPr();
        for (let i = 0; i < prs.length; i++) {
            fm.addButton(`[玩家] ${prs[i].playerRealName}\n${prs[i].data.name}  ${formatVec3ToString(prs[i].data)}`, () => {
                this.operationPage(player, i, prs[i].guid);
            });
        }

        fm.close = () => {
            sendCloseFormTip(player);
        };
        fm.send(player);
    }

    private operationPage(player: Player, index: number, guid: string) {
        const pr = leveldb.getPr()[index];
        const fm = new SimpleFormWithBack(
            tellTitle,
            (pl) => {
                this.index(pl);
            },
            "bottom",
        );

        fm.content = `[玩家]: ${pr.playerRealName}\n[时间]: ${pr.time}\n[GUID]: ${pr.guid}\n[坐标]: ${formatVec3ToString(
            pr.data,
        )}\n[GUID匹配]: ${guid === pr.guid}`;

        fm.addButton(
            "同意并加入公共传送点",
            () => {
                prCore_Instance._acceptPr(pr.guid) ? sendMessage(player, "操作成功!") : sendMessage(player, "操作失败!");
            },
            "textures/ui/realms_green_check",
        );
        fm.addButton(
            "拒绝并删除",
            () => {
                prCore_Instance._deletePr(pr.guid) ? sendMessage(player, "操作成功!") : sendMessage(player, "操作失败!");
            },
            "textures/ui/realms_red_x",
        );
        fm.addButton(
            "前往此Pr的坐标",
            () => {
                player.teleport(convertVec3ToPos(pr.data)) ? sendMessage(player, "操作成功!") : sendMessage(player, "操作失败!");
            },
            "textures/ui/send_icon",
        );

        fm.close = () => {
            sendCloseFormTip(player);
        };
        fm.send(player);
    }
}

export const prMgr = new PrManager();
