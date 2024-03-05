import { PLUGIN_INFO, dataOperation } from "./lib/Global.js";
import { importAPI } from "./lib/importAPI.js";

function init() {
    ll.registerPlugin(
        /* name */ PLUGIN_INFO.Name,
        /* introduction */ PLUGIN_INFO.Introduce,
        /* version */ PLUGIN_INFO.Version,
        /* otherInformation */ {
            作者: PLUGIN_INFO.Author,
            MineBBS: PLUGIN_INFO.MineBBS,
        },
    );

    // 设置日志等级
    if (file.exists(`.\\plugins\\${PLUGIN_INFO.Author}\\debug`)) {
        logger.setTitle(PLUGIN_INFO.Name + " Debug");
        logger.setLogLevel(5);
        mc.listen("onUseItemOn", (pl, it /* , bl, si */) => {
            if (it.type == "minecraft:stick" && PLUGIN_INFO.DebugAntiShake == false) {
                //pl.runcmd("tps ");
                PLUGIN_INFO.DebugAntiShake = true; // 防抖  不防抖可太尼玛难受了
            }
        });
    }

    // 读取文件
    dataOperation.read();

    // 导入API并注册事件
    mc.listen("onServerStarted", importAPI);

    logger.info(`版本: ${PLUGIN_INFO.Version.join().replace(/\,\d$/, "").replace(/,/g, ".")}`);
    logger.info(`作者: ${PLUGIN_INFO.Author}`);
    logger.info(`MineBBS: ${PLUGIN_INFO.MineBBS}`);
}

init();
