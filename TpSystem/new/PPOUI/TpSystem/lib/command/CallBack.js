import { MAPPING_TABLE, Main } from "../form/Mian.js";
import { FileOperation, MainUI, PlayerSeting } from "../cache.js";
import { SetingForm } from "../form/Seting_Mgr.js";
import { RandomTeleportCore } from "../core/TPR.js";
import { HomeForm } from "../form/Home.js";
import { WarpForm } from "../form/Warp.js";
import { TPRForm } from "../form/TPR.js";
import {TPAEntrance} from "../form/TPAEntrance.js"

export function CallBack(_, ori, out, res) {
    switch (res.action) {
        case "mgr":
            if (ori.type !== 0) return out.error('此命令仅限玩家执行');
            if (!ori.player.isOP()) return out.error('仅限管理员使用');
            SetingForm(ori.player);
            break;
        case "reload":
            if (ori.type !== 7) return out.error('此命令仅限控制台执行');
            FileOperation.saveFile();
            out.success('---操作完成---');
            break;
        case "tpr":
            if (!ori.player) return out.error('获取玩家对象失败！');
            RandomTeleportCore(ori.player);
            break;
        case 'refresh':
            if (ori.type !== 7) return out.error('此命令仅限控制台执行');
            FileOperation.readFile();
            out.success('---操作完成---');
            break;
        case 'back':
            if (!ori.player) return out.error('获取玩家对象失败！');
            MAPPING_TABLE['DeathUi'](ori.player);
            break;
        case 'gui':
            if (!ori.player) return out.error('获取玩家对象失败！');
            const Table = {
                home: HomeForm.Panel,
                warp: WarpForm,
                // player: Forms.PlayerTransportation,
                death: TPRForm,
                tpr: TPRForm,
                tpa: TPAEntrance,
                seting: PlayerSeting
            }
            if (res.gui_name) {
                Table[res.gui_name](ori.player);
            } else {
                Main(ori.player, MainUI);
            }
            break;
        case 'accept':
            break;
        case "deny":
            break;
        default: Main(ori.player, MainUI);
    }
}