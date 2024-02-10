import { form } from "./GUI.js";
import { AntiShakeCache, PLUGIN_INFO } from "./cache.js";
import { boxCore } from "./core.js";
import { Listener } from "./modules/listenAPI.js";


export function RegEvent() {
    try {
        mc.listen("onUseItemOn", (player, item, block) => {
            // 防抖
            if (AntiShakeCache.has(player.xuid)) return;
            AntiShakeCache.set(player.xuid, true);
            setTimeout(() => {
                AntiShakeCache.delete(player.xuid);
            }, 250);
            // 功能
            logger.debug(player.getHand().type);
            if (player.isSneaking && player.getHand().type == "minecraft:wooden_sword") {
                if (player.getExtraData("isAddBox")) {
                    player.delExtraData("isAddBox");
                    if (block.hasContainer()) {
                        player.setExtraData("bindBoxPos", block.pos);
                        form.addBox(player);
                    } else {
                        form.tell(player, "添加失败！ 被点击方块不是箱子之类的容器!");
                    }
                } else if (block.hasContainer()) {
                    const box = boxCore.getBoxInPos(block.pos);
                    box.length == 0 ?
                        form.tell(player, "这是一个普通的箱子，没什么特别的") :
                        form.tell(player, `此箱子已绑定玩家: ${data.xuid2name(box[0].XUID) || box[0].XUID}`);
                }
            }
        });

        // 初始化间接监听器
        Listener.init(PLUGIN_INFO.Name);
    } catch (e) {
        logger.error(e);
        logger.error(e.stack);
    }
}

/**添加箱子事件 */
export const onWirelessAddBox = new Listener("onWirelessAddBox");
/**删除箱子事件 */
export const onWirelessDeleteBox = new Listener("onWirelessDeleteBox");
/**编辑箱子事件 */
export const onWirelessEditBox = new Listener("onWirelessEditBox");