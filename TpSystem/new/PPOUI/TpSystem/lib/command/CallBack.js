import { Main } from "../form/Mian.js";
import { MainUI } from "../cache.js";
import { SetingForm } from "../form/Seting_Mgr.js";

export function CallBack(_, ori, out, res) {
    switch (res.action) {
        case "mgr":
            SetingForm(ori.player);
            break;
        default: Main(ori.player, MainUI);
    }
}