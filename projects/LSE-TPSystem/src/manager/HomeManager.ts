import { SimpleFormWithBack } from "../../../LSE-Modules/src/form/SimpleForms.js";
import { homeCore_Instance } from "../home/HomeCore.js";
import { homeMap } from "../home/Mapping.js";
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

class HomeManager {
    constructor() {}

    index(player: Player) {
        this.selectPlayer(player);
    }

    // Step 1
    private selectPlayer(player: Player) {
        const fm = new SimpleFormWithBack(
            tellTitle,
            (pl) => {
                pl.runcmd(`${getRegCommand()} mgr`);
            },
            "top",
        );

        const allPlayerHome = leveldb.getHome();
        for (const key in allPlayerHome) {
            fm.addButton(`${key}\n家园数量: ${Object.keys(allPlayerHome[key]).length}`, () => {
                this.chooseHome(player, key);
            });
        }

        fm.close = () => {
            sendCloseFormTip(player);
        };
        fm.send(player);
    }

    // step 2
    private chooseHome(player: Player, targetPlayer: string) {
        const fm = new SimpleFormWithBack(
            tellTitle,
            (pl) => {
                this.index(pl);
            },
            "top",
        );

        fm.content = `当前正在编辑玩家[${targetPlayer}]`;

        fm.addButton(
            "新建家",
            () => {
                this.createHome(player, targetPlayer);
            },
            "textures/ui/color_plus",
        );

        const allHome = leveldb.getHome()[targetPlayer];
        let index = 0;
        while (index < allHome.length) {
            const h = allHome[index++];
            fm.addButton(`${h.name}\n${formatVec3ToString(h)}`, () => {
                this.operationPage(player, targetPlayer, h.name);
            });
        }

        fm.close = () => {
            sendCloseFormTip(player);
        };
        fm.send(player);
    }

    // step 3
    private operationPage(player: Player, targetPlayer: string, targetHome: string) {
        const home = leveldb.getHome()[targetPlayer][homeMap.map[targetPlayer][targetHome]];

        const fm = new SimpleFormWithBack(
            tellTitle,
            (pl) => {
                this.chooseHome(pl, targetPlayer);
            },
            "bottom",
        );

        fm.content = `正在编辑玩家[${targetPlayer}]的家[${targetHome}]\n${formatVec3ToString(home)}`;

        fm.addButton(
            "前往家",
            () => {
                player.teleport(convertVec3ToPos(home));
                sendMessage(player, `传送家[${targetHome}]成功!`);
            },
            "textures/ui/send_icon",
        );
        fm.addButton(
            "编辑家",
            () => {
                this.editor(player, targetPlayer, targetHome);
            },
            "textures/ui/book_edit_default",
        );
        fm.addButton(
            "删除家",
            () => {
                homeCore_Instance._deleteHome(targetPlayer, targetHome)
                    ? sendMessage(player, `删除玩家[${targetPlayer}]的家[${targetHome}]成功！`)
                    : sendMessage(player, `删除玩家[${targetPlayer}]的家[${targetHome}]失败！`);
            },
            "textures/ui/trash_default",
        );
        fm.close = () => {
            sendCloseFormTip(player);
        };
        fm.send(player);
    }

    // step 4
    private createHome(player: Player, targetPlayer: string) {
        const fm = mc.newCustomForm();
        fm.setTitle(tellTitle);
        fm.addInput(`家名称`, "string"); // 0
        fm.addInput(`坐标 [使用英文逗号分隔坐标轴]`, "string"); //1
        fm.addDropdown("维度", dimidArray); //2
        player.sendForm(fm, (pl, dt) => {
            if (!dt) return sendCloseFormTip(pl);
            const axis = parseAxis(dt[0] as string); // 解析坐标
            // set
            homeCore_Instance._addHome(targetPlayer, dt[0], {
                ...axis,
                dimid: <0 | 1 | 2>parseInt(dt[2]),
            })
                ? sendMessage(player, "成功!")
                : sendMessage(player, "失败!");
        });
    }

    // step 5
    private editor(player: Player, targetPlayer: string, targetHome: string) {
        const homeInformation = leveldb.getHome()[targetPlayer][homeMap.map[targetPlayer][targetHome]];

        const fm = mc.newCustomForm();
        fm.setTitle(tellTitle);
        fm.addInput(`家名称`, "string", targetHome || ""); // 0
        fm.addInput(`坐标 [使用英文逗号分隔坐标轴]`, "string", stringifyAxis(homeInformation)); //1
        fm.addDropdown("维度", dimidArray, homeInformation.dimid); //2
        player.sendForm(fm, (pl, dt) => {
            if (!dt) return sendCloseFormTip(pl);
            const axis = parseAxis(dt[1] as string); // 解析坐标
            // set
            homeCore_Instance._editHome(targetPlayer, targetHome, {
                ...axis,
                dimid: <0 | 1 | 2>parseInt(dt[2]),
                name: dt[0],
            })
                ? sendMessage(player, "成功!")
                : sendMessage(player, "失败!");
        });
    }
}

export const homeMgr = new HomeManager();
