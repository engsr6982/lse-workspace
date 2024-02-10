import { RegCommand } from "./plugins/PPOUI/WirelessBox/lib/Command/RegCommand.js";
import { PLUGIN_INFO } from "./plugins/PPOUI/WirelessBox/lib/cache.js";
import { RegEvent } from "./plugins/PPOUI/WirelessBox/lib/event.js";
import {} from "./plugins/PPOUI/WirelessBox/lib/export.js";

function init() {
    ll.registerPlugin(PLUGIN_INFO.Name, PLUGIN_INFO.Introduce, PLUGIN_INFO.Version, { "Author": PLUGIN_INFO.Author });
    file.exists(`.\\plugins\\PPOUI\\debug`) ? logger.setLogLevel(5) : null;
    RegCommand();
    RegEvent();

    logger.info(`版本: ${PLUGIN_INFO.Version.join().replace(/\,\d$/, '').replace(/,/g, '.')}`);
    logger.info(`作者: ${PLUGIN_INFO.Author}`);
    logger.info(`MineBBS: ${PLUGIN_INFO.MineBBS}`);
}

init();