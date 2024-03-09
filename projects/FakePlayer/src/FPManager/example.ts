import { time as Times } from "../../../LSE-Modules/src/Time.js";
import { kvdb } from "../DB/LevelDB/kvdb.js";
import { Config } from "../utils/cache.js";
import { parsePos, posToObject, stringifyExample } from "../utils/conversion.js";
import { onDummyLookPos, onDummySimulationOperation } from "../utils/ListenerEvent.js";

/**模拟实例 */
export default class dummyExample {
    /**
     * @param {String} name 模拟玩家名称
     * @returns {dummyExample} 模拟实例 实例化后请调用initData初始化数据
     */
    constructor(name: string) {
        const test = mc.getPlayer(name);
        if (test != null) {
            // throw new Error("Instantiation failed, name is already taken");
        }
        /**模拟玩家名称(constructor) */
        this.Name = name;
    }

    Name: string;
    /**上线坐标(initData) */
    OnlinePos: IntPos | FloatPos = null;
    /**所属玩家(initData) */
    BindPlayer: string = null;
    /**是否无敌(initData) */
    isInvincible = false;
    /**是否自动复活(initData) */
    isAutoResurrection = false;
    /**是否自动上线(initData) */
    isAutoOnline = false;

    /**是否在线(checkOnline) */
    _isOnline = false;
    /**等待执行任务ID(startLoop) */
    _TimeID: number = null;
    /**循环周期(startLoop) */
    _CycleTime = 1000; // 默认1秒
    /**模拟操作类型(setLoop) */
    _OperationType = "";

    /**
     * 初始化数据
     * @param {T_FP_INFO} fp 保存的玩家数据
     */
    initData(fp) {
        this.isAutoOnline = fp.isAutoOnline; // 确保在方块正中心
        this.OnlinePos = parsePos(fp.OnlinePos);
        this.BindPlayer = fp.BindPlayer;
        this.isAutoResurrection = fp.isAutoResurrection;
        this.isInvincible = fp.isInvincible;
        this.Bag = fp.Bag;
    }

    getPlayer() {
        const player = mc.getPlayer(this.Name);
        if (player == null || !player.isSimulatedPlayer()) {
            return null;
        }
        return player;
    }

    /**
     * 检查是否在线
     * @returns Boolean
     */
    checkOnline() {
        const p = this.getPlayer();
        if (p == null) {
            this._isOnline = false;
            return false;
        } else {
            this._isOnline = true;
            return true;
        }
    }

    /**假人背包(updateBagToCache) */
    Bag = null;
    updateBagToKVDB() {
        if (!this.checkOnline() || !this.Bag) return false;
        const pl = this.getPlayer();
        if (pl) {
            const player_nbt = pl.getNbt();
            return kvdb.set(this.Bag, player_nbt.toSNBT());
        }
        return false;
    }

    writeBagToPlayer() {
        this.checkOnline();
        const pl = this.getPlayer();
        if (pl) {
            const nbt = pl.getNbt();
            const kvdb_snbt = kvdb.get(this.Bag); // 从数据库中取出snbt
            if (!kvdb_snbt) return false; // 检查是否有数据
            // eslint-disable-next-line no-undef
            const sql_bag_nbt = NBT.parseSNBT(kvdb_snbt); // 转换为nbt
            if (sql_bag_nbt == null) return false; // 检查转换是否成功
            // 提取对应nbt type
            const obj = {
                Mainhand: sql_bag_nbt.getTag("Mainhand"),
                Offhand: sql_bag_nbt.getTag("Offhand"),
                Armor: sql_bag_nbt.getTag("Armor"),
                Inventory: sql_bag_nbt.getTag("Inventory"),
            };
            // 写入前检查
            Object.keys(obj).forEach((key) => {
                if (obj[key]) {
                    if (nbt.setTag(key.toString(), obj[key])) {
                        logger.info(`set ${key}`);
                    } else {
                        logger.error(`set ${key} error`);
                    }
                } else {
                    logger.warn(key);
                }
            });
            pl.setNbt(nbt);
            pl.refreshItems();
            return true;
        }
        return false;
    }

