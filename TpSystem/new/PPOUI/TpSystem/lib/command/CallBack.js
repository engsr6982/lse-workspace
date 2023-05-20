import { Main } from "../form/Mian.js";
import { MainUI } from "../cache.js";

export function CallBack(_, ori, out, res) {
    switch (res.action) {
        default: Main(ori.player, MainUI);
    }
}