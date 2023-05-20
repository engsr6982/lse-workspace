
import { Money_Mod } from "../Money.js";
import { Gm_Tell, Config } from "../cache.js";

class WarpCore {
    static GoWarp(pl, pos) {
        if (Money_Mod.DeductEconomy(pl, Config.Warp.GoWarp)) {
            if (pl.teleport(pos)) {
                pl.tell(Gm_Tell + '传送成功！');
            } else {
                pl.tell(Gm_Tell + '传送失败!');
                Money_Mod.addMoney(pl, Config.Warp.GoWarp);
            }
        }
    }
}