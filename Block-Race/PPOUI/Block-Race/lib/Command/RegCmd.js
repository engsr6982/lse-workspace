import { Callback } from "./Callback.js";

/* 注册顶层 */
export function RegCommand() {
    const Command = mc.newCommand(`br`, `方块竞速`, PermType.Any);
    Command.setAlias('方块竞速');

    // br save [filename: string]
    Command.setEnum('save', ['save']);
    Command.mandatory('action', ParamType.Enum, 'save', 'save', 1);
    Command.optional('filename', ParamType.String);
    Command.overload(['save', 'filename']);

    // br reload
    Command.setEnum('Reload', ['reload']);
    Command.mandatory('action', ParamType.Enum, 'Reload', 'Reload', 1);
    Command.overload(['Reload']);

    // br join <red|blue|yellow|green>
    Command.setEnum('joinm', ['join']);
    Command.setEnum('teamm', ['red', 'blue', 'yellow', 'green']);
    Command.mandatory('action', ParamType.Enum, 'joinm', 'joinm', 1);
    Command.mandatory('team', ParamType.Enum, 'teamm', 'teamm', 1);
    Command.overload('joinm', 'teamm');

    // br roll <int>
    Command.setEnum('roll', ['roll']);
    Command.mandatory('action', ParamType.Enum, 'roll', 'roll', 1);
    Command.mandatory('int', ParamType.Int);
    Command.overload(['roll', 'int']);

    // br record <add|del|tp> <text>
    Command.setEnum('record', ['record']);
    Command.mandatory('action', ParamType.Enum, 'record', 'record', 1);
    Command.setEnum('rtypem', ['add', 'del', 'tp']);
    Command.mandatory('record_type', ParamType.Enum, 'rtypem', 'rtypem', 1);
    Command.mandatory('record_name', ParamType.RawText);
    Command.overload(['record', 'rtypem', 'record_name']);

    // br tp <player>
    Command.setEnum('tp', ['tp']);
    Command.mandatory('action', ParamType.Enum, 'tp', 'tp', 1);
    Command.mandatory('player', ParamType.Player);
    Command.overload(['tp', 'player']);

    // /br start
    Command.setEnum('start', ['start']);
    Command.mandatory('action', ParamType.Enum, 'start', 'start', 1);
    Command.overload(['start']);

    // /br gui
    Command.setEnum('gui', ['gui']);
    Command.mandatory('action', ParamType.Enum, 'gui', 'gui', 1);
    Command.overload(['gui']);

    Command.setCallback(Callback);
    return Command.setup();
}

