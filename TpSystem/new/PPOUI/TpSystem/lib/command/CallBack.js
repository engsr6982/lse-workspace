// LiteLoader-AIDS automatic generated
/// <reference path="c:\Users\Administrator\Documents\aids/dts/HelperLib-master/src/index.d.ts"/> 

import { MAPPING_TABLE, Main } from "../form/Main.js";
import { FileOperation, MainUI, _filePath, db } from "../cache.js";
import { SetingForm } from "../form/Seting_Mgr.js";
import { RandomTeleportCore } from "../core/TPR.js";
import { HomeForm } from "../form/Home.js";
import { WarpForm } from "../form/Warp.js";
import { TPRForm } from "../form/TPR.js";
import { PlayerSetingForm } from "../form/PlayerSeting.js";
import KVDBTransformation from "../KVDB.js";

export function CallBack(_, ori, out, res) {
    logger.debug(JSON.stringify(res));
    switch (res.action) {
        case "mgr":
            if (ori.type !== 0) return out.error('此命令仅限玩家执行');
            if (!ori.player.isOP()) return out.error('仅限管理员使用');
            SetingForm(ori.player);
            break;
        case "reload":
            if (ori.type !== 7) return out.error('此命令仅限控制台执行');
            FileOperation.readFile();
            out.success('---操作完成---');
            break;
        case "tpr":
            if (!ori.player) return out.error('获取玩家对象失败！');
            RandomTeleportCore(ori.player);
            break;
        // case 'refresh':
        //     if (ori.type !== 7) return out.error('此命令仅限控制台执行');
        //     FileOperation.readFile();
        //     out.success('---操作完成---');
        //     break;
        case 'back':
            if (!ori.player) return out.error('获取玩家对象失败！');
            MAPPING_TABLE['DeathUi'](ori.player);
            break;
        case 'gui':
            if (!ori.player) return out.error('获取玩家对象失败！');
            const Table = {
                home: HomeForm.Panel,
                warp: WarpForm,
                // player: Forms.PlayerTransportation,//todo tpa的表单函数
                death: TPRForm,
                tpr: TPRForm,
                seting: PlayerSetingForm
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
        case "db": action_db(_, ori, out, res); break;
        default: Main(ori.player, MainUI);
    }
}

// 数据库操作
function action_db(_, ori, out, res) {
    if (ori.type !== 7) return out.error('此命令仅限控制台执行');
    const KVDB = new KVDBTransformation();// 实例化KVDB转换类
    switch (res.acdb) {
        case 'listkey':
            logger.info('[KVDB数据库] 键：', db.listKey());
            break;
        case 'list':
            try {
                if (res.key1) {
                    logger.info('[KVDB数据库] ', db.get(res.key)[res.key1]);
                } else {
                    logger.info('[KVDB数据库] ', db.get(res.key));
                }
            } catch (e) {
                logger.error(e);
            }
            break;
        case 'todb':
            if (KVDB.todb()) {
                out.success('---操作完成---');
            }
            break;
        case 'tojson':
            if (KVDB.tojson()) {
                out.success('---操作完成---');
            }
            break;
        case 'delete':
            try {
                if (res.key1) {
                    let tmp = db.get(res.key); const key1 = res.key1;
                    logger.info('[KVDB数据库] ', delete tmp[key1]);
                    db.set(res.key, tmp);
                } else {
                    logger.info('[KVDB数据库] ', db.delete(res.key));
                }
            } catch (e) {
                logger.error(e);
            }
            break;
    }
}