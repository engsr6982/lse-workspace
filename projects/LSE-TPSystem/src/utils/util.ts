import { config } from "./data.js";
import { tellTitle } from "./GlobalVars.js";

export const formatAndPrintingError = (err: Error) => {
    logger.error(`The plugin captures an error: \n${err}\n${err.stack}`);
    logger.warn(`If you encounter a persistent throwing error, please reload this plugin`);
};

export const hasOwnProperty_ = (obj: object, key: string): boolean => {
    return Object.prototype.hasOwnProperty.call(obj, key);
};

export const sendCloseFormTip = (player: Player) => {
    return sendMessage(player, "表单已放弃");
};

export const sendMessage = (player: Player, msg: string): boolean => {
    return player.tell(tellTitle + msg);
};

// export const formatPosToString = (pos: IntPos | FloatPos) => {
//     const { x, y, z, dim } = pos;
//     return `${dim} | X:${x} | Y:${y} | Z:${z}`;
// };

export const formatVec3ToString = (vec3: Vec3) => {
    const dim = {
        0: "主世界",
        1: "地狱",
        2: "末地",
    };
    const { x, y, z, dimid } = vec3;
    return `${dim[dimid]} | X:${x} | Y:${y} | Z:${z}`;
};

export const isFloat = (n: number): boolean => {
    return n % 1 !== 0;
};

export const convertPosToVec3 = (pos: IntPos | FloatPos): Vec3 => {
    const { x, y, z, dimid } = pos;
    return {
        x: x,
        y: y,
        z: z,
        dimid: dimid,
    };
};

export const convertVec3ToPos = (vec3: Vec3) => {
    const { x, y, z, dimid } = vec3;
    if (isFloat(x) || isFloat(y) || isFloat(z)) {
        return new FloatPos(x, y, z, dimid);
    }
    return new IntPos(x, y, z, dimid);
};

export const getRegCommand = () => {
    return config.Command.Command;
};

export const parseAxis = (axisStr: string): Axis => {
    const axisArray: Array<string> = axisStr.split(",");
    return {
        x: Number(axisArray[0]),
        y: Number(axisArray[1]),
        z: Number(axisArray[2]),
    };
};

export const stringifyAxis = (axisObj: Axis): string => {
    const { x, y, z } = axisObj;
    return `${x},${y},${z}`;
};

/**
 * 随机字符串
 *
 * 此函数返回值可能受环境影响
 * @param len
 * @returns
 */
export const randomString = (len: number): string => {
    if (len <= 11) {
        return Math.random()
            .toString(36)
            .substring(2, 2 + len)
            .padEnd(len, "0");
    } else {
        return randomString(11) + randomString(len - 11);
    }
};