    /**
     * 上线模拟玩家
     * @returns Boolean
     */
    online() {
        if (this.checkOnline()) return false;
        mc.spawnSimulatedPlayer(this.Name, this.OnlinePos);
        if (this.checkOnline()) {
            // 写入背包
            this.writeBagToPlayer() ? logger.info(`succ`) : logger.error(`err`);
            this.onlineTime = Config.MaxOnline.Enable ? Times.getEndTimes(Number(Config.MaxOnline.Time), "minute") : null;
            return true;
        }
        return false;
    }

    /**
     * 下线模拟玩家
     * @returns Boolean
     */
    offOnline() {
        if (!this.checkOnline()) return false;
        const pl = this.getPlayer();
        if (pl) {
            // 保存背包
            this.updateBagToKVDB() ? logger.info(`保存[${this.Name}]背包成功`) : logger.error(`写入[${this.Name}]背包失败`);
            pl.simulateDisconnect();
            this.onlineTime = null;
            return this.checkOnline() == false ? true : false;
        }
    }

    /**
     * 传送模拟玩家
     * @param {IntPos} pos 坐标
     * @returns Boolean
     */
    delivery(pos) {
        if (!this.checkOnline()) return false;
        const pl = this.getPlayer();
        if (pl != null) {
            if (pl.teleport(pos)) {
                this.OnlinePos = pos; // 更新上线坐标
                return true;
            } else return false;
        }
    }

    /**
     * 模拟朝向
     * @param {IntPos} pos 看向目标IntPos
     * @returns Boolean
     */
    setOrientation(pos) {
        if (!this.checkOnline()) return false;
        const p = this.getPlayer();
        if (onDummyLookPos.exec(stringifyExample(this), posToObject(pos))) {
            return p.simulateLookAt(pos);
        }
        return false;
    }

    /**
     * 设置操作类型
     * @param {String} oper 操作类型  attack / destroy / item
     */
    setLoop(oper, slot = 0) {
        if (["attack", "destroy", "item"].indexOf(oper) === -1) return false;
        this._OperationType = oper;
        this.slot = slot;
        return true;
    }

    /**
     * 设置周期
     * @param {Number} time 周期时间(毫秒) 默认1000
     * @returns
     */
    set_CycleTime(time = 1000) {
        if (typeof time !== "number") return false;
        this._CycleTime = time;
        return true;
    }

    /**
     * 开始循环操作
     */
    startLoop() {
        try {
            if (this._OperationType == "") return false;
            if (!this.checkOnline()) return false;
            const p = this.getPlayer();
            // 触发事件
            if (onDummySimulationOperation.exec(stringifyExample(this))) {
                switch (this._OperationType) {
                    case "attack":
                        p.simulateAttack();
                        break;
                    case "destroy":
                        p.simulateDestroy();
                        break;
                    case "item":
                        p.simulateUseItem(this.slot);
                        break;
                    default:
                        return false;
                }
            } /* else logger.debug("事件已被拦截"); */
            if (this._CycleTime <= 0) {
                this.set_CycleTime();
            }
            this._TimeID = setTimeout(() => {
                this._Loop();
            }, this._CycleTime);
            return true;
        } catch (err) {
            logger.error(err, "\n", err.simulateAttack);
            return false;
        }
    }

    /**
     * 私有方法 请访问startLoop方法
     * @returns Boolean
     */
    private _Loop = () => {
        if (this._OperationType == "") return false;
        if (!this.checkOnline()) return false;
        const p = this.getPlayer();
        if (this._OperationType == "item") {
            p.simulateStopUsingItem();
        }
        return this.startLoop();
    };

    /**
     * 停止循环操作
     * @returns {Boolean}
     */
    stopLoop() {
        // return this._TimeID != null ? clearInterval(this._TimeID) : null;
        if (this._TimeID != null) {
            if (clearInterval(this._TimeID)) {
                this._TimeID = null;
                this._OperationType = null;
                return true;
            }
        }
        return false;
    }

    /**
     * 假人说话
     * @param {String} msg 消息内容
     * @returns Boolean
     */
    sendTalkAs(msg: string) {
        if (!this.checkOnline()) return false;
        const p = this.getPlayer();
        return p.talkAs(msg);
    }

    /**
     * 假人执行命令
     * @param {String} cmd 命令内容
     * @returns Boolean
     */
    runCmd(cmd: string) {
        if (!this.checkOnline()) return false;
        const p = this.getPlayer();
        return p.runcmd(cmd);
    }
}
