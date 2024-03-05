import { leveldb } from "../utils/leveldb.js";
import { convertPosToVec3, convertVec3ToPos, sendMessage } from "../utils/util.js";
import { money_Instance } from "../include/money.js";
import { time } from "../../../LSE-Modules/src/Time.js";
import { config } from "../utils/data.js";
import { homeMap } from "./Mapping.js";

class HomeCore {
    constructor() {}

    // 以下方法仅限管理Gui调用

    _addHome(realName: string, name: string, vec3: Vec3): boolean {
        logger.debug(vec3);
        const home = leveldb.getHome();

        if (!homeMap.hasPlayer(realName)) {
            home[realName] = []; // 初始化数据
        }

        if (homeMap.hasHome(realName, name)) return false; // 防止家名称重复（防重复创建
        home[realName].push({
            ...vec3,
            name: name,
            createdTime: time.formatDateToString(new Date()),
            modifiedTime: "",
        });
        return leveldb.setHome(home);
    }

    _deleteHome(realName: string, name: string): boolean {
        if (!homeMap.hasPlayer(realName)) return false;
        const home = leveldb.getHome();
        home[realName].splice(homeMap.map[realName][name], 1);
        return leveldb.setHome(home);
    }

    _editHome(realName: string, homeOldName: string, newData: Vec3 & { name: string }): boolean {
        if (!homeMap.hasPlayer(realName) || !homeMap.hasHome(realName, homeOldName)) return false;
        const allHome = leveldb.getHome();

        // 重命名name (只重命名了数据中的name，映射未改变，下文依然使用原homeOldName访问数组)
        if (newData.name !== null && newData.name !== homeOldName) {
            if (homeMap.hasHome(realName, newData.name)) return false; // 防止key重复
            allHome[realName][homeMap.map[realName][homeOldName]].name = newData.name;
        }

        newData.x !== null ? (allHome[realName][homeMap.map[realName][homeOldName]].x = newData.x) : undefined;
        newData.y !== null ? (allHome[realName][homeMap.map[realName][homeOldName]].y = newData.y) : undefined;
        newData.z !== null ? (allHome[realName][homeMap.map[realName][homeOldName]].z = newData.z) : undefined;
        newData.dimid !== null ? (allHome[realName][homeMap.map[realName][homeOldName]].dimid = newData.dimid) : undefined;

        allHome[realName][homeMap.map[realName][homeOldName]].modifiedTime = time.formatDateToString(new Date());
        return leveldb.setHome(allHome);
    }

    // 以下方法供玩家调用

    creatHome(player: Player, name: string): boolean {
        if (!money_Instance.deductPlayerMoney(player, config.Home.CreatHomeMoney)) return false; // 检查经济
        const { realName } = player;
        if (Object.keys(leveldb.getHome()[realName] || {}).length >= config.Home.MaxHome) {
            return sendMessage(player, `创建家园传送点[${name}失败！\n最大家园数量：${config.Home.MaxHome}]`);
        }
        return this._addHome(realName, name, convertPosToVec3(player.blockPos));
    }

    goHome(player: Player, name: string): boolean {
        if (!money_Instance.deductPlayerMoney(player, config.Home.GoHomeMoney)) return false;
        if (!homeMap.hasHome(player.realName, name)) return false;
        const h = leveldb.getHome();
        return player.teleport(convertVec3ToPos(h[player.realName][homeMap.map[player.realName][name]]));
    }

    updateName(player: Player, name: string, newName: string) {
        if (!money_Instance.deductPlayerMoney(player, config.Home.EditNameMoney)) return false;
        return this._editHome(player.realName, name, {
            name: newName,
            x: null,
            y: null,
            z: null,
            dimid: null,
        });
    }

    updatePos(player: Player, name: string) {
        if (!money_Instance.deductPlayerMoney(player, config.Home.EditPosMoney)) return false;
        return this._editHome(player.realName, name, {
            ...convertPosToVec3(player.blockPos),
            name: null,
        });
    }

    deleteHome(player: Player, name: string) {
        if (!money_Instance.deductPlayerMoney(player, config.Home.DeleteHomeMoney)) return false;
        return this._deleteHome(player.realName, name);
    }

    getHomeListString(realName: string): string {
        if (!homeMap.hasPlayer(realName)) return null;
        const h = leveldb.getHome();
        return Object.keys(h[realName]).join(" | ");
    }
}

export const homeCore_Instance = new HomeCore();
