import { config } from "../utils/data.js";
import { hasOwnProperty_ } from "../utils/util.js";

const ZoneCheck_API: {
    Circle?: (x: number, z: number, radius: number) => { x: number; z: number };
    Square?: (centerX: number, centerZ: number, halfLength: number) => { x: number; z: number };
} = {};

/**
 * 生成随机坐标
 */
export function tprRandomPos(player?: Player) {
    const { randomRange, restrictedArea } = config.Tpr; // 获取配置项Config

    const _random = () => {
        const { max, min } = randomRange;
        const num = Math.floor(Math.random() * (max - min + 1)) + min;
        return Math.random() < 0.5 ? -num : num;
    };

    // ZoneCheckV3
    if (restrictedArea.Enable && ll.hasExported("ZoneCheckV3", "RandomAreaPosition::getRandomCoordinateInCircle")) {
        if (Object.keys(ZoneCheck_API).length == 0) {
            ZoneCheck_API["Circle"] = ll.imports("ZoneCheckV3", "RandomAreaPosition::getRandomCoordinateInCircle");
            ZoneCheck_API["Square"] = ll.imports("ZoneCheckV3", "RandomAreaPosition::getRandomCoordinateInSquare");
        }

        if (hasOwnProperty_(ZoneCheck_API, restrictedArea.Type)) {
            if (restrictedArea.Pos.usePlayerPosCenter) {
                return ZoneCheck_API[restrictedArea.Type](player.blockPos.x, player.blockPos.z, restrictedArea.Pos.radius);
            } else {
                return ZoneCheck_API[restrictedArea.Type](restrictedArea.Pos.x, restrictedArea.Pos.z, restrictedArea.Pos.radius);
            }
        } else {
            logger.error("未找到对应类型:", restrictedArea.Type, "请检查配置文件");
        }
    }

    return { x: _random(), z: _random() }; // default
}
