// LiteLoader-AIDS automatic generated
/// <reference path="c:\Users\Administrator\Documents\aids/dts/HelperLib-master/src/index.d.ts"/> 

/* 注册命令 */
import { RegCommand } from "./plugins/PPOUI/Block-Race/lib/Command/RegCmd.js";
import { PLUGIN_INFO } from "./plugins/PPOUI/Block-Race/lib/Cache.js";


function init() {
    // 注册
    {
        ll.registerPlugin(
            /* name */ PLUGIN_INFO.name,
            /* introduction */ PLUGIN_INFO.introduction,
            /* version */ PLUGIN_INFO.version,
            /* otherInformation */ {
                "名称": PLUGIN_INFO.name
            }
        );
        logger.warn('警告：插件不稳定测试中！ 请勿用于生产环境！后果自负！');
        if (file.exists('.\\plugins\\PPOUI\\debug')) {
            PLUGIN_INFO.debugger = true;
            logger.setTitle(`${PLUGIN_INFO.name} Debug`);
            logger.setLogLevel(5);
        }
    }

    /* 监听事件 */
    mc.listen('onServerStarted', () => {
        if (RegCommand()) {
            setTimeout(() => {
                mc.runcmd('/? br');
            }, 1000);
        }
    })
}

init();