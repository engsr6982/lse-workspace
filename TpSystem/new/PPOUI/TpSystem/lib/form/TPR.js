import { Money_Mod } from "../Money.js";
import { Other } from "../Other.js";
import { Config, Gm_Tell, MainUI, PLUGIN_INFO } from "../cache.js";
import { RandomTeleportCore } from "../core/TPR.js";
import { Main } from "./Main.js";


export function TPRForm(pl) {
    if (!Config.TPR.Enable) return pl.tell(Gm_Tell + '管理员关闭了此功能！');
    pl.sendModalForm(PLUGIN_INFO.Introduce, `确认执行此操作？\n${Money_Mod.getEconomyStr(pl, Config.TPR.Money)}`, '确认', '返回', (pl, res) => {
        switch (res) {
            case true: RandomTeleportCore(pl); break;
            case false: Main(pl, MainUI); break;
            default: Other.CloseTell(pl); break;
        }
    })
}