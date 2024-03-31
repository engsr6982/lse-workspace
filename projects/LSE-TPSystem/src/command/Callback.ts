import { deathForm_Instance } from "../death/DeathForm.js";
import { menu } from "../other/menu.js";
import { homeCore_Instance } from "../home/HomeCore.js";
import { homeForm_Instance } from "../home/HomeForm.js";
import { permCoreInstance } from "../include/permission.js";
import { TPAEntrance } from "../tpa/form/TPAEntrance.js";
import { cmdTpaCall_accept_or_deny, cmdTpaCall_to_or_here } from "../tpa/form/cmdTpaCall.js";
import { tprForm } from "../tpr/TprForm.js";
import { config, dataFile, formJSON } from "../utils/data.js";
import { tellTitle } from "../utils/GlobalVars.js";
import { leveldb } from "../utils/leveldb.js";
import { convertPosToVec3, hasOwnProperty_, sendMessage } from "../utils/util.js";
import { warpCore_Instance } from "../warp/WarpCore.js";
import { warpForm_Instance } from "../warp/WarpForm.js";
import { prForm_Instance } from "../pr/PrForm.js";
import { ManagerEntry } from "../manager/ManagerEntry.js";
import { ruleForm_Instance } from "../rule/RuleForm.js";

const sendPlayersUseTip = (out: CommandOutput) => {
    return out.error(tellTitle + "此功能仅限玩家使用!");
};

const call: {
    // eslint-disable-next-line no-unused-vars
    [key: string]: (_: Command, ori: CommandOrigin, out: CommandOutput, result: commandResult) => void;
} = {
    leveldb: (_: Command, ori: CommandOrigin, out: CommandOutput, result: commandResult) => {
        if (ori.type !== 7) return out.error("请在控制台执行此命令!");
        switch (result.leveldb) {
            case "import":
                leveldb.importDataType(result.isOldData || false) ? logger.info(`导入成功！`) : logger.error(`导入失败！`);
                break;
            case "export":
                leveldb.exportLevelDB() ? logger.info(`导出成功！`) : logger.error(`导出失败！`);
                break;
            case "list":
                {
                    const level = leveldb.getLevelDB();
                    if (result["key"] != null) {
                        return logger.info(JSON.stringify(level.get(result.key), null, 2)); // key
                    }
                    if (result["key"] != null && result["key2"] != null) {
                        return logger.info(JSON.stringify(level.get(result.key)[result.key2], null, 2)); // key key2
                    }
                    logger.info(`${level.listKey().join(" | ")}`); // all key
                }
                break;
            case "del":
                {
                    const level = leveldb.getLevelDB();
                    if (result["key2"] != null) {
                        const t = level.get(result.key_m);
                        delete t[result.key2];
                        level.set(result.key_m, t);
                        return logger.info(`删除数据 ${result.key_m}.${result.key2} 成功`);
                    }
                    level.delete(result.key_m);
                    leveldb.initLevelDB(); // 防止把根删除
                    logger.info(`删除数据 ${result.key_m} 成功！`);
                }
                break;
        }
    },
    home: (_: Command, ori: CommandOrigin, out: CommandOutput, result: commandResult) => {
        if (!ori.player) return sendPlayersUseTip(out);
        const { player } = ori;
        if (!config.Home.Enable) return sendMessage(player, "此功能已关闭!");
        switch (result.home) {
            case "list":
                const list = homeCore_Instance.getHomeListString(player.realName);
                if (list === null) return sendMessage(player, "你还没有家园传送点!");
                out.success(`${tellTitle}家园: ${list}`);
                break;
            case "go":
                homeCore_Instance.goHome(player, result.name)
                    ? sendMessage(player, `传送 ${result.name} 成功!`)
                    : sendMessage(player, `传送 ${result.name} 失败!`);
                break;
            case "add":
                homeCore_Instance.creatHome(player, result.name)
                    ? sendMessage(player, `创建 ${result.name} 成功!`)
                    : sendMessage(player, `创建 ${result.name} 失败!`);
                break;
            case "del":
                homeCore_Instance.deleteHome(player, result.name)
                    ? sendMessage(player, `删除 ${result.name} 成功!`)
                    : sendMessage(player, `删除 ${result.name} 失败!`);
                break;
            default:
                homeForm_Instance.index(player);
        }
    },
    warp: (_: Command, ori: CommandOrigin, out: CommandOutput, result: commandResult) => {
        if (!ori.player) return sendPlayersUseTip(out);
        const { player } = ori;
        if (!config.Warp.Enable) return sendMessage(player, "此功能已关闭!");
        switch (result.warp) {
            case "list":
                const w = warpCore_Instance.getWarpListString() || "当前还没有任何公共传送点！";
                sendMessage(player, w);
                break;
            case "go":
                warpCore_Instance.goWarp(player, result.name)
                    ? sendMessage(player, `传送 ${result.name} 成功!`)
                    : sendMessage(player, `传送 ${result.name} 失败!`);
                break;
            case "add":
                if (!permCoreInstance.verifyUserPermission(player.xuid, "addWarp")) return out.error(tellTitle + "无权限添加公共传送点");
                warpCore_Instance._addWarp(result.name, convertPosToVec3(player.blockPos))
                    ? sendMessage(player, `创建 ${result.name} 成功!`)
                    : sendMessage(player, `创建 ${result.name} 失败!`);
                break;
            case "del":
                if (!permCoreInstance.verifyUserPermission(player.xuid, "delWarp")) return out.error(tellTitle + "无权限删除公共传送点");
                warpCore_Instance._deleteWarp(result.name)
                    ? sendMessage(player, `删除 ${result.name} 成功!`)
                    : sendMessage(player, `删除 ${result.name} 失败!`);
                break;
            default:
                warpForm_Instance.index(player);
        }
    },
    tpa: (_: Command, ori: CommandOrigin, out: CommandOutput, result: commandResult) => {
        if (!ori.player) return sendPlayersUseTip(out);
        const { player } = ori;
        if (!config.Tpa.Enable) return sendMessage(player, "此功能已关闭!");
        // log(result.player.map((i) => String(i)));
        switch (result.tpa) {
            case "accept":
                new cmdTpaCall_accept_or_deny(player, "accept");
                break;
            case "deny":
                new cmdTpaCall_accept_or_deny(player, "deny");
                break;
            case "here":
                new cmdTpaCall_to_or_here(player, result.player, "here");
                break;
            case "to":
                new cmdTpaCall_to_or_here(player, result.player, "to");
                break;
            default:
                TPAEntrance(player);
        }
    },
};

