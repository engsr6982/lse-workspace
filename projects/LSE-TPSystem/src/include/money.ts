import moneyapi from "../../../LSE-Modules/src/moneyapi.js";
import { config } from "../utils/data.js";

// @ts-ignore

export let money_Instance: moneyapi = undefined;
export const initMoneyModule = () => {
    money_Instance = new moneyapi(config.Money);
};
