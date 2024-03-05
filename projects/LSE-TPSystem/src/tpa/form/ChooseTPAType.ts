import { TPAForm } from "./TPAForm.js";
import { SimpleFormWithPlayer } from "../SimpleFormWithPlayer.js";

export class ChooseTPAForm extends SimpleFormWithPlayer {
    constructor(player: Player) {
        super(player, "你想如何传送？");
        super.addButton("传送到其他玩家", () => {
            this.sendTPAForm("tpa");
        });
        super.addButton("让其他玩家传送过来", () => {
            this.sendTPAForm("tpahere");
        });
        //super.addButton("接受其他玩家的请求",()=>{});
    }
    sendTPAForm(type: "tpa" | "tpahere") {
        const fm = new TPAForm(this.player, type);
        fm.send();
    }
}
