import dummyExample from "./example.js";
import { deleteDataByBindPlayerAndName, getAllData, insertFP } from "../DB/SQL/SQL.js";
import { instanceCache } from "./instanceCache.js";
import { kvdb } from "../DB/LevelDB/kvdb.js";
import { Time_Mod } from "../modules/Time.js";
import { Config } from "../utils/cache.js";

export class FPManager {
    //==========================//
    //          私有方法        //
    //==========================//

    /**
     * 名称是否合法 (允许1-16字节，允许中文字母数字下划线)
     * @param {String} name
     * @returns 是否合法
     */
    static _isTheNameLegal(name) {
        // 请勿修改，修改后导致的一系列问题请自行解决
        return RegExp(/^[a-zA-Z0-9_\u4e00-\u9fa5]{1,16}$/).test(name);
    }

    //==========================//
    //          实例操作        //
    //==========================//

    /**
     * 初始化所有数据到全局缓存
     * @returns bool 是否初始化成功
     */
    static init() {
        try {
            const data = getAllData();
            if (data) {
                data.forEach((fp) => {
                    if (instanceCache.has(fp.Name)) return;
                    if (!this._isTheNameLegal(fp.Name)) return;
                    const inst = instanceCache.set(fp.Name, new dummyExample(fp.Name));
                    inst.initData(fp);
                    inst.checkOnline(); // 更新在线状态
                });
            }
            return true;
        } catch (e) {
            logger.error(`${e}\n${e.stack}`);
            return false;
        }
    }

    /**
     * 创建模拟实例
     * @param {Object} fp 模拟玩家配置json对象
     * @returns Boolean
     */
    static createSimulateionPlayer(fp) {
        if (!this._isTheNameLegal(fp.Name)) return false;
        if (instanceCache.has(fp.Name)) return false;
        instanceCache.set(fp.Name, new dummyExample(fp.Name)).initData(fp);
        insertFP(fp); // 写入sql
        return true;
    }

    /**
     * 销毁模拟实例
     * @param {String} name
     */
    static DestroyInstance(name) {
        if (!instanceCache.has(name)) return false;
        const instance = instanceCache.get(name); // 获取实例
        instance.stopLoop(); // 停止循环操作
        instance.offOnline(); // 下线
        const { BindPlayer, Name, Bag } = instance; // 备份fp对象
        instanceCache.delete(Name); // 从缓存中清除
        return kvdb.delete(Bag) && deleteDataByBindPlayerAndName(BindPlayer, name); // 从sql删除数据
    }

    //==========================//
    //           上下线         //
    //==========================//

    /**
     * 上线指定假人
     * @param {string} name
     * @returns bool 是否上线成功
     */
    static online(name) {
        if (!instanceCache.has(name)) return false;
        return instanceCache.get(name).online();
    }

    /**
     * 下线指定假人
     * @param {string} name
     * @returns bool 是否下线成功
     */
    static offOnline(name) {
        if (!instanceCache.has(name)) return false;
        const i = instanceCache.get(name);
        insertFP(i);
        return i.offOnline();
    }

    /**
     * 上线所有模拟玩家
     * @param {boolean} check 是否检查自动上线属性(isAutoOnline)
     * @returns boolean 是否上线成功
     */
    static onlineAll(check = false) {
        for (let exam in instanceCache.example) {
            const inst = instanceCache.example[exam];
            switch (check) {
                case true:
                    if (inst.isAutoOnline) {
                        if (inst.checkOnline()) return false; // 已在线
                        inst.online();
                    }
                    break;
                case false:
                    if (inst.checkOnline()) return false; // 已在线
                    inst.online();
                    break;
            }
        }
        return true;
    }

    /**
     * 下线所有模拟玩家
     * @returns boolean 是否下线成功
     */
    static offOnlineAll() {
        for (let exam in instanceCache.example) {
            const inst = instanceCache.example[exam];
            if (!inst.checkOnline()) return;
            inst.offOnline();
        }
        return true;
    }

    //==========================//
    //          模拟操作        //
    //==========================//

