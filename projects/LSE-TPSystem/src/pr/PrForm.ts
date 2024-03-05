import { homeForm_Instance } from "../home/HomeForm.js";
import { ModalForms } from "../modules/ModalForm.js";
import { config } from "../utils/data.js";
import { pluginInformation, tellTitle } from "../utils/GlobalVars.js";
import { leveldb } from "../utils/leveldb.js";
import { formatVec3ToString, getRegCommand, sendCloseFormTip, sendMessage } from "../utils/util.js";
import { money_Instance } from "../include/money.js";
import { prCore_Instance } from "./PrCore.js";
import { SimpleForm_Back } from "../../../LSE-Modules/src/uform/SimpleForms.js";

class PrForm {
    constructor() {}

    index(player: Player) {
        const fm = new SimpleForm_Back(
            pluginInformation.introduce,
            () => {
                player.runcmd(getRegCommand());
            },
            "bottom",
        );

        fm.addButton(
            "创建请求",
            () => {
                this.createPR(player);
            },
            "textures/ui/backup_replace",
        );
        fm.addButton(
            "删除请求",
            () => {
                this.deletePr(player);
            },
            "textures/ui/redX1",
        );
        fm.close = () => {
            sendCloseFormTip(player);
        };
        fm.send(player);
    }

    private createPR(player: Player) {
        homeForm_Instance._chooseHome(
            player,
            (dt) => {
                const md = new ModalForms(
                    undefined,
                    `名称: ${dt.name}\n${formatVec3ToString(dt.data)}\n${money_Instance.getPlayerMoneyStr(
                        player,
                        config.Pr.SendRequestMoney,
                    )}\n\n并入成功后不会删除家园传送点且无法自行撤销`,
                );
                md.setButton_0_call("确认", () => {
                    prCore_Instance.createPr(player.realName, {
                        name: dt.name,
                        ...dt.data,
                    })
                        ? sendMessage(player, `创建请求 ${dt.name} 成功`)
                        : sendMessage(player, `创建请求 ${dt.name} 失败`);
                });
                md.setButton_1_call("返回", () => {
                    player.runcmd(`${getRegCommand()} pr`);
                });
                md.setDefault_call(() => {
                    sendCloseFormTip(player);
                });
                md.send(player);
            },
            (pl) => {
                this.index(pl);
            },
        );
    }

    private deletePr(player: Player) {
        const allPr = leveldb.getPr().filter((i) => i.playerRealName === player.realName);
        const fm = new SimpleForm_Back(
            tellTitle,
            (pl) => {
                this.index(pl);
            },
            "top",
        );

        allPr.forEach((p) => {
            fm.addButton(`${p.time}\n${p.data.name}`, () => {
                const md = new ModalForms(
                    undefined,
                    `名称: ${p.data.name}\n${formatVec3ToString(p.data)}\n创建时间: ${p.time}\n${money_Instance.getPlayerMoneyStr(
                        player,
                        config.Pr.DeleteRequestMoney,
                    )}`,
                );
                md.setButton_0_call("确认删除", () => {
                    prCore_Instance._deletePr(p.guid)
                        ? sendMessage(player, `删除请求 ${p.data.name} 成功`)
                        : sendMessage(player, `删除请求 ${p.data.name} 失败`);
                });
                md.setButton_1_call("取消", () => {
                    player.runcmd(`${getRegCommand()} pr`);
                });
                md.setDefault_call(() => {
                    sendCloseFormTip(player);
                });
                md.send(player);
            });
        });

        fm.close = () => {
            sendCloseFormTip(player);
        };
        fm.send(player);
    }
}

export const prForm_Instance = new PrForm();
