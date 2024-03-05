interface _PDVType {
    [pdv: string]: any;
}

export class PDV {
    constructor() {}

    private _regx: RegExp = /%(\w+)%/gm;
    private _pdvs: _PDVType = {};

    set PDVS(pdv: _PDVType) {
        this._pdvs = pdv;
    }

    private hasOwnProperty_PDVS = (key: string) => {
        return Object.prototype.hasOwnProperty.call(this._pdvs, key);
    };

    regPDV(pdv: string, value: any) {
        if (this.hasOwnProperty_PDVS(pdv)) return false;
        this._pdvs[pdv] = value;
        return true;
    }

    replacePDV(text: string, obj?: any): string {
        return text.replace(this._regx, (match, key) => {
            if (this.hasOwnProperty_PDVS(key)) {
                return typeof this._pdvs[key] === "function" ? this._pdvs[key](obj) : this._pdvs[key];
            }
            return match;
        });
    }

    listPDV() {
        return Object.keys(this._pdvs);
    }
}
