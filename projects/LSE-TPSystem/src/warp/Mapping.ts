import { leveldb } from "../utils/leveldb.js";
import { formatAndPrintingError, hasOwnProperty_, randomString } from "../utils/util.js";

class WarpMapping {
    constructor() {}

    /** 公共点名称 > 数组索引 */
    map: {
        [warp: string]: number;
    } = {};

    hasWarp(name: string) {
        return hasOwnProperty_(this.map, name);
    }

    async initWarpMapping(): Promise<boolean> {
        try {
            logger.debug("正在构建 Warp 数据映射...");
            const allWarps = leveldb.getWarp();

            this.map = {};

            let index = 0;
            while (index < allWarps.length) {
                // logger.debug(index);
                const warp = allWarps[index++];

                if (hasOwnProperty_(this.map, warp.name)) {
                    logger.error(`构建 Warp 映射错误，Warp: ${warp.name} 重复!`);
                    // continue;

                    // 尝试对重复的名称进行+1修复
                    if (allWarps[index - 1].name === warp.name) {
                        let status = false;
                        for (let __i = 0; __i < 5; __i++) {
                            const nextName = warp.name + `(${randomString(4)})`; // 保险起见，用随机字符串来解决此问题
                            if (!allWarps.some((_si) => _si.name == nextName)) {
                                // 名称未占用，跳出循环，修改名称
                                allWarps[index - 1].name = nextName;
                                status = leveldb.setWarp(allWarps);
                                break;
                            }
                        }
                        // 修复完成，结束当前构建，重新构建数据
                        if (status) {
                            logger.warn(`已修复映射错误，准备重新构建映射。受影响公共传送点 ${warp.name}`);
                            this.initWarpMapping();
                            break;
                        }
                        logger.fatal(`无法修复此映射错误，此 Warp 可能无法进行任何操作，Warp: ${warp.name} index: ${index - 1}`);
                    }
                }

                this.map[warp.name] = index - 1;
            }

            logger.debug(`Warp Mapping: \n${JSON.stringify(this.map, null, 2)}`);
            logger.debug(`构建 Warp 数据映射完成!`);
            return true;
        } catch (error) {
            formatAndPrintingError(error);
            return false;
        }
    }
}

export const warpMap = new WarpMapping();
