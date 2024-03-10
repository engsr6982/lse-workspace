import { FPManager } from "../FPManager/Manager.js";
import { form, noPermissions } from "../form/Form.js";
import { _Perm_Object, perm_Form } from "../Perm/index.js";
import { generateCSVLog } from "../include/CsvLogger.js";
import { perm } from "../Perm/index.js";

/**
 *
 * @param {Command} _
 * @param {CommandOrigin} ori
 * @param {CommandOutput} out
 * @param {*} res
 */
// eslint-disable-next-line complexity
export function CallBack(_, ori, out, res) {
    logger.debug(JSON.stringify(res, null, 2));
    let plxuid;
    switch (res.action) {
        case "create":
            {
                // 避免作用域冲突
                // 权限组检查，仅拦截玩家
                if (ori.player && !perm.hasUserPerm(ori.player.xuid, _Perm_Object.AddingDummies.value)) {
                    return noPermissions(ori.player);
                }
                if (ori.player == null && !res.bindPlayer) return out.error("缺少参数");
                const nPos = new IntPos(res.pos.x, res.pos.y, res.pos.z, res.dimid);
                const s = FPManager.createSimulateionPlayer({
                    Name: res.name,
                    isInvincible: false,
                    isAutoResurrection: false,
                    BindPlayer: ori.player != null ? ori.player.realName : res.bindPlayer,
                    isAutoOnline: false,
                    OnlinePos: {
                        x: nPos.x,
                        y: nPos.y,
                        z: nPos.z,
                        dimid: nPos.dimid,
                    },
                    Bag: system.randomGuid(), // 生成一个GUID为背包的key
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
                if (ori.player && !perm.hasUserPerm(ori.player.xuid, _Perm_Object.DeleteDummy.value)) {
                    return noPermissions(ori.player);
                }
                const s = FPManager.DestroyInstance(res.name);
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
                            if (!perm.hasUserPerm(ori.player.xuid, _Perm_Object.SimulatedAttack.value)) {
                                return noPermissions(ori.player);
                            }
                            break;
                        case "destroy":
                            if (!perm.hasUserPerm(ori.player.xuid, _Perm_Object.SimulatedDamage.value)) {
                                return noPermissions(ori.player);
                            }
                            break;
                        case "item":
                            if (!perm.hasUserPerm(ori.player.xuid, _Perm_Object.SimulateTheUseOfItems.value)) {
                                return noPermissions(ori.player);
                            }
                            break;
                    }
                const s = FPManager.operation(res.name, res.operation_type, res.time, res.slot);
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
                if (ori.player && !perm.hasUserPerm(ori.player.xuid, _Perm_Object.CloseSimulationOperation.value)) {
                    return noPermissions(ori.player);
                }
                const s = FPManager.offoperation(res.name);
                s ? out.success(`停止假人[${res.name}]操作成功`) : out.error(`停止假人[${res.name}]操作失败，假人不存在或未开启操作`);
                // 生成CSV日志
                generateCSVLog(ori.player, `关闭模拟操作`, res.name);
            }
            break;
        case "offoperationall":
            {
                // 权限组检查，仅拦截玩家
                if (ori.player && !perm.hasUserPerm(ori.player.xuid, _Perm_Object.CloseAllSimulationOperations.value)) {
                    return noPermissions(ori.player);
                }
                const s = FPManager.offoperationall();
                s ? out.success(`停止所有假人操作成功`) : out.error(`停止所有假人操作失败`);
                // 生成CSV日志
                generateCSVLog(ori.player, `关闭所有模拟操作`, res.name);
            }
            break;
        case "online":
            {
                // 权限组检查，仅拦截玩家
                if (ori.player && !perm.hasUserPerm(ori.player.xuid, _Perm_Object.OnlineDummy.value)) {
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
                if (ori.player && !perm.hasUserPerm(ori.player.xuid, _Perm_Object.LaunchAllDummies.value)) {
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
                if (ori.player && !perm.hasUserPerm(ori.player.xuid, _Perm_Object.OfflineDummy.value)) {
                    return noPermissions(ori.player);
                }
                FPManager.offOnline(res.name)
                    ? out.success(`下线假人[${res.name}]成功`)
                    : out.error(`下线假人[${res.name}]失败，假人不存在或不在线`);
                // 生成CSV日志
                generateCSVLog(ori.player, `下线假人`, res.name);
            }
            break;
        case "offlineall":
            {
                // 权限组检查，仅拦截玩家
                if (ori.player && !perm.hasUserPerm(ori.player.xuid, _Perm_Object.AllDummiesOffline.value)) {
                    return noPermissions(ori.player);
                }
                FPManager.offOnlineAll() ? out.success("下线所有假人成功") : out.error("下线所有假人失败");
                // 生成CSV日志
                generateCSVLog(ori.player, `下线所有假人`, res.name);
            }
            break;
        case "tp":
            {
                // 权限组检查，仅拦截玩家
                if (ori.player && !perm.hasUserPerm(ori.player.xuid, _Perm_Object.DummyTransmission.value)) {
                    return noPermissions(ori.player);
                }
                const p = new IntPos(res.pos.x, res.pos.y, res.pos.z, res.dimid);
                const i = FPManager.tp(res.name, p);
                i ? out.success(`传送假人[${res.name}]到[${p}]成功`) : out.error(`传送假人[${res.name}]到[${p}]失败, ${i}`);
                // 生成CSV日志
                generateCSVLog(ori.player, `传送假人`, res.name);
            }
            break;
        case "list":
            {
                // 权限组检查，仅拦截玩家
                if (ori.player && !perm.hasUserPerm(ori.player.xuid, _Perm_Object.ViewingDummies.value)) {
                    return noPermissions(ori.player);
                }
                let t;
                if (res.name1) {
                    const fp_info = FPManager.getInfo(res.name1);
                    t = `显示假人[${fp_info.Name}]的详细信息: \n假人名称: ${fp_info.Name}\n上线坐标: ${fp_info.OnlinePos}\n绑定玩家: ${fp_info.BindPlayer}\n是否在线: ${fp_info._isOnline}\n假人无敌: ${fp_info.isInvincible}\n自动复活: ${fp_info.isAutoResurrection}\n自动上线: ${fp_info.isAutoOnline}\n周期任务ID: ${fp_info._TimeID}\n模拟操作类型: ${fp_info._OperationType}\n周期任务间隔时间ms: ${fp_info._CycleTime}`;
                } else {
                    t =
                        `已加载假人列表: ` +
                        FPManager.getAllInfo()
                            .map((d) => d.Name)
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
                if (ori.player && !perm.hasUserPerm(ori.player.xuid, _Perm_Object.DummySpeaking.value)) {
                    return noPermissions(ori.player);
                }
                FPManager.talkAs(res.name, res.msg) ? out.success(`执行成功`) : out.error(`执行失败`);
                // 生成CSV日志
                generateCSVLog(ori.player, `假人说话`, res.name);
            }
            break;
        case "cmd":
            {
                // 权限组检查，仅拦截玩家
                if (ori.player && !perm.hasUserPerm(ori.player.xuid, _Perm_Object.DummyCommand.value)) {
                    return noPermissions(ori.player);
                }
                FPManager.runCmd(res.name, res.cmds) ? out.success(`执行命令[${res.cmds}]成功`) : out.error(`执行命令[${res.cmds}]失败`);
                // 生成CSV日志
                generateCSVLog(ori.player, `假人执行命令`, res.name);
            }
            break;
        case "lookpos":
            {
                // 权限组检查，仅拦截玩家
                if (ori.player && !perm.hasUserPerm(ori.player.xuid, _Perm_Object.SimulateOrientation.value)) {
                    return noPermissions(ori.player);
                }
                const nPos = new IntPos(res.pos.x, res.pos.y, res.pos.z, FPManager.getInfo(res.name).OnlinePos.dimid);
                FPManager.setLookPos(res.name, nPos)
                    ? out.success(`设置假人[${res.name}]模拟朝向成功`)
                    : out.error(`设置假人[${res.name}]模拟朝向失败`);
                // 生成CSV日志
                generateCSVLog(ori.player, `模拟朝向`, res.name);
            }
            break;
        case "setfunc":
            {
                // 权限组检查，仅拦截玩家
                if (ori.player && !perm.hasUserPerm(ori.player.xuid, _Perm_Object.EditDummy.value)) {
                    return noPermissions(ori.player);
                }
                // 定义映射对象
                const funcMap = {
                    isinvincible: "isInvincible",
                    isautoonline: "isAutoOnline",
                    isautoresurrection: "isAutoResurrection",
                };
                const func = funcMap[res.func_key];
                FPManager.setFunc(res.name, func, res.func_value)
                    ? out.success(`设置[${func}] => ${res.func_value}`)
                    : out.error(`无法设置[${func}] => ${res.func_value}`);
                // 生成CSV日志
                generateCSVLog(ori.player, `编辑假人`, res.name);
            }
            break;
        case "mgr":
            ori.player != null
                ? perm.isOP(ori.player.xuid)
                    ? perm_Form.index(ori.player)
                    : noPermissions(ori.player)
                : out.error("获取玩家对象失败");
            break;
        case "op":
            if (ori.type !== 7) return out.error("Please on Console use this Command");
            plxuid = data.name2xuid(res.opname);
            logger.debug(Object.prototype.toString.call(plxuid), plxuid);
            if (plxuid == null || plxuid == "") {
                return out.error(`获取玩家[${res.opname}]的XUID失败!`);
            }
            if (perm.addOP(plxuid)) {
                logger.info(`已添加管理员: ${res.opname}`);
            } else {
                logger.error(`添加管理员失败，玩家${res.opname} 已是插件管理员`);
            }
            break;
        case "deop":
            if (ori.type !== 7) return out.error("Please on Console use this Command");
            plxuid = data.name2xuid(res.opname);
            logger.debug(Object.prototype.toString.call(plxuid), plxuid);
            if (plxuid == null || plxuid == "") {
                return out.error(`获取玩家[${res.opname}]的XUID失败!`);
            }
            if (perm.deOP(plxuid)) {
                logger.info(`已移除管理员: ${res.opname}`);
            } else {
                logger.error(`移除管理员失败，玩家${res.opname} 不是插件管理员`);
            }
            break;
        default:
            ori.player != null ? form.index(ori.player) : out.error("获取玩家对象失败");
            break;
    }
}
