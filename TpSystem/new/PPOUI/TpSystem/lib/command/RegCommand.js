import { CallBack } from "../command/CallBack.js";
import { Config } from "../cache.js";

export function RegCommand() {
    const cmd = mc.newCommand(Config.Command.name, Config.Command.Describe, PermType.Any);
    //tps mgr
    cmd.setEnum('mgr', ['mgr']);
    cmd.mandatory('action', ParamType.Enum, 'mgr', 1);
    cmd.overload(['mgr']);

    // tps [gui] [home|warp|player|death|random|seting]
    cmd.setEnum("gui", ['gui']);
    cmd.optional('action', ParamType.Enum, 'gui', 1);
    cmd.setEnum('gui_enum', ['home', 'warp', 'player', 'death', 'random', 'seting']);
    cmd.optional('gui_name', ParamType.Enum, 'gui_enum', 'gui_enum', 1);
    cmd.overload(['gui', 'gui_enum']);

    cmd.setCallback(CallBack);
    cmd.setup();
}
