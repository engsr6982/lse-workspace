import { pluginInformation } from "../utils/GlobalVars.js";
import { tr } from "../utils/i18n.js";
import { formatPrintError } from "../utils/util.js";
import { command_callback } from "./Callback.js";

export function regCommand() {
    try {
        const cmd = mc.newCommand("tools", tr("introduce", { 0: pluginInformation.name }), PermType.Any);
        cmd.setAlias("optools");

        cmd.mandatory("name", ParamType.RawText);
        // tools add {name}
        cmd.setEnum("add", ["add"]);
        cmd.mandatory("ac", ParamType.Enum, "add");
        cmd.overload(["add", "name"]);

        // tools remove {name}
        cmd.setEnum("remove", ["remove"]);
        cmd.mandatory("ac", ParamType.Enum, "remove");
        cmd.overload(["remove", "name"]);

        // tools mgr
        cmd.setEnum("mgr", ["mgr"]);
        cmd.mandatory("ac", ParamType.Enum, "mgr");
        cmd.overload(["mgr"]);

        // tools reload
        cmd.setEnum("reload", ["reload"]);
        cmd.mandatory("ac", ParamType.Enum, "reload");
        cmd.overload(["reload"]);

        // tools
        cmd.setEnum("gui", ["gui"]);
        cmd.optional("ac", ParamType.Enum, "gui");
        cmd.overload(["gui"]);

        cmd.setCallback(command_callback);
        return cmd.setup();
    } catch (err) {
        formatPrintError(err);
        return false;
    }
}
