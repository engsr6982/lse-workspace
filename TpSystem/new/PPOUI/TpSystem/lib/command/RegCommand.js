import { CallBack } from "../command/CallBack.js";
import { Config } from "../cache.js";

export function RegCommand() {
    const cmd = mc.newCommand(Config.Command.name, Config.Command.Describe, PermType.Any);


    cmd.setCallback(CallBack);
    cmd.setup();
}
