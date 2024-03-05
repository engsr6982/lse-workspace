import { config } from "../utils/data.js";
import { formatAndPrintingError, sendMessage } from "../utils/util.js";
import { money_Instance } from "../include/money.js";
import { RandomCoordinates } from "./randomCoordinates.js";

/**
 * 检查维度配置
 * @param player
 */
function CheckWorld(player: Player) {
    const { Overworld, TheNether, TheEnd } = config.Tpr.Dimension;
    if (player.pos.dimid === 0 && Overworld === false) return false;
    if (player.pos.dimid === 1 && TheNether === false) return false;
    if (player.pos.dimid === 2 && TheEnd === false) return false;
    return true;
}

let findPosCore: (
    pos: { x: number; z: number; dimid: number },
    whi: {
        startingValue: number;
        endValue: number;
        stopValue: number;
    },
    bl: string[],
    offset: {
        offset1: number;
        offset2: number;
    },
) => { status: 0 | 1; x: number; y: number; z: number; dimid: number } = null;

function findPos(player: Player, inX: number, inZ: number) {
    const whi: {
        startingValue: number;
        endValue: number;
        stopValue: number;
    } = player.pos.dimid !== 1 ? { startingValue: 301, stopValue: -62, endValue: -64 } : { startingValue: 110, stopValue: 5, endValue: 0 };
    const { status, x, y, z, dimid } = findPosCore(
        { x: inX, z: inZ, dimid: player.pos.dimid },
        whi,
        ["minecraft:lava", "minecraft:flowing_lava"],
        {
            offset1: 1,
            offset2: 2,
        },
    );

    if (status === 1) {
        player.teleport(new FloatPos(x + 0.5, y, z + 0.5, dimid));
        sendMessage(player, "传送完成！");
    } else {
        sendMessage(player, "传送失败，未找到安全坐标或插件异常");
    }
}

/**
 * 随机传送核心
 * @param player 玩家对象
 */
export function TPR_Core(player: Player) {
    let Interval_ID: number = null;
    let BackUpPos: IntPos = null;
    try {
        if (!CheckWorld(player)) {
            sendMessage(player, "随机传送在当前维度不可用！");
            return;
        }

        if (!money_Instance.deductPlayerMoney(player, config.Tpr.Money)) return;

        // 开始准备传送所需参数
        sendMessage(player, "准备传送...");
        const InitialY_Axis = 500;
        const randomCoordinateObject = RandomCoordinates(); // 获取随机坐标
        const InitialTargetCoordinates = new IntPos(randomCoordinateObject.x, InitialY_Axis, randomCoordinateObject.z, player.pos.dimid);
        let block_Obj = mc.getBlock(InitialTargetCoordinates);
        BackUpPos = player.blockPos; // 备份玩家当前坐标

        /**遍历基本信息 */
        let forPosInfo = {
            /**开始值 */ startPos: 301,
            /**结束值 */ forEnd: -64,
            /**失败值 */ failureEnd: -63,
        };
        if (player.pos.dimid === 1) {
            // 如果玩家在地狱维度
            forPosInfo = {
                startPos: 100,
                forEnd: 0,
                failureEnd: 10,
            };
        }

        player.teleport(InitialTargetCoordinates);
        sendMessage(player, "等待区块加载...");

        if (ll.hasExported("ZoneCheckV3", "findPos") && findPosCore == null) {
            findPosCore = ll.imports("ZoneCheckV3", "findPos");
        }
        Interval_ID = setInterval(() => {
            try {
                if (player.blockPos.y !== InitialY_Axis) {
                    findPosCore ? findPos(player, randomCoordinateObject.x, randomCoordinateObject.z) : _run();
                    clearInterval(Interval_ID);
                }
            } catch (e) {
                _fail(player, e);
            }
        }, 200);

        function _run() {
            try {
                sendMessage(player, "寻找安全坐标...");
                player.addEffect(11, 80, 255, true);

                let to_Pos: IntPos;
                let Pos_Y = forPosInfo.startPos;
                // 遍历方块对象
                for (Pos_Y; Pos_Y > forPosInfo.forEnd; Pos_Y--) {
                    // 打印Debug信息
                    // logger.debug(`Y轴: ${Pos_Y}  方块对象: ${block_Obj != null ? block_Obj.pos : null}   方块ID: ${block_Obj != null ? block_Obj.type : null}   坐标对象: ${to_Pos}  玩家坐标: ${player.blockPos}`);                    // 方块对象为null 或 空气方块
                    if (block_Obj == null || block_Obj.type === "minecraft:air") {
                        to_Pos = new IntPos(InitialTargetCoordinates.x, Pos_Y, InitialTargetCoordinates.z, InitialTargetCoordinates.dimid);
                        block_Obj = mc.getBlock(to_Pos);
                    } else if (
                        Pos_Y <= forPosInfo.failureEnd ||
                        ["minecraft:lava", "minecraft:flowing_lava"].indexOf(block_Obj.type) !== -1
                    ) {
                        throw Error(`Search for safe coordinates failed`); // 到达结束位置或落脚点是岩浆方块
                    } else if (player.pos.dimid !== 1) {
                        Transmission(Pos_Y);
                        return;
                    } else if (
                        // 地狱特判
                        player.pos.dimid == 1 &&
                        mc.getBlock(new IntPos(to_Pos.x, Pos_Y + 2, to_Pos.z, to_Pos.dimid)).type === "minecraft:air" &&
                        mc.getBlock(new IntPos(to_Pos.x, Pos_Y + 3, to_Pos.z, to_Pos.dimid)).type === "minecraft:air"
                    ) {
                        Transmission(Pos_Y);
                        return;
                    } else {
                        to_Pos = new IntPos(InitialTargetCoordinates.x, Pos_Y, InitialTargetCoordinates.z, InitialTargetCoordinates.dimid);
                        block_Obj = mc.getBlock(to_Pos);
                    }
                }
                throw Error(`No safety coordinates found in dimension [${player.pos.dim}]`);
            } catch (e) {
                _fail(player, e);
            }
        }

        // 传送函数
        function Transmission(YY: number) {
            player.teleport(
                new FloatPos(InitialTargetCoordinates.x + 0.5, YY + 2, InitialTargetCoordinates.z + 0.5, InitialTargetCoordinates.dimid),
            );
            sendMessage(player, "传送完成！");
            logger.debug(`Y轴: ${YY}  方块对象: ${block_Obj.pos}  坐标对象: ${InitialTargetCoordinates}  玩家坐标: ${player.blockPos}`);
        }
    } catch (e) {
        _fail(player, e);
    }

    /**
     * @param {Player} player
     * @param {error} e
     */
    function _fail(player: Player, e: Error) {
        // 清除周期执行任务
        if (Interval_ID) {
            clearInterval(Interval_ID);
        }
        // 由于玩家退出，但玩家对象依然存在，故判断坐标是否不存在
        if (player.pos != null) {
            formatAndPrintingError(e);
            player.teleport(BackUpPos);
            sendMessage(player, "§c插件遇到未知错误, 传送失败！");
            money_Instance.addPlayerMoney(player, config.Tpr.Money);
        } else {
            logger.warn("Players quit the game and TPR failed.");
        }
    }
}
