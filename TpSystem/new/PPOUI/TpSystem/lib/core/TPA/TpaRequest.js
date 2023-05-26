import {TPAAskForm} from "../../form/TPA/TPAAskForm.js"

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
        
    }
    /**
     * 向请求的目标发起询问
     * @returns {boolean} 是否成功发起询问
     */
    ask(){
        if(!this.available){return false;}//无效
        let fm=new TPAAskForm(this);

        fm.send();

    }
    accept(){
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
        this.sender.tell(this.reciever.name+"接受了您的"+this.type+"请求")
    }
    deny(){
        this.sender.tell(this.reciever.name+"拒绝了您的"+this.type+"请求")
    }
    /**
     * 请求是否有效
     * @returns {boolean} 是否有效
     */
    get available(){
        if(new Date().getTime()-this.time.getTime()>=this.lifespan){
            return false;
        }
        return true;
    }
}