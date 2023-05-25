import { SimpleFormCallback } from "./SimpleFormCallback.js";
/**
 * @author Minimouse
 * 进一步规范SimpleForm，将表单与玩家绑定
 */
export class SimpleFormWithPlayer extends SimpleFormCallback{
    constructor(player,title,content){
        super(title,content);
        this.player=player;
    }
    send(){
        super.send(this.player)
    }
}