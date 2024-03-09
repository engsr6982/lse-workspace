import { SimpleFormWithBack } from "../../../LSE-Modules/src/form/SimpleForms.js";
import { dimidArray, tellTitle } from "../utils/GlobalVars.js";
import { leveldb } from "../utils/leveldb.js";
import {
    convertVec3ToPos,
    formatVec3ToString,
    getRegCommand,
    parseAxis,
    sendCloseFormTip,
    sendMessage,
    stringifyAxis,
} from "../utils/util.js";
import { warpMap } from "../warp/Mapping.js";
import { warpCore_Instance } from "../warp/WarpCore.js";

class WarpManager {
    constructor() {}

    index(player: Player) {
        this.selectWarp(player);
    }

    private selectWarp(player: Player) {
        const fm = new SimpleFormWithBack(
            tellTitle,
            (pl) => {
                pl.runcmd(`${getRegCommand()} mgr`);
            },
            "top",
        );
        fm.addButton(
            "创建传送点",
            () => {
                this.creatWarp(player);
            },
            "textures/ui/color_plus",
        );

        const warps = leveldb.getWarp();
        let index = 0;
        while (index < warps.length) {
            const warp = warps[index++];
            fm.addButton(`${warp.name}\n${formatVec3ToString(warp)}`, () => {
                this.operationPage(player, warp.name);
            });
        }

        fm.close = () => {
            sendCloseFormTip(player);
        };
        fm.send(player);
    }

    private operationPage(player: Player, targetWarp: string) {
        const warp = leveldb.getWarp()[warpMap.map[targetWarp]];

        const fm = new SimpleFormWithBack(
            tellTitle,
            (pl) => {
                this.index(pl);
            },
            "bottom",
        );
        fm.content = `正在编辑[${targetWarp}]\n${formatVec3ToString(warp)}`;

        fm.addButton(
            "前往当前公共传送点",
            () => {
                player.teleport(convertVec3ToPos(warp));
                sendMessage(player, `传送[${targetWarp}]成功!`);
            },
            "textures/ui/send_icon",
        );
        fm.addButton(
            "编辑当前公共传送点",
            () => {
                this.editWarp(player, targetWarp);
            },
            "textures/ui/book_edit_default",
        );
        fm.addButton(
            "删除当前公共传送点",
            () => {
                warpCore_Instance._deleteWarp(targetWarp)
                    ? sendMessage(player, `删除[${targetWarp}]成功！`)
                    : sendMessage(player, `删除[${targetWarp}]失败！`);
            },
            "textures/ui/trash_default",
        );
        fm.close = () => {
            sendCloseFormTip(player);
        };
        fm.send(player);
    }

    private creatWarp(player: Player) {
        const fm = mc.newCustomForm();
        fm.setTitle(tellTitle);
        fm.addInput(`名称`, "string"); // 0
        fm.addInput(`坐标 [使用英文逗号分隔坐标轴]`, "string"); //1
        fm.addDropdown("维度", dimidArray); //2
        player.sendForm(fm, (pl, dt) => {
            if (!dt) return sendCloseFormTip(pl);
            const axis = parseAxis(dt[1] as string); // 解析坐标
            // set
            warpCore_Instance._addWarp(dt[0], {
                ...axis,
                dimid: <0 | 1 | 2>parseInt(dt[2]),
            })
                ? sendMessage(player, "成功!")
                : sendMessage(player, "失败!");
        });
    }

    private editWarp(player: Player, targetWarp: string) {
        const warpInformation = leveldb.getWarp()[warpMap.map[targetWarp]];

        const fm = mc.newCustomForm();
        fm.setTitle(tellTitle);
        fm.addInput(`家名称`, "string", targetWarp || ""); // 0
        fm.addInput(`坐标 [使用英文逗号分隔坐标轴]`, "string", stringifyAxis(warpInformation)); //1
        fm.addDropdown("维度", dimidArray, warpInformation.dimid); //2
        player.sendForm(fm, (pl, dt) => {
            if (!dt) return sendCloseFormTip(pl);
            const axis = parseAxis(dt[1] as string); // 解析坐标
            // set
            warpCore_Instance._editWarp(targetWarp, {
                ...axis,
                dimid: <0 | 1 | 2>parseInt(dt[2]),
                name: dt[0],
            })
                ? sendMessage(player, "成功!")
                : sendMessage(player, "失败!");
        });
    }
}

export const warpMgr = new WarpManager();
