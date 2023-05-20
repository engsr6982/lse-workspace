import { Money_Mod } from "../Money.js";
import { Config, Death, Gm_Tell } from "../cache.js";

export class DeathCore {
    static GoDeath(pl) {
        if (Money_Mod.DeductEconomy(pl, Config.Death.GoDelath)) {
            if (pl.teleport(new IntPos(Death[pl.realName].x, Death[pl.realName].y, Death[pl.realName].z, Death[pl.realName].dimid))) {
                pl.tell(Gm_Tell + '传送完成！');
            } else {
                pl.tell(Gm_Tell + '传送失败！');
                Money_Mod.addMoney(Config.Death.GoDelath);
            }
        }
    }
}