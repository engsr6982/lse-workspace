import { OnlinePlayers } from "../core/OnlinePlayers.js";
import { TPARequest, Available, AvailDescription } from "../core/TpaRequest.js";
import { config } from "../../utils/data.js";
import { TPARequestSendEvent } from "../../include/ListenerEvent.js";
import { SimpleFormWithPlayer } from "../SimpleFormWithPlayer.js";

/**
 * TPA表单，只发起tpa，不负责tpa过程
 */
export class TPAForm extends SimpleFormWithPlayer {
    /**
     *
     * @param player 操作表单的玩家
     * @param type tpa的种类
     */
    constructor(player: Player, type: "tpa" | "tpahere") {
        super(player, type);
        const online = new OnlinePlayers();
        let newRequest: TPARequest;
        //点击按钮后，程序将立即创建一个tpa请求
        for (const i in online.real) {
            super.addButton(online.real[i].name, () => {
                newRequest = new TPARequest(player, online.real[i], type, config.Tpa.CacheExpirationTime);
                //发送请求，存储请求结果并向玩家发送
                const askResult = newRequest.ask();
                if (askResult != Available.Available) {
                    player.tell(AvailDescription(askResult));
                }
                TPARequestSendEvent.exec(newRequest, askResult == Available.Available);
            });
        }
    }
}
