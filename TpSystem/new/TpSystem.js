import { RegCommand } from "./plugins/PPOUI/TpSystem/lib/command/RegCommand.js";

import { FileOperation, PLUGIN_INFO} from "./plugins/PPOUI/TpSystem/lib/cache.js";

import { RegEvent } from "./plugins/PPOUI/TpSystem/lib/event.js";
import { RegInterval } from "./plugins/PPOUI/TpSystem/lib/Interval.js";
import KVDBTransformation from "./plugins/PPOUI/TpSystem/lib/KVDB.js";

function init() {
    // 注册插件
    ll.registerPlugin(
            /* name */ PLUGIN_INFO.Name,
            /* introduction */ PLUGIN_INFO.Introduce,
            /* version */ PLUGIN_INFO.Version,
            /* otherInformation */ {
            "作者": PLUGIN_INFO.Author,
            "MineBBS": PLUGIN_INFO.MineBBS
        }
    );
    // 设置日志等级
    if (File.exists(`.\\plugins\\${PLUGIN_INFO.Author}\\debug`)) {
        logger.setTitle(PLUGIN_INFO.Name + ' Debug');
        logger.setLogLevel(5);
        logger.warn('你已开启Debug模式，将会输出Debug信息');
        mc.listen("onUseItemOn", (pl, it/* , bl, si */) => {
            if (it.type == 'minecraft:stick' && PLUGIN_INFO.DebugAntiShake == false) {
                pl.runcmd("tps ");
                PLUGIN_INFO.DebugAntiShake = true;// 防抖  不防抖可太尼玛难受了
            }
        })
    }

    // 读取文件
    FileOperation.readFile();
    // 注册监听器
    RegEvent();
    // 注册循环检查器
    RegInterval();
    // 注册命令
    mc.listen('onServerStarted', () => {
        RegCommand();

        new KVDBTransformation().init();// 初始化数据库
    })

    logger.info(`版本: ${PLUGIN_INFO.Version.join().replace(/\,\d$/, '').replace(/,/g, '.')}`);
    logger.info(`作者: ${PLUGIN_INFO.Author}`);
    logger.info(`MineBBS: ${PLUGIN_INFO.MineBBS}`);
}

init();