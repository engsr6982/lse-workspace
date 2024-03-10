import { RegCommand } from "./command/RegCommand.js";
import { CheckConfigFile } from "./include/JsonChecker.js";
import { RegEvent } from "./Event/McEvent.js";
import { ConfigOperation } from "./utils/config.js";
import { pluginInformation } from "./utils/GlobalVars.js";

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
        // 检查配置文件
        CheckConfigFile();
    });

    logger.info(`Version: ${pluginInformation.version.join(".")}`);
    logger.info(`Author: ${pluginInformation.author}`);
}

init();
