import { leveldb } from "../utils/leveldb.js";
import { formatAndPrintingError, hasOwnProperty_, randomString } from "../utils/util.js";

class HomeMapping {
    constructor() {}
    /** 家数据映射 */
    map: {
        /** 玩家真名 */
        [realName: string]: {
            /** 家名称 > 数组索引 */
            [home: string]: number;
        };
    } = {};

    hasHome(realName: string, home: string) {
        if (!this.hasPlayer(realName)) return false;
        return hasOwnProperty_(this.map[realName], home);
    }

    hasPlayer(realName: string) {
        return hasOwnProperty_(this.map, realName);
    }

    async updatePlayerHomeMapping(realName: string): Promise<boolean> {
        try {
            const allPlayerHomes = leveldb.getHome();
            const playerHome = allPlayerHomes[realName];

            let index = 0; // 家园下标
            while (index < playerHome.length) {
                const home = playerHome[index++]; // 获取家数据

                if (hasOwnProperty_(this.map[realName], home.name)) {
                    logger.error(`构建 Home 映射错误，玩家 ${realName} 的 Home: ${home.name} 重复!`);
                    // continue;

                    // 尝试对重复的名称进行+1修复
                    if (playerHome[index - 1].name === home.name) {
                        let status = false;
                        for (let __i = 0; __i < 5; __i++) {
                            const nextName = home.name + `(${randomString(4)})`; // 保险起见，用随机字符串来解决此问题
                            if (!playerHome.some((_si) => _si.name == nextName)) {
                                // 名称未占用，跳出循环，修改名称
                                allPlayerHomes[realName][index - 1].name = nextName;
                                status = leveldb.setHome(allPlayerHomes);
                                break;
                            }
                        }
                        // 修复完成，结束当前构建，重新构建数据
                        if (status) {
                            logger.warn(`已修复映射错误，准备重新构建映射。受影响玩家 ${realName} => ${home.name}`);
                            this.initHomeMapping();
                            break;
                        }
                        logger.fatal(`无法修复此映射错误，此 Home 可能无法进行任何操作，Name: ${home.name} index: ${index - 1}`);
                    }
                }

                this.map[realName][home.name] = index - 1; // 写入映射 值为家下标  由于前面+1 是下一个Home的数据，故这里-1
            }
            return true;
        } catch (error) {
            formatAndPrintingError(error);
            return false;
        }
    }

    async initHomeMapping(): Promise<boolean> {
        try {
            logger.debug("正在构建 Home 数据映射...");
            const allHome = leveldb.getHome(); // 获取所有家数据
            const allHomeKeys = Object.keys(allHome); // 获取key

            this.map = {};

            let index = 0; // 玩家下标
            // 遍历玩家
            while (index < allHomeKeys.length) {
                const playerName = allHomeKeys[index++]; // 获取玩家名

                if (hasOwnProperty_(this.map, playerName)) {
                    logger.fatal(`构建 Home 映射错误，玩家 ${playerName} 重复!`);
                    continue;
                }

                this.map[playerName] = {}; // 初始化映射
                // 遍历玩家家数据
                await this.updatePlayerHomeMapping(playerName);

                logger.debug(`构建玩家 ${playerName} 数据映射完成!`);
            }

            logger.debug(`Home Mapping: \n${JSON.stringify(this.map, null, 2)}`);
            logger.debug(`构建 Home 数据映射完成!`);
            return true;
        } catch (e) {
            formatAndPrintingError(e);
            return false;
        }
    }
}

export const homeMap = new HomeMapping();
