
import { FPManager } from "../FPManager/Manager.js";
import { cache } from "../FPManager/instanceCache.js";
import { Config } from "../utils/cache.js";

export function RegEvent() {
    try {
        // 自动上线
        if (Config.AutomaticOnline) {
            mc.listen("onServerStarted", async () => {
                FPManager.init() ? FPManager.onlineAll(true) : logger.error(`初始化全局实例缓存失败`);
                // logger.debug(JSON.stringify(cache.get("q"), null, 2));
            });
        }

        // 自动复活
        if (Config.AutomaticResurrection) {
            mc.listen("onPlayerDie", (pl) => {
                if (pl.isSimulatedPlayer()) {
                    const info = FPManager.getInfo(pl.realName);
                    if (info.isAutoResurrection) {
                        const name = pl.realName;
                        FPManager.offOnline(pl.realName);
                        setTimeout(() => {
                            FPManager.online(name);
                        }, 500);
                    }
                }
            });
        }

        // 拦截伤害
        if (Config.InterceptDamage) {
            mc.listen("onMobHurt", function (mob) {
                if (mob.isPlayer()) {
                    const p = mc.getPlayer(mob.uniqueId);
                    const info = FPManager.getInfo(p.realName);
                    if (info != null && info.isInvincible) return false;
                }
            });
        }

        // 监听背包变动
        mc.listen("onInventoryChange", async (player) => {
            if (player.isSimulatedPlayer()) {
                player.refreshItems();
                cache.get(player.realName).updateBagToKVDB() ? logger.debug(`updated`) : logger.debug(`update err`);
                player.refreshItems();
            }
        });
    } catch (err) {
        logger.error(`注册事件失败：${err}\n${err.stack}`);
    }
}
