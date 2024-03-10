import { onDummyLookPos, onDummyOffline, onDummyOnline, onDummySimulationOperation, onDummyTryRespawn } from "../utils/ListenerEvent.js";
import { stringifyExample } from "../utils/conversion.js";

interface initDataType {
    isAutoRespawn: boolean; // 自动重生
    isAutoOnline: boolean; //自动上线
    isInvincible: boolean; //是否无敌
    onlinePos: IntPos | FloatPos; //上线坐标
    bindPlayer: string; //绑定玩家
    bagGUIDKey: string;
}

const _LoopTypeList = ["attack", "destroy", "item"] as const;
type LoopTypes = (typeof _LoopTypeList)[number];

export class dummyExample {
    constructor(name: string) {
        if (mc.getPlayer(name)) {
            throw new Error("Instantiation failed, name is already taken");
        }
        this.name = name;
    }

    name: string; // 玩家名
    uuid: string; // 假人UUID

    onlinePos: IntPos | FloatPos; //上线坐标
    bindPlayer: string; //绑定玩家

    isInvincible: boolean; //是否无敌
    isAutoRespawn: boolean; // 自动重生
    isAutoOnline: boolean; //自动上线

    isOnline: boolean; // 当前是否在线
    bagGUIDKey: string; // 背包ID（数据库Key）

    /// func

    getData() {
        return JSON.stringify(this);
    }

    initData(data: initDataType) {
        const { isAutoOnline, isAutoRespawn, isInvincible, bagGUIDKey, bindPlayer, onlinePos } = data;
        this.isAutoOnline = isAutoOnline;
        this.bagGUIDKey = bagGUIDKey;
        this.bindPlayer = bindPlayer;
        this.onlinePos = onlinePos;
        this.isAutoRespawn = isAutoRespawn;
        this.isInvincible = isInvincible;
        return true;
    }

    get() {
        const pl = mc.getPlayer(this.name) as SimulatedPlayer;
        return pl && pl.isSimulatedPlayer() ? pl : null;
    }

    checkOnline() {
        const p1 = this.get();
        this.isOnline = p1 == null ? false : true;
        return this.isOnline;
    }

    online() {
        if (this.checkOnline()) return false;
        if (onDummyOnline.exec(stringifyExample(this))) {
            const p = mc.spawnSimulatedPlayer(this.name, this.onlinePos);
            this.uuid = p.uuid;
            return true;
        }
        return false;
    }

    offline() {
        if (!this.checkOnline()) return false;
        const p = this.get();
        if (onDummyOffline.exec(stringifyExample(this))) {
            return p.simulateDisconnect();
        }
        return false;
    }

    tryRespawn() {
        if (onDummyTryRespawn.exec(stringifyExample(this))) {
            return this.get().simulateRespawn();
        }
        return false;
    }

    teleport(targetPos: IntPos) {
        if (!this.checkOnline()) return false;
        const s = this.get().teleport(targetPos);
        if (s) {
            this.onlinePos = targetPos;
        }
        return s;
    }

    setDummyLookAt(target: IntPos | FloatPos | Block | Entity) {
        if (!this.checkOnline()) return false;
        if (onDummyLookPos.exec(stringifyExample(this))) {
            return this.get().simulateLookAt(target);
        }
        return false;
    }

    loopSlot: number; // 循环操作（使用物品槽位）
    loopType: LoopTypes; // 操作类型
    loopCycleTime: number = 1000; // 循环周期
    loopID: number; // setTimeout的ID

    loopStart() {
        try {
            if (!this.checkOnline()) return false;
            const pl = this.get();

            if (onDummySimulationOperation.exec(stringifyExample(this))) {
                switch (this.loopType) {
                    case "attack":
                        pl.simulateAttack();
                        break;
                    case "destroy":
                        pl.simulateDestroy();
                        break;
                    case "item":
                        pl.simulateUseItem(this.loopSlot);
                        break;
                    default:
                        return false;
                }
            }
            if (this.loopCycleTime <= 10) this.loopCycleTime = 1000;

            this.loopID = setTimeout(() => {
                this.looping();
            }, this.loopCycleTime);
            return true;
        } catch (e) {
            logger.error(`${e}\n${e.stack}`);
            return false;
        }
    }

    private looping = () => {
        if (this.checkOnline()) return false;
        if (this.loopType === "item") {
            this.get().simulateStopUsingItem();
        }
        return this.loopStart();
    };

    loopStop() {
        if (this.loopID) {
            if (clearInterval(this.loopID)) {
                this.loopID = undefined;
                this.loopType = undefined;
                return true;
            }
        }
        return false;
    }
}
