import { Config, Gm_Tell } from "../lib/cache.js";

export class Money_Mod {
    static getEconomyStr(pl, dmoney) {
        let mons;
        if (Config.Money.LLMoney) {
            mons = money.get(pl.xuid);
        } else {
            mons = pl.getScore(Config.Money.MoneyName);
        }
        if (!Config.Money.Enable) dmoney = 0;//关闭经济，无需扣费
        return `此次操作需消耗[${dmoney}]${Config.Money.MoneyName}, 当前${Config.Money.MoneyName}: ${mons}`;
    }
    /**
     * 获取玩家经济
     * @param {Object} pl 玩家对象
     * @returns 
     */
    static getEconomy(pl) {
        if (Config.Money.LLMoney) {
            return money.get(pl.xuid);
        } else {
            return pl.getScore(Config.Money.MoneyName);
        }
    }
    /**
     * 扣除经济
     * @param {Object} pl 
     * @param {Number} Money 
     * @returns 
     */
    static DeductEconomy(pl, delMoney) {
        if (Config.Money.Enable) {
            // 启用经济
            if (Config.Money.LLMoney) {
                // LL
                if (money.get(pl.xuid) >= delMoney) {
                    // 经济充足
                    return money.reduce(pl.xuid, Number(delMoney));
                } else {
                    pl.tell(Gm_Tell + `${Config.Money.MoneyName}不足！ 无法继续操作!`);
                    return false;
                }
            } else {
                // Socre
                if (pl.getScore(Config.Money.MoneyName) >= delMoney) {
                    return pl.reduceScore(Config.Money.MoneyName, Number(delMoney));
                } else {
                    pl.tell(Gm_Tell + `${Config.Money.MoneyName}不足！ 无法继续操作!`);
                    return false
                }
            }
        } else {
            //关闭经济
            return true;
        }
    }
}
