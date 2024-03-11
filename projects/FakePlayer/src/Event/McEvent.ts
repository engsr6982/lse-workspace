import { FPManager } from "../FPManager/Manager.js";
import { instanceCache } from "../FPManager/instanceCache.js";
import { Config } from "../utils/config.js";

export function RegEvent() {
    try {
        // 自动上线
        if (Config.AutomaticOnline) {
            mc.listen("onServerStarted", async () => {
                FPManager.initCache() ? FPManager.onlineAll(true) : logger.error(`初始化全局实例缓存失败`);
            });
        }

        // 自动复活
        if (Config.AutomaticResurrection) {
            mc.listen("onPlayerDie", (pl) => {
                if (pl.isSimulatedPlayer()) {
                    const inst = FPManager.getDummyInst(pl.realName);
                    if (inst.isAutoRespawn) {
                        inst.get().simulateRespawn();
                    }
                }
            });
        }

        // 拦截伤害
        if (Config.InterceptDamage) {
            mc.listen("onMobHurt", function (mob) {
                if (mob.isPlayer()) {
                    const p = mc.getPlayer(mob.uniqueId);
                    const info = FPManager.getDummyInst(p.realName);
                    if (info != null && info.isInvincible) return false;
                }
            });
        }

        // 监听背包变动
        mc.listen("onInventoryChange", async (player) => {
            if (player.isSimulatedPlayer()) {
                player.refreshItems();
                instanceCache.get(player.realName).setBagToLevelDB()
                    ? logger.debug(`setBagToLevelDB success`)
                    : logger.error(`Fail in Function: setBagToLevelDB`);
                player.refreshItems();
            }
        });
    } catch (err) {
        logger.error(`注册事件失败：${err}\n${err.stack}`);
    }
}
