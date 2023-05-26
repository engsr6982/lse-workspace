import {TPAAskForm} from "../../form/TPA/TPAAskForm.js"
import { Money_Mod } from "../../Money.js";
import { Config } from "../../cache.js";
/**
 * 请求类
 */
export class TPARequest{
    /**
     *  
     * @param {Player} sender 请求发送者
     * @param {Player} reciever 请求接收者
     * @param {string} type 请求各类
     * @param {number} lifespan 有效时长，以毫秒为单位
     */
    constructor(sender,reciever,type,lifespan){
        /**请求者 */
        this.sender=sender;
        /**请求目标 */
        this.reciever=reciever;
        /**请求种类 */
        this.type=type;
        /**请求发生时间 */
        this.time=new Date();
        /**请求有效期 */
        this.lifespan=lifespan;
    }
    /**
     * 请求是否过期
     */
    get isOutdated(){
        if(new Date().getTime()-this.time.getTime()>=this.lifespan){
            return true;
        }
        return false;
    }
    /**
     * 向请求的目标发起询问
     * @returns {Available} 询问结果
     */
    ask(){
        let available=this.available;
        if(available!=Available.Available){return available;}//无效
        let fm=new TPAAskForm(this);

        fm.send();
        return available;
    }
    /**
     * 执行接受
     */
    accept(){
        //判断是否有效
        if(this.available!=Available.Available){
            if(this.sender!=null){
                this.sender.tell(AvailDescription(this.available));
            }
            return;
        }
        //执行传送动作
        switch(this.type){
            case "tpa":{
                this.sender.teleport(this.reciever.feetPos);
                break;
            }
            case "tpahere":{
                this.reciever.teleport(this.sender.feetPos);
                break;
            }
        }
        //扣钱
        Money_Mod.DeductEconomy(this.sender,Config.TPA.Player_Player)
        this.sender.tell(this.reciever.name+"接受了您的"+this.type+"请求")
    }
    deny(){
        this.sender.tell(this.reciever.name+"拒绝了您的"+this.type+"请求")
    }
    /**
     * 请求是否有效
     * @returns {Available} 是否有效
     */
    get available(){
        if(this.isOutdated){
            return Available.Expired;
        }
        if(this.sender==null){
            return Available.SenderOffline;
        }
        if(this.reciever==null){
            return Available.RecieverOffline;
        }
        if(Money_Mod.getEconomy(this.sender)<Config.TPA.Player_Player&&Config.TPA.Player_Player!=0){
            return Available.Unaffordable;
        }
        return Available.Available;
    }
}
/**枚举请求无效原因，可惜js不支持枚举，只能写成number */
export const Available={
    Available:0,
    Expired:1,
    SenderOffline:2,
    RecieverOffline:3,
    Unaffordable:4
}
export function AvailDescription(avail){
    switch(avail){
        case Available.Available:{
            return "有效";
        }
        case Available.Expired:{
            return "请求已过期";
        }
        case Available.SenderOffline:{
            return "请求发送者已离线";
        }
        case Available.RecieverOffline:{
            return "请求目标已离线";
        }
        case Available.Unaffordable:{
            return "请求者余额不足，无法为此次tpa支付";
        }
        default:{
            return "未知有效性描述";
        }
    }
}