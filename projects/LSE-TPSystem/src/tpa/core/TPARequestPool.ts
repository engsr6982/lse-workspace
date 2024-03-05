import { config } from "../../utils/data.js";
import { formatAndPrintingError, hasOwnProperty_ } from "../../utils/util.js";
import { AvailDescription, Available, TPARequest } from "./TpaRequest.js";

/**
 * 全局请求池
 */
export class TPARequestPool {
    /** 请求池 */
    static requests: {
        [recieverXUID: string]: {
            [senderXUID: string]: TPARequest;
        };
    } = {};

    /**
     * 初始化请求池中的玩家格
     * @param xuid 玩家xuid
     */
    private static initPlayer(xuid: string) {
        if (this.requests[xuid] == undefined) {
            this.requests[xuid] = {};
        }
    }

    /**
     * 请求池中是否有某个玩家的请求
     * @param reciever 接收者xuid
     * @param sender 发送者xuid
     * @returns 是否有此请求
     */
    static hasRequest(reciever: string, sender: string) {
        if (!hasOwnProperty_(this.requests, reciever)) return false; // 没有reciever
        if (!hasOwnProperty_(this.requests[reciever], sender)) return false; // 没有sender
        return true;
    }

    /**
     * 放入一个请求
     * @param request 要缓存的tpa请求
     */
    static addRequest(request: TPARequest) {
        this.initPlayer(request.reciever.xuid);
        this.requests[request.reciever.xuid][request.sender.xuid] = request;
        return true;
    }

    /**
     * 从请求池中删除一个请求
     * @param sender 发送者的xuid
     * @param reciever 接收者的xuid
     */
    static deleteRequest(sender: string, reciever: string) {
        this.requests[reciever][sender] = null;
        delete this.requests[reciever][sender];
        return true;
    }

    /**
     * 清理过期或失效的请求
     */
    static cleanup = async () => {
        try {
            const thiz = TPARequestPool;
            // 遍历接收者
            for (const reciever in thiz.requests) {
                // 遍历发送者
                for (const sender in thiz.requests[reciever]) {
                    const req = thiz.requests[reciever][sender]; // 取出请求实例
                    // 检查请求
                    if (req.available != Available.Available) {
                        if (req.sender != null) {
                            req.sender.tell(AvailDescription(req.available));
                        }
                        thiz.deleteRequest(sender, reciever);
                    }
                }
            }
            // 开始下一轮检查
            if (config.Tpa.CacheCheckFrequency <= 0) return;
            setTimeout(TPARequestPool.cleanup, config.Tpa.CacheCheckFrequency);
        } catch (e) {
            formatAndPrintingError(e);
        }
    };
}

TPARequestPool.cleanup();