// eslint-disable-next-line complexity
export function commandCallback(_: Command, ori: CommandOrigin, out: CommandOutput, result: commandResult) {
    logger.debug(JSON.stringify(result, null, 2));
    if (hasOwnProperty_(call, result.action)) {
        return call[result.action](_, ori, out, result);
    }
    // other
    switch (result.action) {
        case "reload":
            if (ori.type !== 7) return out.error("请在控制台执行此命令!");
            dataFile.initData() ? logger.info("成功") : logger.error("重载失败");
            break;
        case "death":
            ori.player ? deathForm_Instance.sendQueryDeath(ori.player) : sendPlayersUseTip(out);
            break;
        case "pr":
            ori.player ? prForm_Instance.index(ori.player) : sendPlayersUseTip(out);
            break;
        case "rule":
            ori.player ? ruleForm_Instance.index(ori.player) : sendPlayersUseTip(out);
            break;
        case "back":
            ori.player ? deathForm_Instance.sendGoDeath(ori.player) : sendPlayersUseTip(out);
            break;
        case "tpr":
            ori.player ? tprForm(ori.player) : sendPlayersUseTip(out);
            break;
        // case "menu":
        //     ori.player ? menu(ori.player, formJSON) : sendPlayersUse(out);
        //     break;
        case "mgr":
            permCoreInstance.checkIfAdmin(ori.player.xuid) ? ManagerEntry(ori.player) : out.error(tellTitle + "无权限打开控制面板！");
            break;
        case "op":
            {
                if (ori.type !== 7) return out.error("请在控制台执行此命令!");
                const { name } = result,
                    pl = mc.getPlayer(name),
                    xuid: string = pl ? pl.xuid : data.name2xuid(name);

                if (xuid == null) return logger.error(`获取玩家 ${name} 的XUID失败!`);
                permCoreInstance.addAdminUser(xuid) ? logger.info(`添加管理员 ${name} 成功`) : logger.error(`添加管理员 ${name} 失败`);
            }
            break;
        case "deop":
            {
                if (ori.type !== 7) return out.error("请在控制台执行此命令!");
                const { name } = result,
                    pl = mc.getPlayer(name),
                    xuid: string = pl ? pl.xuid : data.name2xuid(name);

                if (xuid == null) return logger.error(`获取玩家 ${name} 的XUID失败!`);
                permCoreInstance.removeAdminUser(xuid) ? logger.info(`移除管理员 ${name} 成功`) : logger.error(`移除管理员 ${name} 失败`);
            }
            break;
        default:
            ori.player ? menu(ori.player, formJSON) : sendPlayersUseTip(out);
    }
}
