import { SimpleForm_Back } from "../../../LSE-Modules/src/uform/SimpleForms.js";
import { permCoreInstance } from "../include/permission.js";
import { tellTitle } from "../utils/GlobalVars.js";
import { leveldb } from "../utils/leveldb.js";
import { formatVec3ToString, getRegCommand, sendCloseFormTip, sendMessage } from "../utils/util.js";

class WarpForm {
    constructor() {}

    index(player: Player) {
        const fm = new SimpleForm_Back(
            tellTitle,
            (pl) => {
                pl.runcmd(`${getRegCommand()}`);
            },
            "bottom",
        );
        fm.addButton(
            "新建传送点",
            () => {
                permCoreInstance.verifyUserPermission(player.xuid, "addWarp") ? this.newWarp(player) : sendMessage(player, "无权限!");
            },
            "textures/ui/color_plus",
        );
        fm.addButton(
            "前往传送点",
            () => {
                this.goWarp(player);
            },
            "textures/ui/send_icon",
        );
        fm.addButton(
            "删除传送点",
            () => {
                permCoreInstance.verifyUserPermission(player.xuid, "delWarp") ? this.deleteWarp(player) : sendMessage(player, "无权限!");
            },
            "textures/ui/trash_default",
        );

        fm.close = () => {
            sendCloseFormTip(player);
        };
        fm.send(player);
    }

    private selectWarp(player: Player, call: (warp: { name: string; data: Vec3 & dataDate }) => void) {
        const warps = leveldb.getWarp();
        const fm = new SimpleForm_Back(
            tellTitle,
            (pl) => {
                this.index(pl);
            },
            "top",
        );

        let index = 0;
        while (index < warps.length) {
            const warp = warps[index++];
            fm.addButton(`${warp.name}\n${formatVec3ToString(warp)}`, () => {
                call({
                    name: warp.name,
                    data: warp,
                });
            });
        }

        fm.send(player);
    }

    private newWarp(player: Player) {
        const fm = mc.newCustomForm();
        fm.setTitle(tellTitle);

        fm.addInput("输入公共点名称", "string");

        player.sendForm(fm, (pl, dt) => {
            if (!dt) return sendCloseFormTip(player);
            if (dt[0] == "") return this.newWarp(pl);
            player.runcmd(`${getRegCommand()} warp add "${dt[0]}"`);
        });
    }

    private deleteWarp(player: Player) {
        this.selectWarp(player, (dt) => {
            player.runcmd(`${getRegCommand()} warp del "${dt.name}"`);
        });
    }

    private goWarp(player: Player) {
        this.selectWarp(player, (dt) => {
            player.runcmd(`${getRegCommand()} warp go "${dt.name}"`);
        });
    }
}
export const warpForm_Instance = new WarpForm();
