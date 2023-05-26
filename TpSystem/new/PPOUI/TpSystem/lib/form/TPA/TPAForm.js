import {OnlinePlayers} from "../../OnlinePlayers.js"
import {SimpleFormWithPlayer} from "../SimpleFormWithPlayer.js"
import {TPARequest,Available,AvailDescription} from "../../core/TPA/TPARequest.js"
import {Config} from "../../cache.js";
import { Listener } from "../../listenAPI.js";

/**
 * TPA表单，只发起tpa，不负责tpa过程
 */
export class TPAForm extends SimpleFormWithPlayer{
    /**
     * 
     * @param {Player} player 操作表单的玩家
     * @param {string} type tpa的种类
     */
    constructor(player,type){
        super(player,type)
        let online=new OnlinePlayers();
        let newRequest;
        //点击按钮后，程序将立即创建一个tpa请求
        for(let i in online.real){
            super.addButton(online.real[i].name,()=>{
                newRequest=new TPARequest(player,online.real[i],type,Config.TPA.CacheExpirationTime);
                //发送请求，存储请求结果并向玩家发送
                let askResult=newRequest.ask();
                let TPARequestSendEvent=new Listener("onTpSystemTpaRequestSend");
                if(askResult!=Available.Available){player.tell(AvailDescription(askResult))}
                TPARequestSendEvent.exec(newRequest,(askResult==Available.Available))
            })         
        }
    }
}