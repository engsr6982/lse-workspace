import { FPManager } from "../FPManager/Manager.js";
import { index } from "../Form/index.js";
import { noPermissions } from "../Form/Tools.js";
import { generateCSVLog } from "../include/CsvLogger.js";
import { permissionCore as perm, permissionForm as perm_Form } from "../include/Permission.js";

/**
 *
 * @param {Command} _
 * @param {CommandOrigin} ori
 * @param {CommandOutput} out
 * @param {*} res
 */
// eslint-disable-next-line complexity
export function CallBack(_: Command, ori: CommandOrigin, out: CommandOutput, res: any) {
    logger.debug(JSON.stringify(res, null, 2));
    let playerXUID;
    switch (res.action) {
        case "create":
            {
                // 避免作用域冲突
                // 权限组检查，仅拦截玩家
                if (ori.player && !perm.verifyUserPermission(ori.player.xuid, "add")) {
                    return noPermissions(ori.player);
                }
                if (ori.player == null && !res.bindPlayer) return out.error("缺少参数");
                const nPos = new IntPos(res.pos.x, res.pos.y, res.pos.z, res.dimid);
                const s = FPManager.createDummyExample({
                    name: res.name,
                    isInvincible: false,
                    isAutoRespawn: false,
                    bindPlayer: ori.player != null ? ori.player.realName : res.bindPlayer,
                    isAutoOnline: false,
                    onlinePos: new FloatPos(nPos.x, nPos.y, nPos.z, nPos.dimid),
                    bagGUIDKey: system.randomGuid(),
                });
                s
                    ? out.success(`创建假人[${res.name}]成功!`)
                    : out.error(`创建假人[${res.name}]失败, 返回值: ${s}。假人名称重复或名称不合法`);
                // 生成CSV日志
                generateCSVLog(ori.player, `创建假人`, res.name);
            }
            break;
        case "delete":
            {
                // 权限组检查，仅拦截玩家
                if (ori.player && !perm.verifyUserPermission(ori.player.xuid, "delete")) {
                    return noPermissions(ori.player);
                }
                const s = FPManager.destroyInstance(res.name);
                s ? out.success(`删除假人[${res.name}]成功`) : out.error(`删除假人[${res.name}]失败，假人实例不存在`);
                // 生成CSV日志
                generateCSVLog(ori.player, `删除假人`, res.name);
            }
            break;
        case "operation":
            {
                if (ori.player)
                    switch (
                        res.operation_type // 权限组检查，仅拦截玩家
                    ) {
                        case "attack":
                            if (!perm.verifyUserPermission(ori.player.xuid, "attack")) {
                                return noPermissions(ori.player);
                            }
                            break;
                        case "destroy":
                            if (!perm.verifyUserPermission(ori.player.xuid, "block")) {
                                return noPermissions(ori.player);
                            }
                            break;
                        case "item":
                            if (!perm.verifyUserPermission(ori.player.xuid, "item")) {
                                return noPermissions(ori.player);
                            }
                            break;
                    }
                const s = FPManager.setOperationInfo(res.name, res.operation_type, res.time, res.slot);
                s
                    ? out.success(`开启假人[${res.name}]操作[${res.operation_type}]成功`)
                    : out.error(`开启假人[${res.name}]操作[${res.operation_type}]失败，假人不存在`);
                // 生成CSV日志
                generateCSVLog(ori.player, `开启模拟操作`, res.name);
            }
            break;
        case "offoperation":
            {
                // 权限组检查，仅拦截玩家
                if (ori.player && !perm.verifyUserPermission(ori.player.xuid, "offoperation")) {
                    return noPermissions(ori.player);
                }
                const s = FPManager.stopOperation(res.name);
                s ? out.success(`停止假人[${res.name}]操作成功`) : out.error(`停止假人[${res.name}]操作失败，假人不存在或未开启操作`);
                // 生成CSV日志
                generateCSVLog(ori.player, `关闭模拟操作`, res.name);
            }
            break;
        case "offoperationall":
            {
                // 权限组检查，仅拦截玩家
                if (ori.player && !perm.verifyUserPermission(ori.player.xuid, "offoperationall")) {
                    return noPermissions(ori.player);
                }
                const s = FPManager.stopOperationAll();
                s ? out.success(`停止所有假人操作成功`) : out.error(`停止所有假人操作失败`);
                // 生成CSV日志
                generateCSVLog(ori.player, `关闭所有模拟操作`, res.name);
            }
            break;
        case "online":
            {
                // 权限组检查，仅拦截玩家
                if (ori.player && !perm.verifyUserPermission(ori.player.xuid, "online")) {
                    return noPermissions(ori.player);
                }
                FPManager.online(res.name) ? out.success(`上线假人[${res.name}]成功`) : out.error(`上线假人[${res.name}]失败，假人不存在`);
                // 生成CSV日志
                generateCSVLog(ori.player, `上线假人`, res.name);
            }
            break;
        case "onlineall":
            {
                // 权限组检查，仅拦截玩家
                if (ori.player && !perm.verifyUserPermission(ori.player.xuid, "onlineall")) {
                    return noPermissions(ori.player);
                }
                FPManager.onlineAll() ? out.success("上线所有假人成功") : out.error("上线所有假人失败");
                // 生成CSV日志
                generateCSVLog(ori.player, `上线所有假人`, res.name);
            }
            break;
        case "offline":
            {
                // 权限组检查，仅拦截玩家
                if (ori.player && !perm.verifyUserPermission(ori.player.xuid, "offonline")) {
                    return noPermissions(ori.player);
                }
                FPManager.offline(res.name)
                    ? out.success(`下线假人[${res.name}]成功`)
                    : out.error(`下线假人[${res.name}]失败，假人不存在或不在线`);
                // 生成CSV日志
                generateCSVLog(ori.player, `下线假人`, res.name);
            }
            break;
        case "offlineall":
            {
                // 权限组检查，仅拦截玩家
                if (ori.player && !perm.verifyUserPermission(ori.player.xuid, "offonlineall")) {
                    return noPermissions(ori.player);
                }
                FPManager.offlineAll() ? out.success("下线所有假人成功") : out.error("下线所有假人失败");
                // 生成CSV日志
                generateCSVLog(ori.player, `下线所有假人`, res.name);
            }
            break;
        case "tp":
            {
                // 权限组检查，仅拦截玩家
                if (ori.player && !perm.verifyUserPermission(ori.player.xuid, "tp")) {
                    return noPermissions(ori.player);
                }
                const targetPos = new IntPos(res.pos.x, res.pos.y, res.pos.z, res.dimid);
                FPManager.getDummyInst(res.name).teleport(targetPos)
                    ? out.success(`传送假人[${res.name}]到[${targetPos}]成功`)
                    : out.error(`传送假人[${res.name}]到[${targetPos}]失败`);
                // 生成CSV日志
                generateCSVLog(ori.player, `传送假人`, res.name);
            }
            break;
        case "list":
            {
                // 权限组检查，仅拦截玩家
                if (ori.player && !perm.verifyUserPermission(ori.player.xuid, "list")) {
                    return noPermissions(ori.player);
                }
                let t;
                if (res.name1) {
                    const fp_info = FPManager.getDummyInst(res.name1);
                    t = `显示假人[${fp_info.name}]的详细信息: \n假人名称: ${fp_info.name}\n上线坐标: ${fp_info.onlinePos}\n绑定玩家: ${fp_info.bindPlayer}\n是否在线: ${fp_info.isOnline}\n假人无敌: ${fp_info.isInvincible}\n自动复活: ${fp_info.isAutoRespawn}\n自动上线: ${fp_info.isAutoOnline}\n模拟操作类型: ${fp_info.loopType}\n周期任务间隔时间ms: ${fp_info.loopCycleTime}`;
                } else {
                    t =
                        `已加载假人列表: ` +
                        FPManager.getAllDummyInst()
                            .map((d) => d.name)
                            .join();
                }
                ori.player == null ? logger.info(t) : ori.player.tell(t);
                // 生成CSV日志
                generateCSVLog(ori.player, `查看假人`, res.name1);
            }
            break;
        case "talk":
            {
                // 权限组检查，仅拦截玩家
                if (ori.player && !perm.verifyUserPermission(ori.player.xuid, "talkas")) {
                    return noPermissions(ori.player);
                }
                FPManager.getDummyInst(res.name).get().talkAs(res.msg) ? out.success(`执行成功`) : out.error(`执行失败`);
                // 生成CSV日志
                generateCSVLog(ori.player, `假人说话`, res.name);
            }
            break;
        case "cmd":
            {
                // 权限组检查，仅拦截玩家
                if (ori.player && !perm.verifyUserPermission(ori.player.xuid, "cmd")) {
                    return noPermissions(ori.player);
                }
                FPManager.getDummyInst(res.name).get().runcmd(res.cmds)
                    ? out.success(`执行命令[${res.cmds}]成功`)
                    : out.error(`执行命令[${res.cmds}]失败`);
                // 生成CSV日志
                generateCSVLog(ori.player, `假人执行命令`, res.name);
            }
            break;
        case "lookpos":
            {
                if (ori.player && !perm.verifyUserPermission(ori.player.xuid, "lookpos")) {
                    return noPermissions(ori.player);
                }
                const nPos = new IntPos(res.pos.x, res.pos.y, res.pos.z, FPManager.getDummyInst(res.name).onlinePos.dimid);
                FPManager.setDummyLookAt(res.name, nPos)
                    ? out.success(`设置假人[${res.name}]模拟朝向成功`)
                    : out.error(`设置假人[${res.name}]模拟朝向失败`);
                generateCSVLog(ori.player, `模拟朝向`, res.name);
            }
            break;
        case "setfunc":
            {
                if (ori.player && !perm.verifyUserPermission(ori.player.xuid, "edit", true)) {
                    return noPermissions(ori.player);
                }
                const funcMap: {
                    [key: string]: Propertys;
                } = {
                    isinvincible: "isInvincible",
                    isautoonline: "isAutoOnline",
                    isautorespawn: "isAutoRespawn",
                };
                const func = funcMap[res.func_key];
                FPManager.setProperty(res.name, func, res.func_value)
                    ? out.success(`设置[${func}] => ${res.func_value}`)
                    : out.error(`无法设置[${func}] => ${res.func_value}`);
                generateCSVLog(ori.player, `编辑假人`, res.name);
            }
            break;
        case "mgr":
            ori.player != null
                ? perm.checkIfAdmin(ori.player.xuid)
                    ? perm_Form.index(ori.player)
                    : noPermissions(ori.player)
                : out.error("获取玩家对象失败");
            break;
        case "op":
            {
                if (ori.type !== 7) return out.error("Please on Console use this Command");
                const tryOnlineGet = mc.getPlayer(res.opname);
                playerXUID = tryOnlineGet ? tryOnlineGet.xuid : data.name2xuid(res.opname);
                if (playerXUID == null || playerXUID == "") {
                    return out.error(`获取玩家[${res.opname}]的XUID失败!`);
                }
                perm.addAdminUser(playerXUID)
                    ? logger.info(`已添加管理员: ${res.opname}`)
                    : logger.error(`添加管理员失败，玩家${res.opname} 已是插件管理员`);
            }
            break;
        case "deop":
            {
                if (ori.type !== 7) return out.error("Please on Console use this Command");
                const tryOnlineGet = mc.getPlayer(res.opname);
                playerXUID = tryOnlineGet ? tryOnlineGet.xuid : data.name2xuid(res.opname);
                if (playerXUID == null || playerXUID == "") {
                    return out.error(`获取玩家[${res.opname}]的XUID失败!`);
                }
                perm.removeAdminUser(playerXUID)
                    ? logger.info(`已移除管理员: ${res.opname}`)
                    : logger.error(`移除管理员失败，玩家${res.opname} 不是插件管理员`);
            }
            break;
        default:
            ori.player != null ? index(ori.player) : out.error("获取玩家对象失败");
            break;
    }
}
