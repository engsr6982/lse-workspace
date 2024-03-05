export class OnlinePlayers {
    private all: Array<Player>;
    real: Array<Player>;
    private simulate: Array<Player>;

    constructor() {
        this.all = mc.getOnlinePlayers();
        this.real = [];
        this.simulate = [];
        this.all.forEach((currentValue) => {
            if (currentValue.isSimulatedPlayer()) {
                this.simulate.push(currentValue);
            } else {
                this.real.push(currentValue);
            }
        });
    }
}
