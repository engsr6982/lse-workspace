
import { CallBack } from "./Callback.js";

export function RegCommand() {
    const cmd = mc.newCommand("fp", "模拟玩家操作", PermType.Any);

    // 全局通用
    cmd.mandatory("name", ParamType.String);
    cmd.mandatory("pos", ParamType.BlockPos);
    cmd.mandatory("dimid", ParamType.Int);
    // 创建/删除 假人   为了避免一些问题，强绑定玩家
    //fp create <name: string> <x> <y> <z> <dimid> [bindPlayer]
    cmd.setEnum("create", ["create"]);
    cmd.mandatory("action", ParamType.Enum, "create");
    cmd.optional("bindPlayer", ParamType.String);
    cmd.overload(["create", "name", "pos", "dimid", "bindPlayer"]);

    //fp delete <name: string>
    cmd.setEnum("delete", ["delete"]);
    cmd.mandatory("action", ParamType.Enum, "delete");
    cmd.overload(["delete", "name"]);

    // 假人操作相关
    //fp operation <Attack,Mining,Item> <name: string> [time: number]
    cmd.setEnum("operation", ["operation"]);
    cmd.mandatory("action", ParamType.Enum, "operation");
    cmd.setEnum("operation_enum", ["attack", "destroy", "item"]);
    cmd.mandatory("operation_type", ParamType.Enum, "operation_enum", "operation_enum", 1);
    cmd.optional("time", ParamType.Int);
    cmd.optional("slot", ParamType.Int);
    cmd.overload(["operation", "operation_enum", "name", "time", "slot"]);

    //fp offoperation <name: string>
    cmd.setEnum("offoperation", ["offoperation"]);
    cmd.mandatory("action", ParamType.Enum, "offoperation");
    cmd.overload(["offoperation", "name"]);

    //fp offoperationall
    cmd.setEnum("offoperationall", ["offoperationall"]);
    cmd.mandatory("action", ParamType.Enum, "offoperationall");
    cmd.overload(["offoperationall"]);

    // 上下线相关
    //fp online <name: string>
    cmd.setEnum("online", ["online"]);
    cmd.mandatory("action", ParamType.Enum, "online");
    cmd.overload(["online", "name"]);

    //fp onlineall
    cmd.setEnum("onlineall", ["onlineall"]);
    cmd.mandatory("action", ParamType.Enum, "onlineall");
    cmd.overload(["onlineall"]);

    //fp offline <name: string>
    cmd.setEnum("offline", ["offline"]);
    cmd.mandatory("action", ParamType.Enum, "offline");
    cmd.overload(["offline", "name"]);

    //fp offlineall
    cmd.setEnum("offlineall", ["offlineall"]);
    cmd.mandatory("action", ParamType.Enum, "offlineall");
    cmd.overload(["offlineall"]);

    // 其他
    //fp tp <name: string> <x> <y> <z> <dimid>
    cmd.setEnum("tp", ["tp"]);
    cmd.mandatory("action", ParamType.Enum, "tp");
    cmd.overload(["tp", "name", "pos", "dimid"]);

    //fp list [name: string]
    cmd.setEnum("list", ["list"]);
    cmd.mandatory("action", ParamType.Enum, "list");
    cmd.optional("name1", ParamType.String);
    cmd.overload(["list", "name1"]);

    //fp talk <name> <msg>
    cmd.setEnum("talk", ["talk"]);
    cmd.mandatory("action", ParamType.Enum, "talk");
    cmd.mandatory("msg", ParamType.String);
    cmd.overload(["talk", "name", "msg"]);

    //fp cmd <name> <cmd>
    cmd.setEnum("cmd", ["cmd"]);
    cmd.mandatory("action", ParamType.Enum, "cmd");
    cmd.mandatory("cmds", ParamType.String);
    cmd.overload(["cmd", "name", "cmds"]);

    //fp lookpos <name> <x> <y> <z>
    cmd.setEnum("lookpos", ["lookpos"]);
    cmd.mandatory("action", ParamType.Enum, "lookpos");
    cmd.overload(["lookpos", "name", "pos"]);

    //fp setfunc <name> <key> <value>
    cmd.setEnum("setfunc", ["setfunc"]);
    cmd.mandatory("action", ParamType.Enum, "setfunc");
    cmd.setEnum("func", ["isinvincible", "isautoonline", "isautoresurrection"]);
    cmd.mandatory("func_key", ParamType.Enum, "func", "func", 1);
    cmd.mandatory("func_value", ParamType.Bool);
    cmd.overload(["setfunc", "name", "func", "func_value"]);

    //fp mgr
    cmd.setEnum("mgr", ["mgr"]);
    cmd.mandatory("action", ParamType.Enum, "mgr");
    cmd.overload(["mgr"]);

    //fp [gui]
    cmd.setEnum("gui", ["gui"]);
    cmd.optional("action", ParamType.Enum, "gui");
    cmd.overload(["gui"]);

    cmd.mandatory("opname", ParamType.String);
    //fp op <opname>
    cmd.setEnum("op", ["op"]);
    cmd.mandatory("action", ParamType.Enum, "op");
    cmd.overload(["op", "opname"]);

    //fp deop <opname>
    cmd.setEnum("deop", ["deop"]);
    cmd.mandatory("action", ParamType.Enum, "deop");
    cmd.overload(["deop", "opname"]);

    // 回调
    cmd.setCallback(CallBack);
    cmd.setup();
}
