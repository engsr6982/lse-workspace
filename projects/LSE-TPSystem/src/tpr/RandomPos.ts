import { config } from "../utils/data.js";

const ZoneCheck_API: {
    Circle?: (x: number, z: number, radius: number) => { x: number; z: number };
    Square?: (centerX: number, centerZ: number, halfLength: number) => { x: number; z: number };
} = {};

/**
 * 生成随机坐标
 */
export function tprRandomPos() {
    const { randomRange, restrictedArea } = config.Tpr; // 获取配置项Config

    const _random = () => {
        const { max, min } = randomRange;
        const num = Math.floor(Math.random() * (max - min + 1)) + min;
        return Math.random() < 0.5 ? -num : num;
    };

    // 根据配置进行生成对应随机坐标对象
    if (restrictedArea.Enable && ll.hasExported("ZoneCheckV3", "RandomAreaPosition::getRandomCoordinateInCircle")) {
        if (Object.keys(ZoneCheck_API).length == 0) {
            ZoneCheck_API["Circle"] = ll.imports("ZoneCheckV3", "RandomAreaPosition::getRandomCoordinateInCircle");
            ZoneCheck_API["Square"] = ll.imports("ZoneCheckV3", "RandomAreaPosition::getRandomCoordinateInSquare");
        }

        switch (restrictedArea.Type) {
            case "Circle":
                return ZoneCheck_API["Circle"](restrictedArea.Pos.x, restrictedArea.Pos.z, restrictedArea.Pos.radius);
            case "Square":
                return ZoneCheck_API["Square"](restrictedArea.Pos.x, restrictedArea.Pos.z, restrictedArea.Pos.radius);
        }
    }
    return { x: _random(), z: _random() }; // default
}
