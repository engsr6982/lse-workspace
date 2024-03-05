import { config } from "../../utils/data.js";
import { money_Instance } from "../../include/money.js";
import { TPAAskForm } from "../form/TPAAskForm.js";
import { TPARequestPool } from "./TPARequestPool.js";
import { ruleCore_Instance } from "../../rule/RuleCore.js";

/**
 * 请求类
 */
export class TPARequest {
    /**请求者 */
    sender: Player;
    /**请求目标 */
    reciever: Player;
    /**请求种类 */
    type: "tpa" | "tpahere";
    /**请求发生时间 */
    time: Date;
    /**请求有效期 */
    lifespan: number;

    /**
     *
     * @param sender 请求发送者
     * @param reciever 请求接收者
     * @param type 请求各类
     * @param lifespan 有效时长，以毫秒为单位
     */
    constructor(sender: Player, reciever: Player, type: "tpa" | "tpahere", lifespan: number) {
        this.sender = sender;
        this.reciever = reciever;
        this.type = type;
        this.time = new Date();
        this.lifespan = lifespan;
    }

    /**
     * 请求是否过期
     */
    get isOutdated() {
        if (new Date().getTime() - this.time.getTime() >= this.lifespan) {
            return true;
        }
        return false;
    }

    /**
     * 向请求的目标发起询问
     * @returns 询问结果
     */
    ask() {
        const available = this.available;
        if (available != Available.Available) {
            return available; //无效
        }

        // 创建询问表单
        const fm = new TPAAskForm(this);
        // 检查是否需要弹窗
        ruleCore_Instance.getPlayerRule(this.reciever.realName).tpaPopup ? fm.send() : fm.cacheReq(this);

        return available;
    }

    /**
     * 执行接受
     */
    accept() {
        //判断是否有效
        if (this.available != Available.Available) {
            if (this.sender != null) {
                this.sender.tell(AvailDescription(this.available));
            }
            return;
        }
        //执行传送动作
        switch (this.type) {
            case "tpa": {
                this.sender.teleport(this.reciever.feetPos);
                break;
            }
            case "tpahere": {
                this.reciever.teleport(this.sender.feetPos);
                break;
            }
        }
        //扣钱
        money_Instance.deductPlayerMoney(this.sender, config.Tpa.Money);
        this.sender.tell(this.reciever.name + "接受了您的" + this.type + "请求");

        this.checkTPARequestPool();
    }

    /**
     * 检查自身是否在请求池中
     */
    private checkTPARequestPool() {
        if (TPARequestPool.hasRequest(this.reciever.xuid, this.sender.xuid)) {
            TPARequestPool.deleteRequest(this.sender.xuid, this.reciever.xuid);
        }
    }

    /**
     * 拒绝请求
     */
    deny() {
        this.sender.tell(this.reciever.name + "拒绝了您的" + this.type + "请求");
        this.checkTPARequestPool();
    }

    /**
     * 请求是否有效
     * @returns 是否有效
     */
    get available(): number {
        if (this.isOutdated) {
            return Available.Expired;
        }
        if (this.sender == null) {
            return Available.SenderOffline;
        }
        if (this.reciever == null) {
            return Available.RecieverOffline;
        }
        if (money_Instance.getPlayeyMoney(this.sender) < config.Tpa.Money && config.Tpa.Money != 0) {
            return Available.Unaffordable;
        }
        if (ruleCore_Instance.getPlayerRule(this.reciever.realName).allowTpa === false) {
            return Available.ProhibitTpaRequests;
        }
        return Available.Available;
    }
}

/**枚举请求无效原因 */
export enum Available {
    /**请求有效 */
    Available = 0,
    /**过期 */
    Expired = 1,
    /**发送者离线 */
    SenderOffline = 2,
    /**目标离线 */
    RecieverOffline = 3,
    /**发送者余额不足 */
    Unaffordable = 4,
    /**禁止Tpa请求 */
    ProhibitTpaRequests = 5,
}

export function AvailDescription(avail: Available) {
    switch (avail) {
        case Available.Available: {
            return "有效";
        }
        case Available.Expired: {
            return "请求已过期";
        }
        case Available.SenderOffline: {
            return "请求发送者已离线";
        }
        case Available.RecieverOffline: {
            return "请求目标已离线";
        }
        case Available.Unaffordable: {
            return "请求者余额不足，无法为此次tpa支付";
        }
        case Available.ProhibitTpaRequests: {
            return "对方禁止任何人发送Tpa请求";
        }
        default: {
            return "未知有效性描述";
        }
    }
}
