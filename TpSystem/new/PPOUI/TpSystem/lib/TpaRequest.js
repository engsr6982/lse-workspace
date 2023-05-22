/**
 * 请求类
 */
class TpaRequest{
    /**
     *  
     * @param {Player} sender 请求发送者
     * @param {*} reciever 请求接收者
     * @param {string} type 请求各类
     * @param {number} lifespan 有效时长，以毫秒为单位
     */
    constructor(sender,reciever,type,lifespan){
        this.sender=sender;
        this.reciever=reciever;
        this.type=type;
        this.time=new Date();
        this.lifespan=lifespan;
    }
    get isOutdated(){
        
    }
    /**
     * 向请求的目标发起询问
     * @returns {boolean} 是否成功发起询问
     */
    ask(){
        if(!this.available){return false;}
        let fm=mc.newSimpleForm();
        fm.addButton("接受");
        fm.addButton("拒绝");
        this.reciever.sendForm(fm,(player,id)=>{
            switch(id){
                case 0:{//接受
                    break;
                }
                default:{//关闭表单或发送失败
                    
                }
            }
        })

    }
    accept(){
        
    }
    deny(){

    }
    get available(){

    }
}

/**
 * 全局请求池
 */
class TPA_Cache {//todo 缓存传送
    constructor(){
        this.requests=[];
    }
    static async DeleteCache(pl) {
        for (let i = 0; i < TPACache.length; i++) {
            if (i.from == pl.realName || i.to == pl.realName) {
                let capl = mc.getPlayer(i.from); let name = i.to;
                if (i.type == 1) {
                    capl = mc.getPlayer(i.to);
                    name = i.from;
                }
                if (capl) {
                    capl.tell(Gm_Tell + `传送失败！玩家[${name}]已离线!`);
                }
                TPACache.splice(i, 1);
            }
        }
    }
    add(request){
        this.requests.push(request);
    }
    // static async getRequest(pl) {
    //     let tmp = [];
    //     for (let i = 0; i < TPACache.length; i++) {
    //         if ()
    //     }
    // }
}