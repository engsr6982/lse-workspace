import { tellTitle } from "../utils/GlobalVars.js";

export class ModalForms {
    constructor(title: string = tellTitle, content: string = "") {
        this.title = title;
        this.content = content;
    }

    private title: string;
    private content: string;

    private text_0: string = "";
    private text_1: string = "";

    private call_0: () => void;
    private call_1: () => void;
    private call_2: () => void;

    setButton_0_call(text: string, call: () => void) {
        this.text_0 = text;
        this.call_0 = call;
    }
    setButton_1_call(text: string, call: () => void) {
        this.text_1 = text;
        this.call_1 = call;
    }
    setDefault_call(call: () => void) {
        this.call_2 = call;
    }

    send(player: Player) {
        player.sendModalForm(this.title, this.content, this.text_0, this.text_1, (player, res) => {
            switch (res) {
                case true:
                    return this.call_0();
                case false:
                    return this.call_1();
                default:
                    return this.call_2();
            }
        });
    }
}
