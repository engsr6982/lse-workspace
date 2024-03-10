import CsvLogger from "../../../LSE-Modules/src/CsvLogger.js";
import { FPManager } from "../FPManager/Manager.js";
import { Config } from "../utils/config.js";

export const cLogger = new CsvLogger(
    Config.CsvLogger.Output,
    Config.CsvLogger.FileName,
    [
        "时间",
        "主体",
        "维度",
        "x",
        "y",
        "z",
        "事件",
        "目标",
        "维度",
        "x",
        "y",
        "z",
        "绑定玩家",
        "是否在线",
        "假人无敌",
        "自动复活",
        "自动上线",
        "模拟操作",
        "任务周期",
    ].join(),
);

/**
 * 抽象生成CSV日志为函数
 * @param {Player} player 玩家对象
 * @param {String} action 事件
 * @param {String} targetDummy 目标
 */
export async function generateCSVLog(player: Player, action: string, targetDummy: string) {
    const fp = FPManager.getInfo(targetDummy) || {
        Name: null,
        OnlinePos: { dim: null, x: null, y: null, z: null },
        BindPlayer: null,
        isInvincible: false,
        isAutoResurrection: false,
        isAutoOnline: false,
        _isOnline: false,
        _CycleTime: null,
        _OperationType: null,
    };
    const parseDim = (dimid) => {
        return { 0: "主世界", 1: "地狱", 2: "末地" }[dimid];
    };
    return cLogger.write(
        `${system.getTimeStr()},${player ? player.realName : "console"},${player ? player.pos.dim : null},${player ? player.pos.x : null},${player ? player.y : null},${player ? player.z : null},${action},${targetDummy},${parseDim(fp.OnlinePos.dimid)},${fp.OnlinePos.x},${fp.OnlinePos.y},${fp.OnlinePos.z},${fp.BindPlayer},${fp._isOnline},${fp.isInvincible},${fp.isAutoResurrection},${fp.isAutoOnline},${fp._OperationType},${fp._CycleTime}`
            .replace(/null/gm, "")
            .replace(/undefined/gm, ""),
    );
}
