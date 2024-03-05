import { config } from "../../utils/data.js";
import { TPARequestSendEvent } from "../../include/ListenerEvent.js";
import { hasOwnProperty_, sendMessage } from "../../utils/util.js";
import { SimpleFormWithPlayer } from "../SimpleFormWithPlayer.js";
import { TPARequestPool } from "../core/TPARequestPool.js";
import { AvailDescription, Available, TPARequest } from "../core/TpaRequest.js";

export class cmdTpaCall_accept_or_deny extends SimpleFormWithPlayer {
    constructor(pl: Player, type: "accept" | "deny") {
        super(pl, "TPA | 选择表单");

        this.type = type;
        this.pl = pl;

        // 请求池没有初始化玩家，故没有请求
        if (hasOwnProperty_(TPARequestPool.requests, pl.xuid)) {
            // 获取所有请求者
            const key = Object.keys(TPARequestPool.requests[pl.xuid]);
            if (key.length === 0) {
                sendMessage(pl, "你还没有任何TPA请求！"); // 没有请求者
            } else if (key.length === 1) {
                this.operationRequest(TPARequestPool.requests[pl.xuid][key[0]]); // 只有一个请求，也就是 [0]
            } else {
                this.select(); // 多个请求
            }
        } else {
            sendMessage(pl, "你还没有任何TPA请求！");
        }
    }

    private operationRequest(req: TPARequest) {
        switch (this.type) {
            case "accept":
                req.accept();
                break;
            case "deny":
                req.deny();
                break;
            default:
                sendMessage(this.pl, "插件错误，请重试！");
        }
    }

    type: "accept" | "deny";
    pl: Player;

    select() {
        const allReq = TPARequestPool.requests[this.pl.xuid]; // 取出所有请求
        // 遍历请求
        for (const req in allReq) {
            super.addButton(allReq[req].sender.realName, () => {
                // 检查请求是否有效
                if (allReq[req].available == Available.Available) {
                    this.operationRequest(allReq[req]);
                }
            });
        }
    }
}

export class cmdTpaCall_to_or_here {
    constructor(sendPlayer: Player, targetPlayer: Array<Player>, type: "to" | "here") {
        this.type = type;
        this.sendPlayer = sendPlayer;
        this.targetPlayer = targetPlayer;

        this.action();
    }

    sendPlayer: Player;
    targetPlayer: Array<Player>;
    type: "to" | "here";
    tpaCoreType: {
        to: "tpa";
        here: "tpahere";
    } = {
        to: "tpa",
        here: "tpahere",
    };

    private checkTarget() {
        if (this.targetPlayer.length === 0) {
            sendMessage(this.sendPlayer, "目标玩家选择器错误！");
            return false;
        } else if (this.targetPlayer.length !== 1) {
            sendMessage(this.sendPlayer, "仅支持对一位玩家发起TPA！");
            return false;
        }
        return true;
    }

    action() {
        // A => B
        // A <= B
        if (!this.checkTarget()) return;
        const req = new TPARequest(this.sendPlayer, this.targetPlayer[0], this.tpaCoreType[this.type], config.Tpa.CacheExpirationTime);
        const askResult = req.ask(); // 发起询问
        if (askResult != Available.Available) {
            this.sendPlayer.tell(AvailDescription(askResult));
        }
        TPARequestSendEvent.exec(req, askResult == Available.Available); // 触发事件
    }
}
