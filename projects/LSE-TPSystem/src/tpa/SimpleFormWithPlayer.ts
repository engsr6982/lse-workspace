import { SimpleForms } from "../../../LSE-Modules/src/form/SimpleForms.js";

export class SimpleFormWithPlayer extends SimpleForms {
    player: Player;
    constructor(player: Player, title: string) {
        super(title);
        this.player = player;
    }

    send() {
        return super.send(this.player);
    }
}
