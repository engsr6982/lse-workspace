import { Mod } from "../Mod.js"

export function Callback(_, ori, out, res) {
    logger.debug(JSON.stringify(res));
    switch (res.action) {
        case 'gui':
            break;
        case 'save':
            Mod.SaveCache();
            break;
        case 'start':
            break;
        case 'reload':
            break;
    }
}

