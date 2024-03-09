import { RegCommand } from "./command/RegCommand.js";
import { CheckConfigFile } from "./include/jsonchecker.js";
import { RegEvent } from "./other/event.js";
import { update } from "./DB/SQL/JSON_TO_SQL.js";
import { ConfigOperation, pluginInformation } from "./utils/cache.js";

function init() {
    // 注册插件
    ll.registerPlugin(pluginInformation.name, pluginInformation.introduce, pluginInformation.version, {
        Author: pluginInformation.author,
    });
    // 读取文件
    ConfigOperation.initConfig();
    // 注册事件
    RegEvent();
    mc.listen("onServerStarted", () => {
        // 注册命令
        RegCommand();
        // json更新sql
        update();
        // 检查配置文件
        CheckConfigFile();
    });

    logger.info(`Version: ${pluginInformation.version.join(".")}`);
    logger.info(`Author: ${pluginInformation.author}`);
}

init();
