import { indexForm } from "../form/index.js";
import { color } from "../../../LSE-Modules/src/Color.js";
import { dataOperation } from "../utils/data.js";
import { tr } from "../utils/i18n.js";
import { /* pcore,  */ pform } from "../utils/util.js";

interface resItem {
    ac: "add" | "remove" | "reload" | "mgr" | "gui";
    name: string;
}

// 定义回调
const call = {
    add: (_: Command, ori: CommandOrigin, out: CommandOutput, res: resItem): boolean => {
        const { type } = ori;
        const { name } = res;
        // 检查是否为控制台
        if (type !== 7) return out.error("No permission, this command is only used by the console!");

        // 尝试获取xuid
        const xuid = mc.getPlayer(name) ? mc.getPlayer(name).xuid : data.name2xuid(name);
        if (!xuid) return out.error(tr("command.failedToObtainXuid", { 0: name }));

        // 进行增加管理员
        // pcore.addAdmin(xuid)
        //     ? out.success(tr("command.addAdministrator", { 0: name }))
        //     : out.error(tr("command.addingAdministratorFailed", { 0: res.name }));
    },
    remove: (_: Command, ori: CommandOrigin, out: CommandOutput, res: resItem): boolean => {
        const { type } = ori;
        const { name } = res;
        // 检查是否为控制台
        if (type !== 7) return out.error("No permission, this command is only used by the console!");

        // 尝试获取xuid
        const xuid = mc.getPlayer(name) ? mc.getPlayer(name).xuid : data.name2xuid(name);
        if (!xuid) return out.error(tr("command.failedToObtainXuid", { 0: name }));

        // 进行移除管理员
        // pcore.removeAdmin(xuid)
        //     ? out.success(tr("command.removeAdministrator", { 0: name }))
        //     : out.error(tr("command.removingAdministratorFailed", { 0: res.name }));
    },
    reload: (_: Command, ori: CommandOrigin, out: CommandOutput /* , res: resItem */): boolean => {
        const { type } = ori;
        // 检查是否为控制台
        if (type !== 7) return out.error("No permission, this command is only used by the console!");
        // 调用加载函数以实现重载
        dataOperation.load();
        out.success(color.bgGreen + tr("command.reload"));
    },
    mgr: (_: Command, ori: CommandOrigin, out: CommandOutput /* , res: resItem */): boolean => {
        const { player } = ori;
        if (!player) return out.error(tr("command.failedToObtainPlayerObject"));
        // 打开表单
        pform.index(player);
    },
};

export function command_callback(_: Command, ori: CommandOrigin, out: CommandOutput, res: resItem) {
    if (Object.prototype.hasOwnProperty.call(call, res.ac)) {
        // @ts-ignore
        return call[res.ac](_, ori, out, res);
    }
    // default
    const { player } = ori;
    if (!player) return out.error(tr("command.failedToObtainPlayerObject"));
    // 打开表单
    indexForm(ori.player);
}
