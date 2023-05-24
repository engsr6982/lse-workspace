import {OnlinePlayers} from "../OnlinePlayers.js"
import {SimpleFormCallback} from "./SimpleFormCallback.js"
import {TPARequest} from "../core/TPA/TPARequest.js"
import {Config} from "../cache.js";

/**
 * TPA表单，只发起tpa，不负责tpa过程
 */
export class TPAForm{
    /**
     * 
     * @param {Player} player 操作表单的玩家
     * @param {string} type tpa的种类
     */
    constructor(player,type){
        let online=new OnlinePlayers();
        this.player=player;
        this.fm=new SimpleFormCallback();
        let newRequest;
        //点击按钮后，程序将立即创建一个tpa请求
        online.real.forEach((currentValue)=>{
            this.fm.addButton(currentValue.name,()=>{
                newRequest=new TPARequest(player,currentValue,type,Config.TPA.CacheExpirationTime);
                newRequest.ask();
            })
        })
    }
    /**
     * 发送tpa表单
     */
    send(){
        this.fm.send(this.player);
    }
}