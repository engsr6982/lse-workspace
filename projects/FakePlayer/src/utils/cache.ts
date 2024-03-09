/**插件信息 */
export const PLUGIN_INFO = {
    Name: "FakePlayer",
    Introduce: "模拟玩家/假人",
    Version: [4, 4, 0, Version.Release] as readonly [number, number, number, Version],
    Author: "PPOUI",
    MineBBS: "https://www.minebbs.com/resources/fp-gui-csv.5031/",
};

/**消息前缀 */
export const Gm_Tell = file.exists(`.\\plugins\\${PLUGIN_INFO.Author}\\debug`)
    ? `§e§l[§d${PLUGIN_INFO.Name}§e]§r§b `
    : `§e§l[§d${PLUGIN_INFO.Name} Debug§e]§r§b `;

/**待释放配置文件 */
export const __inits = {
    /**配置文件 */
    _Config: {
        /**自动上线 */ AutomaticOnline: true,
        /**假人无敌 */ InterceptDamage: true,
        /**自动复活 */ AutomaticResurrection: true,
        /**日志配置*/ CsvLogger: {
            /**输出目录*/ Output: ".\\logs\\FP\\",
            /**输出文件*/ FileName: "FP_%Y%-%M%-%D%.csv",
        },
        /**最大在线时间 */ MaxOnline: {
            Time: 30,
            Enable: false,
        },
    },
};

/**文件路径 */
export const _filePath = `.\\Plugins\\${PLUGIN_INFO.Author}\\${PLUGIN_INFO.Name}\\`;

/**配置文件 */
export let Config = __inits._Config;

export class FileOper {
    static path_Config = _filePath + "Config.json";

    /**
     * 检查所有文件
     */
    static checkFile() {
        if (!file.exists(this.path_Config)) {
            file.writeTo(this.path_Config, JSON.stringify(__inits._Config, null, "\t"));
        }
    }

    /**
     * 读取所有文件
     */
    static readFile() {
        this.checkFile();
        try {
            Config = JSON.parse(file.readFrom(this.path_Config));
        } catch (err) {
            logger.error(`${err}\n${err.stack}`);
        }
    }

    static setConfig(newConfig) {
        Config = newConfig;
        return this;
    }

    /**
     * 保存所有文件
     * @returns
     */
    static save_File() {
        try {
            file.writeTo(this.path_Config, JSON.stringify(Config, null, 4));
            this.readFile();
            return true;
        } catch (err) {
            logger.error(`${err}\n${err.stack}`);
            return false;
        }
    }
}
