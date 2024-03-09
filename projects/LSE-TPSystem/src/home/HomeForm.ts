import { config } from "../utils/data.js";
import { tellTitle } from "../utils/GlobalVars.js";
import { leveldb } from "../utils/leveldb.js";
import { formatVec3ToString, getRegCommand, hasOwnProperty_, sendCloseFormTip, sendMessage } from "../utils/util.js";
import { money_Instance } from "../include/money.js";
import { homeCore_Instance } from "./HomeCore.js";
import { SimpleFormWithBack } from "../../../LSE-Modules/src/form/SimpleForms.js";

class HomeForm {
    constructor() {}

    index(player: Player) {
        const fm = new SimpleFormWithBack(
            tellTitle,
            (pl) => {
                pl.runcmd(getRegCommand());
            },
            "bottom",
        );

        fm.content = `选择一个操作`;

        fm.addButton(
            "新建家",
            () => {
                this.newHome(player);
            },
            "textures/ui/color_plus",
        );
        fm.addButton(
            "前往家",
            () => {
                this.goHome(player);
            },
            "textures/ui/send_icon",
        );
        fm.addButton(
            "编辑家",
            () => {
                this.editHome(player);
            },
            "textures/ui/book_edit_default",
        );
        fm.addButton(
            "删除家",
            () => {
                this.deleteHome(player);
            },
            "textures/ui/trash_default",
        );

        fm.close = () => {
            sendCloseFormTip(player);
        };
        fm.send(player);
    }

    private newHome(player: Player) {
        const fm = mc.newCustomForm();
        fm.setTitle(tellTitle);
        fm.addInput("请输入家园名称", "String");
        fm.addLabel(money_Instance.getPlayerMoneyStr(player, config.Home.CreatHomeMoney));
        player.sendForm(fm, (pl, dt: Array<string | null>) => {
            if (!dt) return sendCloseFormTip(pl);
            if (dt[0] == "") return sendMessage(pl, "输入框为空");
            pl.runcmd(`${getRegCommand()} home add "${dt[0]}"`);
        });
    }

    _chooseHome(player: Player, call: (home: { name: string; data: Vec3 & dataDate }) => void, back: (player: Player) => void) {
        const fm = new SimpleFormWithBack(tellTitle, back, "top");
        const allHome = leveldb.getHome();

        if (!hasOwnProperty_(allHome, player.realName)) return sendMessage(player, "你还没有家园传送点！");
        const home = allHome[player.realName];

        let index = 0;
        while (index < home.length) {
            const h = home[index++];
            fm.addButton(`${h.name}\n${formatVec3ToString(h)}`, () => {
                call({
                    name: h.name,
                    data: h,
                });
            });
        }
        fm.close = () => {
            sendCloseFormTip(player);
        };
        fm.send(player);
    }

    private goHome(player: Player) {
        this._chooseHome(
            player,
            (dt) => {
                player.runcmd(`${getRegCommand()} home go "${dt.name}"`);
            },
            (pl) => {
                this.index(pl);
            },
        );
    }

    private editHome(player: Player) {
        this._chooseHome(
            player,
            (dt) => {
                const fm = new SimpleFormWithBack(
                    tellTitle,
                    (pl) => {
                        this.editHome(pl);
                    },
                    "bottom",
                );

                fm.addButton(
                    "更新坐标到当前位置",
                    () => {
                        homeCore_Instance.updatePos(player, dt.name)
                            ? sendMessage(player, "更新坐标成功!")
                            : sendMessage(player, "更新坐标失败!");
                    },
                    "textures/ui/refresh",
                );
                fm.addButton(
                    "编辑家名称",
                    () => {
                        this.inputNewName(player, dt, dt.name);
                    },
                    "textures/ui/book_edit_default",
                );

                fm.close = () => {
                    sendCloseFormTip(player);
                };
                fm.send(player);
            },
            (pl) => {
                this.index(pl);
            },
        );
    }

    private inputNewName(player: Player, dt: { name: string; data: Vec3 & dataDate }, name?: string) {
        const fm = mc.newCustomForm();
        fm.setTitle(tellTitle);
        fm.addInput("输入新名称", "String", name || dt.name);
        fm.addLabel(money_Instance.getPlayerMoneyStr(player, config.Home.EditNameMoney));
        player.sendForm(fm, (pl, n) => {
            if (!n) return sendCloseFormTip(player);
            if (n[0] == dt.name) return;
            homeCore_Instance.updateName(player, dt.name, n[0]) ? sendMessage(player, "操作成功！") : this.inputNewName(player, dt, n[0]);
        });
    }

    private deleteHome(player: Player) {
        this._chooseHome(
            player,
            (dt) => {
                player.runcmd(`${getRegCommand()} home del "${dt.name}"`);
            },
            (pl) => {
                this.index(pl);
            },
        );
    }
}

export const homeForm_Instance = new HomeForm();
