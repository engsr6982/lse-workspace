import { form } from "../GUI.js";
import { PLUGIN_INFO } from "../cache.js";



export function RegCommand() {
    const cmd = mc.newCommand("box", PLUGIN_INFO.Introduce, PermType.Any);
    cmd.overload();
    cmd.setCallback((_, ori, out, res) => {
        ori.player ? form.index(ori.player) : out.error("player null");
    });
    cmd.setup();
}