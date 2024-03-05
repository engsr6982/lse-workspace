import { sendMessage } from "../../utils/util.js";
import { SimpleFormWithPlayer } from "../SimpleFormWithPlayer.js";
import { TPARequestPool } from "../core/TPARequestPool.js";
import { TPARequest } from "../core/TpaRequest.js";

export class TPAAskForm extends SimpleFormWithPlayer {
    /**
     *
     * @param request 待接受的请求
     */
    constructor(request: TPARequest) {
        // let tpaDescription = "";

        // if (request.type == "tpa") tpaDescription = request.sender.name + "希望传送到您这里";
        // else if (request.type == "tpahere") tpaDescription = request.sender.name + "希望将您传送至他那里";

        const tpaDescription =
            request.type == "tpa"
                ? request.sender.name + "希望传送到您这里"
                : request.type == "tpahere"
                  ? request.sender.name + "希望将您传送至他那里"
                  : "未知请求类型!";

        super(request.reciever, "tpa");

        super.content = tpaDescription;

        super.addButton(
            "接受",
            () => {
                request.accept();
            },
            "textures/ui/realms_green_check",
        );
        super.addButton(
            "拒绝",
            () => {
                request.deny();
            },
            "textures/ui/realms_red_x",
        );

        super.addButton(
            "缓存本次传送",
            () => {
                this.cacheReq(request);
            },
            "",
        );

        super.close = () => {
            this.cacheReq(request);
        };
    }

    cacheReq = (request: TPARequest) => {
        //目前的版本是只要请求有效就不断的发直到发送成功
        // if (request.available == Available.Available) {
        //     this.send();
        // }

        // 初步实现
        TPARequestPool.addRequest(request)
            ? sendMessage(this.player, `已缓存来自 ${request.sender.realName} 的 ${request.type} 请求`)
            : sendMessage(this.player, `无法缓存来自 ${request.sender.realName} 的 ${request.type} 请求`);
    };
}
