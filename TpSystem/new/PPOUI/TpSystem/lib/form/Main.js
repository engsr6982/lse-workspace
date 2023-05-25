import { Other } from "../Other.js";
import { _filePath } from "../cache.js";
import { DeathForm } from "./Death.js";
import { HomeForm } from "./Home.js";
import { PlayerSetingForm } from "./PlayerSeting.js";
import { TPRForm } from "./TPR.js";
import { WarpForm } from "./Warp.js";
import {TPAEntrance} from "./TPA/TPAEntrance.js"


export const MAPPING_TABLE = {
    HomeUi: HomeForm.Panel,
    WarpUi: WarpForm,
    PlayerUi: TPAEntrance,// todo tpa的表单函数
    DeathUi: DeathForm,
    RandomUi: TPRForm,
    SetingUi: PlayerSetingForm
}

/**
 * GUI主页
 * @param {Object} pl 玩家对象
 * @param {Array} Array 菜单数组
 */
export function Main(pl, Array = []) {
    const fm = Other.SimpleForm();
    fm.setContent(`· 选择一个操作`);
    Array.forEach((i) => {
        fm.addButton(i.name, i.image);
    });
    if (Array.length == 0) return pl.tell(`数组为空！ 无法发送表单！`);
    pl.sendForm(fm, (pl, id) => {
        if (id == null) return Other.CloseTell(pl);
        const sw = Array[id];
        switch (sw.type) {
            case "inside": return MAPPING_TABLE[sw.open](pl);
            case "command": return pl.runcmd(sw.open);
            case "form":
                if (!File.exists(_filePath + `GUI\\${sw.open}.json`)) {
                    File.writeTo(_filePath + `GUI\\${sw.open}.json`, '[]');
                    return pl.tell(`§c§l文件<${sw.open}.json>不存在！`, 5);
                };
                try {
                    let Menu_Arry = JSON.parse(File.readFrom(_filePath + `GUI\\${sw.open}.json`));
                    logger.debug(Menu_Arry);
                    Main(pl, Menu_Arry);
                } catch (e) {
                    if (e instanceof SyntaxError) {
                        pl.tell(`§c§l文件<${sw.open}.json>语法错误！`, 5);
                        throw new SyntaxError(e);
                    }
                };
                break;
        }
    })
}
