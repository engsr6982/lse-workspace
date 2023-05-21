import { FileOperation, Config, PlayerSeting, Death, DeathInvincible } from "./cache.js";
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
    if (Config.Death.Enable) {
        mc.listen('onPlayerDie', (pl) => {
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
    }
    //玩家退出游戏
    // mc.listen('onLeft', (pl) => {
    //     if (pl.isSimulatedPlayer()) return;
    //     TPA_Cache.DeleteCache(pl);
    // })
    //玩家重生
    mc.listen('onRespawn', (pl) => {
        if (pl.isSimulatedPlayer()) return;
        if (pl.gameMode !== 0) return;
        let count = 50;
        if (pl.pos.dimid == 0 || pl.getRespawnPosition().dimid == pl.pos.dimid) {
            // 在主世界 或 重生维度在当前维度
            send(pl);
        } else {
            // 不在主世界 
            const id = setInterval(() => {
                if (pl !== null && count > 0) {
                    // 玩家对象不为null 且 count 大于0
                    if (pl.isInsidePortal == 0 && pl.pos.dimid == 0) {
                        // 玩家在主世界 且 不在传送门中
                        send(pl);
                    } else {
                        count--;
                    }
                } else {
                    // 玩家离线/count小于0   取消任务
                    clearInterval(id);
                }
            }, 1000);
        }

        function send(pl) {
            if (Config.Death.sendBackGUI == true && PlayerSeting[pl.realName].DeathPopup == true) {
                MAPPING_TABLE["DeathUi"](pl);// 发送返回死亡点弹窗
            }
        }
    })

    // 受伤事件
    mc.listen("onMobHurt", function (mob, source, damage, cause) {
        if (mob.isPlayer()) {
            // 是玩家 获取玩家对象
            const pl = mc.getPlayer(mob.uniqueId);
            const index = DeathInvincible.findIndex(i => i.name === pl.realName);
            if (index !== -1) {
                return false;
            }
        }
    })
}