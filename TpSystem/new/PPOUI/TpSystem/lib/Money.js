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
            switch (Config.Money.MoneyType) {
                case "llmoney":
                    return money.add(pl.xuid, amoney);
                case "score":
                    return pl.addScore(Config.Money.ScoreType, amoney);
                default:
                    logger.warn('未知经济类型' + Config.Money.MoneyType);
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
        switch (Config.Money.MoneyType) {
            case "llmoney":
                mons = money.get(pl.xuid);
                break;
            case "score":
                mons = pl.getScore(Config.Money.ScoreType);
                break;
            default:
                mons = `§c未知经济类型${Config.Money.MoneyType}§r`;
                break;
        }
        if (!Config.Money.Enable) dmoney = 0;//关闭经济，无需扣费
        if (!dmoney === null || dmoney === undefined) dmoney = `§c参数错误！§r`;
        return `§l此操作需消耗§9[§e${dmoney}§9]§r§l${Config.Money.MoneyName}, 当前${Config.Money.MoneyName}: §a${mons}`;
    }
    /**
     * 获取玩家经济
     * @param {Object} pl 玩家对象
     * @returns Number/String
     */
    static getEconomy(pl) {
        switch (Config.Money.MoneyType) {
            case "llmoney":
                return money.get(pl.xuid);
            case "score":
                return pl.getScore(Config.Money.ScoreType);
            default:
                return `§c未知经济类型${Config.Money.MoneyType}§r`
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
            // 启用经济  判断经济类型
            switch (Config.Money.MoneyType) {
                case "llmoney":
                    if (money.get(pl.xuid) >= delMoney) {
                        // 经济充足
                        return money.reduce(pl.xuid, Number(delMoney));
                    } else {
                        pl.tell(Gm_Tell + `${Config.Money.MoneyName}不足！ 无法继续操作!`);
                        return false;
                    }
                    break;
                case "score":
                    if (pl.getScore(Config.Money.ScoreType) >= delMoney) {
                        return pl.reduceScore(Config.Money.ScoreType, Number(delMoney));
                    } else {
                        pl.tell(Gm_Tell + `${Config.Money.MoneyName}不足！ 无法继续操作!`);
                        return false
                    }
                    break;
            }
        } else {
            // 关闭经济 直接返回true
            return true;
        }
    }
}
