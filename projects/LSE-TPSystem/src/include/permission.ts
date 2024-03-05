import PermissionCore from "../../../LSE-Modules/src/Permission/PermissionCore.js";
import PermissionForm from "../../../LSE-Modules/src/Permission/PermissionForm.js";
import { pluginFloder } from "../utils/GlobalVars.js";

export const permCoreInstance = new PermissionCore(pluginFloder.data + "permission.json", true);

export const permFormInstance = new PermissionForm(pluginFloder.global + "lang\\", () => {
    return permCoreInstance;
});
