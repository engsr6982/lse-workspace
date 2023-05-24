/**
 * 将回调与按钮绑定的表单类
 */
export class SimpleFormCallback{
    constructor(title="",content=""){
        this.fm=mc.newSimpleForm();
        this.fm.setTitle(title);
        this.fm.setContent(content);
        this.buttons=[];
        this.default=()=>{};
    }
    /**
     * 添加一个按钮
     * @param {string} name 按钮名
     * @param {function} callback 回调函数
     */
    addButton(name,callback){
        this.buttons.push(new Button(name,callback));
        this.fm.addButton(name);
    }
    /**
     * 设置玩家点击关闭时的回调
     * @param {function} callback 回调
     */
    set default(callback){
        this.default=callback;
    }
    buildCallback(){
        return callback;
        /**
         * 
         * @param {Player} player 操作表单的玩家
         * @param {number} id 玩家点击的按钮在表单上的次序
         * @returns 
         */
        function callback(player,id){
            if(id==null){
                this.default();
            }
            else{
                this.buttons[id].callback();
            }
        }
    }
    /**
     * 向指定玩家发送表单
     * @param {Player} player 要发送给的玩家
     */
    send(player){
        player.sendForm(this.fm,this.buildCallback());
    }
}
class Button{
    constructor(name,callback){
        this.name=name;
        this.callback=callback;
    }
}