    /**
     * 设置模拟朝向
     * @param {string} name
     * @param {IntPos} pos
     * @returns boolean
     */
    static setLookPos(name, pos) {
        if (!instanceCache.has(name)) return false;
        if ((!pos) instanceof IntPos) return false;
        return instanceCache.get(name).setOrientation(pos);
    }

    /**
     * 设置模拟操作类型并开始模拟操作
     * @param {string} name 假人名称
     * @param {string} oper 操作类别  attack / destroy / item
     * @param {Number} time 间隔时间
     * @param {Number} slot 槽位 (item可用)
     * @returns Boolean
     */
    static operation(name, oper, time, slot = undefined) {
        if (!instanceCache.has(name)) return false;
        const inst = instanceCache.get(name);
        const status = inst.setLoop(oper, slot);
        inst.set_CycleTime(time);
        if (status) {
            return inst.startLoop();
        } else {
            return false;
        }
    }

    /**
     * 停止指定假人模拟操作
     * @param {string} name
     * @returns bool 是否停止成功
     */
    static offoperation(name) {
        if (!instanceCache.has(name)) return false;
        const inst = instanceCache.get(name);
        return inst.stopLoop();
    }

    /**
     * 停止所有模拟操作
     * @returns bool 是否停止成功
     */
    static offoperationall() {
        for (let exam in instanceCache.example) {
            const inst = instanceCache.example[exam];
            inst._OperationType = "";
            inst.stopLoop();
        }
        return true;
    }

    /**
     * 传送模拟玩家到坐标
     * @param {String} name
     * @param {IntPos} pos
     * @returns boolean 是否传送成功
     */
    static tp(name, pos) {
        if ((!pos) instanceof IntPos) return null;
        if (!instanceCache.has(name)) return false;
        // 避免传送到方块边缘，IntPos转FloatPos
        const newPos = new FloatPos(pos.x + 0.5, pos.y, pos.z + 0.5, pos.dimid);
        const fpinst = instanceCache.get(name);
        const status = fpinst.delivery(newPos);
        if (status) {
            insertFP(fpinst);
            return true;
        } else return false;
    }

    static talkAs(name, msg) {
        if (!instanceCache.get(name)) return false;
        return instanceCache.get(name).sendTalkAs(msg);
    }

    static runCmd(name, cmd) {
        if (!instanceCache.has(name)) return false;
        return instanceCache.get(name).runCmd(cmd);
    }

    static setFunc(name, key, value) {
        if (!instanceCache.has(name)) return false;
        const fp_inst = instanceCache.get(name);
        const fp = fp_inst; // 获取fp对象
        fp[key] = value; // 更新对应数据
        fp_inst.initData(fp); // 更新实例
        return insertFP(fp_inst); // 更新sql
    }

    //==========================//
    //          信息获取        //
    //==========================//

    /**
     * 获取所有假人信息
     * @returns {FP_Array_Object}
     */
    static getAllInfo() {
        return Object.keys(instanceCache.example).map((exam) => {
            return instanceCache.example[exam];
        });
    }

    /**
     * 获取指定假人信息
     * @param {string} name
     * @returns {T_FP_INFO}
     */
    static getInfo(name) {
        return instanceCache.has(name) ? instanceCache.get(name) : null;
    }

    /**
     * 获取在线假人列表
     * @returns {import("./tab.js").FP_Array_Object} 在线假人列表[Object, Object, ...]
     */
    static getOnlineDummies() {
        return this.getAllInfo().filter((dummy) => dummy._isOnline);
    }
}

Config.MaxOnline.Enable
    ? setInterval(async () => {
          Config.MaxOnline.Enable
              ? FPManager.getOnlineDummies().forEach(async (i) => {
                    if (Time_Mod.CheckTime(i.onlineTime)) {
                        i.offOnline()
                            ? logger.info(`假人[${i.Name}]已到达最大在线时长，已下线`)
                            : logger.warn(`假人[${i.Name}]已到达最大在线时长，下线失败!`);
                    }
                })
              : null;
      }, 60000)
    : null;
