import { dataFile } from "../utils/data.js";
import { tellTitle } from "../utils/GlobalVars.js";
import { sendCloseFormTip, sendMessage } from "../utils/util.js";
import { permFormInstance } from "../include/permission.js";
import { homeMgr } from "./HomeManager.js";
import { warpMgr } from "./WarpManager.js";
import { prMgr } from "./PrManager.js";
import { SimpleForms } from "../../../LSE-Modules/src/form/SimpleForms.js";

export function ManagerEntry(player: Player) {
    const fm = new SimpleForms(tellTitle);

    fm.content = "选择操作类型";

    fm.addButton(
        "家园传送点管理",
        () => {
            homeMgr.index(player);
        },
        "textures/ui/village_hero_effect",
    );
    fm.addButton(
        "公共传送点管理",
        () => {
            warpMgr.index(player);
        },
        "textures/ui/icon_best3",
    );
    fm.addButton(
        "合并请求管理",
        () => {
            prMgr.index(player);
        },
        "textures/ui/book_shiftleft_default",
    );
    fm.addButton(
        "权限组管理",
        () => {
            permFormInstance.index(player);
        },
        "textures/ui/icon_setting",
    );
    fm.addButton(
        "重载配置文件",
        () => {
            dataFile.initData();
            sendMessage(player, "成功!");
        },
        "textures/ui/refresh_light",
    );
    fm.close = () => {
        sendCloseFormTip(player);
    };
    fm.send(player);
}
