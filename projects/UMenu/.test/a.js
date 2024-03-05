class event {
    constructor(event) {
        this.event = event;
    }

    static eveCall = {};

    static on(eventl, callback) {
        if (event.eveCall == undefined) {
            event.eveCall = {};
        }
        if (!Object.prototype.hasOwnProperty.call(event.eveCall, eventl)) {
            event.eveCall[eventl] = [];
        }
        event.eveCall[eventl].push(callback);
        return true;
    }

    emit(callback) {
        const iseve = Object.prototype.hasOwnProperty.call(event.eveCall, this.event);
        let isRet = true;
        if (iseve) {
            event.eveCall[this.event].forEach((element) => {
                if (element(callback) === false) {
                    isRet = false;
                }
            });
            return isRet == true ? true : false;
        }
    }
}

globalThis.onEvent = event.on;
const formcallback = new event("formcallback");

let index = 0;
const id = setInterval(() => {
    formcallback.emit(index++);
    if (index >= 10) {
        clearInterval(id);
        debugger;
    }
}, 500);

function loadEx() {
    const ex = require("./b.js");
    console.warn("name: ", ex.name);
    console.warn("entry: ", ex.entry());
    // const ex = require("./b/b.js");
    // log("name: ", ex.name);
    // log("entry: ", ex.entry());

}
loadEx();

const a = new Map([["a", 11]]);

debugger