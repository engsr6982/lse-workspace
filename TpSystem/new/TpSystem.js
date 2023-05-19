
import { FileOperation } from "./PPOUI/TpSystem/lib/FileOPeration.js";

import { RegCommand } from "./PPOUI/TpSystem/lib/command/RegCommand.js";

import { PLUGIN_INFO, Gm_Tell } from "./PPOUI/TpSystem/lib/cache.js";

function init() {
    // 注册插件
    ll.registerPlugin(
            /* name */ PLUGIN_INFO.Name,
            /* introduction */ PLUGIN_INFO.Introduce,
            /* version */ PLUGIN_INFO.Version,
            /* otherInformation */ {
            "作者": PLUGIN_INFO.Author,
            "发布网站": PLUGIN_INFO.MineBBS
        }
    );
    // 设置日志等级
    if (File.exists(`.\\plugins\\${PLUGIN_INFO.Author}\\debug`)) {
        logger.setTitle(PLUGIN_INFO.Name + ' Debug');
        logger.setLogLevel(5);
        logger.warn('你已开启Debug模式，将会输出Debug信息');
        Gm_Tell = `§e§l[§d${PLUGIN_INFO.Name}§c Debug§e]§r§a `;
        mc.listen("onUseItemOn", (pl, it, bl, si) => {
            if (it.type == 'minecraft:stick') {
                pl.runcmd("tps ");
            }
        })
    }

    // 读取文件
    FileOperation.readFile();
    // 注册命令
    RegCommand();
}


mc.listen('onServerStarted', () => {
    init();
})