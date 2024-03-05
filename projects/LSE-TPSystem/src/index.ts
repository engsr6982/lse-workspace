import { regCommand } from "./command/regCommand.js";
import { config, dataFile } from "./utils/data.js";
import { leveldb } from "./utils/leveldb.js";
import { initMoneyModule } from "./include/money.js";
import { warpMap } from "./warp/Mapping.js";
import { homeMap } from "./home/Mapping.js";
import { pluginFloder, pluginInformation } from "./utils/GlobalVars.js";
import { Listener } from "./modules/listenAPI.js";
import { checkConfig } from "./include/checkConfig.js";

dataFile.initData();

// config.Debug ? logger.setLogLevel(5) : undefined;

// 设置日志等级
config.logLevel <= 5 && config.logLevel >= 0 ? logger.setLogLevel(config.logLevel) : undefined;

// 创建文件夹
!file.exists(pluginFloder.import_) ? file.mkdir(pluginFloder.import_) : undefined;
!file.exists(pluginFloder.export_) ? file.mkdir(pluginFloder.export_) : undefined;

// 注册插件
ll.registerPlugin(pluginInformation.name, pluginInformation.introduce, pluginInformation.version, {
    Author: pluginInformation.author,
});

// 初始化 ListenAPI
Listener.init(pluginInformation.name);

// 初始化经济模块
initMoneyModule();

// 初始化数据库
leveldb.initLevelDB();

// 检查配置文件
checkConfig();

mc.listen("onServerStarted", () => {
    // 注册命令
    regCommand();
    // 初始化映射
    homeMap.initHomeMapping();
    warpMap.initWarpMapping();
});
