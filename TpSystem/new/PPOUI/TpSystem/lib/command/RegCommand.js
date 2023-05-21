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
    cmd.setEnum('gui_enum', ['home', 'warp',/*  'player',  */'death', 'tpr', 'seting']);
    cmd.optional('gui_name', ParamType.Enum, 'gui_enum', 'gui_enum', 1);
    cmd.overload(['gui', 'gui_enum']);
    //tps reload
    cmd.setEnum('reload', ['reload']);
    cmd.mandatory('action', ParamType.Enum, 'reload', 1);
    cmd.overload(['reload']);
    //tps accept
    cmd.setEnum('accept', ['accept']);
    cmd.mandatory('action', ParamType.Enum, 'accept', 1);
    cmd.overload(['accept']);
    //tps deny
    cmd.setEnum('deny', ['deny']);
    cmd.mandatory('action', ParamType.Enum, 'deny', 1);
    cmd.overload(['deny']);
    //tps back
    cmd.setEnum('back', ['back']);
    cmd.mandatory('action', ParamType.Enum, 'back', 1);
    cmd.overload(['back']);
    //tps refresh
    cmd.setEnum('refresh', ['refresh']);
    cmd.mandatory('action', ParamType.Enum, 'refresh', 1);
    cmd.overload(['refresh']);
    //tps tpr
    cmd.setEnum('tpr', ['tpr']);
    cmd.mandatory('action', ParamType.Enum, 'tpr', 1);
    cmd.overload(['tpr']);
    cmd.setCallback(CallBack);
    cmd.setup();
}
