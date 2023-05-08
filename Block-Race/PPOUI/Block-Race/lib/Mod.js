import { PLUGIN_INFO, Game_Cache } from "../lib/Cache.js"

/**
 * 功能类
 */
export class Mod {
    /**
     * 获取时间字符串
     * @returns 
     */
    static getTimieStr() {
        // windows不支持：文件名
        const obj = system.getTimeObj();
        return `${obj.Y}-${obj.M}-${obj.D}_${obj.h}-${obj.m}-${obj.s}`;
    }
    /**
     * 随机ID
     * @param {Number} num 长度
     * @returns 
     */
    static RandomID(num = 10) {
        let str = '';
        const char = '1234567890QWERTYUIOPASDFGHJKLZXCVBNM';
        for (let i = 0; i < num; i++) {
            let index = Math.floor(Math.random() * char.length);
            str += char[index];
        }
        return str;
    }
    /**
     * 保存对局数据
     */
    static SaveCache(filename = `${this.getTimieStr()}_${this.RandomID(8)}`) {
        logger.info('保存对局数据...');
        try {
            logger.debug(PLUGIN_INFO.filepath + `Cache\\${filename}.json`);
            if (file.writeTo(PLUGIN_INFO.filepath + `Cache\\${filename}.json`, JSON.stringify(Game_Cache))) {
                logger.info('保存成功！');
            } else {
                logger.error('保存失败！');
            }
        } catch (e) {
            logger.error(`保存失败！\n` + e);
        }
    }
}
