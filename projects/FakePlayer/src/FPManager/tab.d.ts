import dummyExample from "./example.js"

/**假人实例管理 */
declare class FPManager {
    /**初始化所有数据到全局缓存*/
    static init(): Boolean;

    /**创建模拟实例*/
    static createSimulateionPlayer(fp: T_FP_JSON): Boolean

    /**销毁模拟实例*/
    static DestroyInstance(name: String): Boolean

    /**上线指定假人*/
    static online(name: String): Boolean

    /**下线指定假人*/
    static offOnline(name: String): Boolean

    /**上线所有模拟玩家*/
    static onlineAll(check: Boolean): Boolean

    /**下线所有模拟玩家*/
    static offOnlineAll(): Boolean

    /**设置模拟朝向*/
    static setLookPos(name: String, pos: IntPos): Boolean

    /**设置模拟操作类型并开始模拟操作*/
    static operation(name: string, oper: "attack" | "destroy" | "item", time: Number): Boolean

    /**停止指定假人模拟操作*/
    static offoperation(name: String): Boolean

    /**停止所有模拟操作*/
    static offoperationall(): Boolean

    /**传送模拟玩家到坐标*/
    static tp(name: String, pos: IntPos): Boolean

    /**以假人身份说话 */
    static talkAs(name: String, msg: String): Boolean

    /**执行目录 */
    static runCmd(name: String, cmd: String): Boolean

    /**获取所有假人信息*/
    static getAllInfo(): Array<T_FP_Object>

    /**获取指定假人信息*/
    static getInfo(name: String): T_FP_Object | false

    /**获取在线假人列表*/
    static getOnlineDummies(): Array<T_FP_Object>
}

interface Pos {
    x: Number,
    y: Number,
    z: Number,
    dimid: Number
}

interface T_FP_INFO {
    /**模拟玩家名称(constructor) */
    Name: String
    /**上线坐标(initData) */
    OnlinePos: Pos
    /**所属玩家(initData) */
    BindPlayer: String
    /**是否无敌(initData) */
    isInvincible: Boolean
    /**是否自动复活(initData) */
    isAutoResurrection: Boolean
    /**是否自动上线(initData) */
    isAutoOnline: Boolean
    /**假人背包(updateBagToCache) */
    Bag: String

    /**是否在线(checkOnline) */
    _isOnline: Boolean
    /**等待执行任务ID(startLoop) */
    _TimeID: Number | null
    /**循环周期(startLoop) */
    _CycleTime: Number
    /**模拟操作类型(setLoop) */
    _OperationType: String
}

interface FP_Array_Object extends Array<dummyExample> { }
interface FP_Object extends Object<T_FP_INFO> { }

class instanceCache {
    constructor() { }
    /**实例 */
    // example: dummyExample // instanceCache.exampe.能显示补全
    // example: Object<String, dummyExample>// instanceCache.example["123"].不显示
    example: { [key: String]: typeof dummyExample }

    /** 实例数量 */
    size(): Number

    /** 检查是否有某个key */
    has(key: String): Boolean

    /** 获取key对应的实例 */
    get(key: String): dummyExample | null

    /** 删除key对应的实例 */
    delete(key: String): Boolean

    /**
     * 写入实力到缓存
     * @param key 假人名称
     * @param value 假人实例
     * @returns 写入成功返回假人实例，否则null
     */
    set(key: String, value: dummyExample): dummyExample | null
}

interface FP_cache extends instanceCache { }