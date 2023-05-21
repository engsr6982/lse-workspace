import { Money_Mod } from "../Money.js";
import { Time_Mod } from "../Time.js";
import { Config, Death, DeathInvincible, Gm_Tell } from "../cache.js";

export class DeathCore {
    static GoDeath(pl) {
        if (Money_Mod.DeductEconomy(pl, Config.Death.GoDelath)) {
            if (pl.teleport(new IntPos(Death[pl.realName].x, Death[pl.realName].y, Death[pl.realName].z, Death[pl.realName].dimid))) {
                pl.tell(Gm_Tell + '传送完成！');
                // 加入无敌时间
                DeathInvincible.push({
                    "name": pl.realName,
                    "end": Time_Mod.getEndTimes(Config.Death.InvincibleTime, Config.Death.InvincibleTimeUnit)
                })
            } else {
                pl.tell(Gm_Tell + '传送失败！');
                Money_Mod.addMoney(Config.Death.GoDelath);
            }
        }
    }
}