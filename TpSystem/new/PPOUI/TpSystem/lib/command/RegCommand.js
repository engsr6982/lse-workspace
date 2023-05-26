// LiteLoader-AIDS automatic generated
/// <reference path="c:\Users\Administrator\Documents\aids/dts/HelperLib-master/src/index.d.ts"/> 

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
    cmd.setEnum('gui_enum', ['home', 'warp', 'tpa', 'death', 'tpr', 'seting']);
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
    //tps refresh  2023年5月24日21:10:26已废弃
    // cmd.setEnum('refresh', ['refresh']);
    // cmd.mandatory('action', ParamType.Enum, 'refresh', 1);
    // cmd.overload(['refresh']);
    //tps tpr
    cmd.setEnum('tpr', ['tpr']);
    cmd.mandatory('action', ParamType.Enum, 'tpr', 1);
    cmd.overload(['tpr']);

    // 数据库操作
    cmd.setEnum('db', ['db']);
    cmd.mandatory('action', ParamType.Enum, 'db');// 二级命令
    cmd.mandatory('key', ParamType.String);//键
    cmd.optional('key1', ParamType.String);//键1
    //tps db listkey
    cmd.setEnum('listkey', ['listkey']);
    cmd.mandatory('acdb', ParamType.Enum, 'listkey', 'listkey', 1);
    cmd.overload(['db', 'listkey']);
    //tps db todb
    cmd.setEnum('todb', ['todb']);
    cmd.mandatory('acdb', ParamType.Enum, 'todb');
    cmd.overload(['db', 'todb']);
    //tps db tojson 
    cmd.setEnum('tojson', ['tojson']);
    cmd.mandatory('acdb', ParamType.Enum, 'tojson');
    cmd.overload(['db', 'tojson']);
    //tps db list <key: string> [key1: string]
    cmd.setEnum('list', ['list']);
    cmd.mandatory('acdb', ParamType.Enum, 'list');
    cmd.overload(['db', 'list', 'key', 'key1']);
    //tps db delete <key: string> [key1: string]
    cmd.setEnum('delete', ['delete']);
    cmd.mandatory('acdb', ParamType.Enum, 'delete');
    cmd.overload(['db', 'delete', 'key', 'key1']);

    // 回调
    cmd.setCallback(CallBack);
    cmd.setup();
}
