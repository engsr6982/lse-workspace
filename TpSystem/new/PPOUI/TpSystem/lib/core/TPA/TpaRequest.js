import {TPARequestPool} from "./TPARequestPool.js"
import {SimpleFormCallback} from "../../form/SimpleFormCallback.js";

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
        let fm=new SimpleFormCallback(this.type,this.sender.name);
        fm.addButton("接受",()=>{
            this.accept();
        });
        fm.addButton("拒绝",()=>{
            this.deny();
        });
        fm.default(()=>{//玩家按下关闭按钮或发送失败，需将请求加入缓存队列
            TPARequestPool.add(this);
        })
        fm.send(this.reciever);

    }
    accept(){
        switch(this.type){
            case "tpa":{
                this.sender.teleport(reciever.pos);
                break;
            }
            case "tpahere":{
                this.reciever.teleport(sender.pos);
                break;
            }
        }
    }
    deny(){

    }
    /**
     * 请求是否有效
     */
    get available(){

    }
}