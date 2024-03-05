import JSONChecker from "../../../LSE-Modules/src/JSONChecker.js";
import { pluginFloder } from "../utils/GlobalVars.js";
import { __config__, config, dataFile } from "../utils/data.js";

export async function checkConfig() {
    const checker = new JSONChecker(__config__, config, true);

    checker.currentJSON = await checker.fillMissingProperties();

    const nc: Config_Structure = (await checker.removeExtraProperties()) as Config_Structure;

    dataFile.writeFile(`${pluginFloder.global}Config.json`, JSON.stringify(nc, null, 4));
    dataFile.initData();
}
