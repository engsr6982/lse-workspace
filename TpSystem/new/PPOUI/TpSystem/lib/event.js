import { FileOperation, Config, PlayerSeting, Death } from "./cache.js";
import { MAPPING_TABLE } from "./form/Mian.js";

export function RegEvent() {
    /* 监听进服事件 */
    mc.listen('onJoin', (pl) => {
        if (pl.isSimulatedPlayer()) return;
        if (!PlayerSeting.hasOwnProperty(pl.realName)) {
            logger.warn(`玩家${pl.realName} 的配置不存在，正在新建配置...`);
            PlayerSeting[pl.realName] = Config.PlayerSeting;
            FileOperation.saveFile();
        } else if (Config.AutoCompleteAttributes) {
            // 0.0.5版本新增属性检查
            for (let ps in Config.PlayerSeting) {
                if (Config.PlayerSeting.hasOwnProperty(ps) && !PlayerSeting[pl.realName].hasOwnProperty(ps)) {
                    PlayerSeting[pl.realName][ps] = Config.PlayerSeting[ps];
                    logger.warn(`玩家[${pl.realName}] ${ps} 属性缺失，已自动补齐`);
                }
            }
            FileOperation.saveFile();
        }
    })
    /* 监听死亡事件 */
    mc.listen('onPlayerDie', (pl, sou) => {
        if (pl.isSimulatedPlayer()) return;
        const data = {
            time: system.getTimeStr(),
            x: pl.blockPos.x,
            y: pl.blockPos.y,
            z: pl.blockPos.z,
            dimid: pl.blockPos.dimid
        }
        Death[pl.realName] = data;
        FileOperation.saveFile();
    })
    //玩家退出游戏
    // mc.listen('onLeft', (pl) => {
    //     if (pl.isSimulatedPlayer()) return;
    //     TPA_Cache.DeleteCache(pl);
    // })
    //玩家重生
    mc.listen('onRespawn', (pl) => {
        // 发送返回死亡点弹窗
        if (Config.Death.sendBackGUI == true && PlayerSeting[pl.realName].DeathPopup == true) {
            MAPPING_TABLE["DeathUi"](pl);//todo 待尝试pl.isloading接口
        }
    })
}
