export class Utils {
    static isNumber(num: any): boolean {
        return !isNaN(parseFloat(num)) && isFinite(num);
    }
}
