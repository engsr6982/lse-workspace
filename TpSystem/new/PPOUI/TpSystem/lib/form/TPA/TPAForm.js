import {OnlinePlayers} from "../../OnlinePlayers.js"
import {SimpleFormWithPlayer} from "../SimpleFormWithPlayer.js"
import {TPARequest} from "../../core/TPA/TPARequest.js"
import {Config} from "../../cache.js";

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
        online.real.forEach((currentValue)=>{
            super.addButton(currentValue.name,()=>{
                newRequest=new TPARequest(player,currentValue,type,Config.TPA.CacheExpirationTime);
                newRequest.ask();
            })
        })
    }
}