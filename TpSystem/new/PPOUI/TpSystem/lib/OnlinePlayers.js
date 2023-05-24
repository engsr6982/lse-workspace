export class OnlinePlayers{
    constructor(){
        this.all=mc.getOnlinePlayers();
        this.real=[];
        this.simulate=[];
        this.all.forEach((currentValue)=>{
            if(currentValue.isSimulatedPlayer){
                this.simulate.push(currentValue);
            }
            else{
                this.real.push(currentValue);
            }
        })
    }
}