import { time } from "../../../LSE-Modules/src/Time.js";
import { permCoreInstance } from "../include/permission.js";
import { config } from "../utils/data.js";
import { leveldb } from "../utils/leveldb.js";
import { convertVec3ToPos } from "../utils/util.js";
import { money_Instance } from "../include/money.js";
import { warpMap } from "./Mapping.js";

class WarpCore {
    constructor() {}

    _addWarp(name: string, vec3: Vec3) {
        if (warpMap.hasWarp(name)) return false;
        const warp = leveldb.getWarp();
        warp.push({ ...vec3, name: name, createdTime: time.formatDateToString(new Date()), modifiedTime: "" });
        return leveldb.setWarp(warp);
    }

    _deleteWarp(name: string) {
        if (!warpMap.hasWarp(name)) return false;
        const w = leveldb.getWarp();
        w.splice(warpMap.map[name], 1);
        return leveldb.setWarp(w);
    }

    _editWarp(name: string, newData: Vec3 & { name: string }): boolean {
        if (!warpMap.hasWarp(name)) return false;
        const w = leveldb.getWarp();

        // 重命名name (只重命名了数据中的name，映射未改变，下文依然使用原name访问数组)
        if (newData.name !== null) {
            if (!warpMap.hasWarp(newData.name)) return false; // 防止key重复
            w[warpMap.map[name]].name = newData.name;
        }

        newData.x !== null ? (w[warpMap.map[name]].x = newData.x) : undefined;
        newData.y !== null ? (w[warpMap.map[name]].y = newData.y) : undefined;
        newData.z !== null ? (w[warpMap.map[name]].z = newData.z) : undefined;
        newData.dimid !== null ? (w[warpMap.map[name]].dimid = newData.dimid) : undefined;

        w[warpMap.map[name]].modifiedTime = time.formatDateToString(new Date());

        return leveldb.setWarp(w);
    }

    goWarp(player: Player, name: string) {
        if (!warpMap.hasWarp(name)) return false; // no warp
        if (!money_Instance.deductPlayerMoney(player, config.Warp.GoWarpMoney)) return false; // no money
        const w = leveldb.getWarp();
        return player.teleport(convertVec3ToPos(w[warpMap.map[name]]));
    }

    getWarpListString(): string {
        const w = leveldb.getWarp();
        return Object.keys(w).join(" | ");
    }
}

// 注册权限
permCoreInstance.registerPermission("允许玩家添加Warp", "addWarp");
permCoreInstance.registerPermission("允许玩家删除Warp", "delWarp");

export const warpCore_Instance = new WarpCore();
