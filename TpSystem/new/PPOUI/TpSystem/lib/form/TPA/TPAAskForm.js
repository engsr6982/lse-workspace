import {SimpleFormWithPlayer} from "../SimpleFormWithPlayer.js";
import {TPARequestPool} from "../../core/TPA/TPARequestPool.js"

export class TPAAskForm extends SimpleFormWithPlayer{
    /**
     * 
     * @param {Player} player 接收玩家
     * @param {TPARequest} request 待接受的请求
     */
    constructor(request){
        let tpaDescription="";
        if(request.type=="tpa") tpaDescription=request.sender.name+"希望传送到您这里";
        else if(request.type=="tpahere") tpaDescription=request.sender.name+"希望将您传送至他那里";
        super(request.reciever,"tpa",tpaDescription);
        super.addButton("接受",()=>{
            request.accept();
        });
        super.addButton("拒绝",()=>{
            request.deny();
        });

        //玩家按下关闭按钮或发送失败，需将请求加入缓存队列（todo）
        super.default=()=>{
            //TPARequestPool.add(request);
            this.send();
        }
    }
}