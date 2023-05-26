import {SimpleFormWithPlayer} from "../SimpleFormWithPlayer.js";
import {TPARequestPool} from "../../core/TPA/TPARequestPool.js"

export class TPAAskForm extends SimpleFormWithPlayer{
    /**
     * 
     * @param {Player} player 接收玩家
     * @param {TPARequest} request 待接受的请求
     */
    constructor(request){
        super(request.reciever,request.type,request.sender.name);
        super.addButton("接受",()=>{
            request.accept();
        });
        super.addButton("拒绝",()=>{
            request.deny();
        });

        //玩家按下关闭按钮或发送失败，需将请求加入缓存队列（todo）
        super.default=()=>{
            //TPARequestPool.add(request);
            
        }
    }
}