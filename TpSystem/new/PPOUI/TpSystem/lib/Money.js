import { Config, Gm_Tell } from "../lib/cache.js";

export class Money_Mod {
    /**
     * 添加经济
     * @param {Object} pl 玩家对象
     * @param {Number} amoney 要添加的经济
     * @returns 
     */
    static addMoney(pl, amoney) {
        if (Config.Money.Enable) { // 判断经济类型
            if (Config.Money.LLMoney) {
                // LL
                return money.add(pl.xuid, amoney); 
            } else {
                //score
                return pl.addScore(Config.Money.MoneyName,amoney);
            }
        }
    }
    /**
     * 获取经济字符串
     * @param {Object} pl 玩家对象
     * @param {Number} dmoney 消耗经济
     * @returns Boolean
     */
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
     * @returns Number
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
     * @returns Boolean
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
