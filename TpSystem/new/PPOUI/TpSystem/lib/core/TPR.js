import { Money_Mod } from "../Money.js";
import { Gm_Tell, Config } from "../cache.js";

export async function RandomTeleportCore(pl) {
    // 检查是否开启
    if (pl.blockPos.dimid == 0 && Config.TPR.MainWorld == false) return pl.tell(Gm_Tell + `随机传送在当前维度不可用！`);//主世界关闭
    if (pl.blockPos.dimid == 1 && Config.TPR.Infernal == false) return pl.tell(Gm_Tell + `随机传送在当前维度不可用！`);//地狱关闭
    if (pl.blockPos.dimid == 2 && Config.TPR.Terminus == false) return pl.tell(Gm_Tell + `随机传送在当前维度不可用！`);//末地关闭
    // 检查经济
    if (Money_Mod.DeductEconomy(pl, Config.TPR.Money)) {
        pl.tell(Gm_Tell + `准备传送...`);
        let Pos_Y = 500;
        let to_Pos = new IntPos(RandomCoordinates(), Pos_Y, RandomCoordinates(), pl.blockPos.dimid);
        let Block_Obj = mc.getBlock(to_Pos);
        const BackUpPos = pl.blockPos;

        pl.teleport(to_Pos);
        pl.tell(Gm_Tell + `等待区块加载...`);
        const ID = setInterval(() => {
            if (pl.blockPos.y != Pos_Y) {
                _run();
                logger.debug('Start _run')
                clearInterval(ID);
                return;
            }
            logger.debug('等待...');
        }, 200)

        function _run() {
            Pos_Y = 301;
            pl.tell(Gm_Tell + `寻找安全坐标...`)
            for (Pos_Y = Pos_Y; Pos_Y > 0; Pos_Y--) {
                if (Block_Obj == null || Block_Obj.type == 'minecraft:air') {
                    UpdatePos_Y(Pos_Y);
                    Block_Obj = mc.getBlock(to_Pos);
                    logger.debug(Pos_Y, Block_Obj);
                } else {
                    if (Pos_Y < -60 || ["minecraft:lava", "minecraft:flowing_lava"].indexOf(Block_Obj.type) != -1) {
                        // 如果 Block_Obj type 属性等于 "minecraft:lava" 或 "minecraft:flowing_lava"，则执行以下代码块
                        pl.teleport(BackUpPos);
                        pl.tell(Gm_Tell + `查询安全坐标失败！`);
                        break;
                    } else if (Block_Obj.type != "minecraft:air") {
                        UpdatePos_Y(Pos_Y + 2);
                        pl.teleport(to_Pos);
                        pl.tell(Gm_Tell + `传送完成！`);
                        logger.debug(to_Pos);
                        break;
                    }
                }
            }
        }

        function UpdatePos_Y(Y) {
            const Back = to_Pos;
            to_Pos = new IntPos(Back.x, Y, Back.z, Back.dimid);
        }
        function RandomCoordinates() {
            const num = Math.floor(Math.random() * (Config.TPR.Max - Config.TPR.Min + 1)) + Config.TPR.Min;
            return Math.random() < 0.5 ? -num : num;
        }
    }
}
