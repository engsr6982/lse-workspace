import { RegCommand } from "./command/RegCommand.js";
import { RegEvent } from "./other/event.js";
import { BegCheckUpdate } from "./modules/BegCheckUpdate.js";
import { update } from "./other/JSON_TO_SQL.js";
import checkJSONElements from "./modules/checkJSONElements.js";
import { Config, __inits, FileOper, PLUGIN_INFO } from "./utils/cache.js";

function init() {
    // 注册插件
    ll.registerPlugin(PLUGIN_INFO.Name, PLUGIN_INFO.Introduce, PLUGIN_INFO.Version, {
        Author: PLUGIN_INFO.Author,
        MineBBS: PLUGIN_INFO.MineBBS,
    });
    // 设置日志
    if (file.exists(`.\\plugins\\${PLUGIN_INFO.Author}\\debug`)) {
        logger.setTitle(PLUGIN_INFO.Name + " Debug");
        logger.setLogLevel(5);
        mc.listen("onUseItemOn", (pl, it) => {
            if (it.type == "minecraft:snowball") {
                pl.runcmd("fp");
            }
        });
    }
    // 读取文件
    FileOper.readFile();
    // 注册事件
    RegEvent();
    mc.listen("onServerStarted", () => {
        // 注册命令
        RegCommand();
        // 检查版本更新  测试时不检查
        if (!file.exists(`.\\plugins\\${PLUGIN_INFO.Author}\\debug`)) {
            BegCheckUpdate(PLUGIN_INFO.Name, PLUGIN_INFO.MineBBS, PLUGIN_INFO.Version);
        }
        // json更新sql
        update();
        // 检查配置文件
        new checkJSONElements(__inits._Config, Config, true)
            .check()
            .then((newConfig) => {
                FileOper.setConfig(newConfig).save_File();
            })
            .catch((e) => {
                logger.error(`${e}\n${e.stack}`);
            });
    });

    logger.info(`版本: ${PLUGIN_INFO.Version.join().replace(/\,\d$/, "").replace(/,/g, ".")}`);
    logger.info(`作者: ${PLUGIN_INFO.Author}`);
    logger.info(`MineBBS: ${PLUGIN_INFO.MineBBS}`);
}

init();
