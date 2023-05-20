import { Money_Mod } from "../Money.js";
import { Other } from "../Other.js";
import { Config, Death, Gm_Tell, MainUI, PLUGIN_INFO } from "../cache.js";
import { DeathCore } from "../core/Death.js";
import { Main } from "./Mian.js";


export function DeathForm(pl) {
    if (Death.hasOwnProperty(pl.realName)) {
        pl.sendModalForm(PLUGIN_INFO.Introduce, `时间： ${Death[pl.realName].time}\n维度： ${Other.DimidToDimension(Death[pl.realName].dimid)} \nX: ${Death[pl.realName].x}\nY: ${Death[pl.realName].y}\nZ: ${Death[pl.realName].z}\n${Money_Mod.getEconomyStr(pl, Config.Death.GoDelath)}`, '确认前往', '返回主页', (pl, res) => {
            switch (res) {
                case true: DeathCore.GoDeath(pl); break;
                case false: Main(pl, MainUI); break;
                default: Other.CloseTell(pl); break;
            }
        })
    } else {
        pl.tell(Gm_Tell + '你还没有死亡信息！');
    }
}