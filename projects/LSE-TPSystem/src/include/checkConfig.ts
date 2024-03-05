import JSONChecker from "../../../LSE-Modules/src/JSONChecker.js";
import { pluginFloder } from "../utils/GlobalVars.js";
import { __config__, config, dataFile } from "../utils/data.js";

export async function checkConfig() {
    const checker = new JSONChecker(__config__, config, true);

    await checker.fillMissingProperties();
    await checker.removeExtraProperties();

    dataFile.writeFile(`${pluginFloder.global}Config.json`, JSON.stringify(checker.currentJSON, null, 4));
    dataFile.initData();
}
