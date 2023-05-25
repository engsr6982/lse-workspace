const SimpleFormCallback=require("../lib/SimpleFormCallback.js");
/**
 * @author Minimouse
 * 进一步规范SimpleForm，将表单与玩家绑定
 */
class SimpleFormWithPlayer extends SimpleFormCallback{
    constructor(player,title,content){
        super(title,content);
        this.player=player;
    }
    send(){
        super.send(this.player)
    }
}
module.exports=SimpleFormWithPlayer;