//LiteLoaderScript Dev Helper
/// <reference path="c:\Users\Administrator\Documents\aids/dts/HelperLib-master/src/index.d.ts"/> 

/**
 *  注册插件
 */
const PLUGINS_NAME = "FakePlayer";
const PLUGINS_JS = `${PLUGINS_NAME} 模拟玩家`;
const PLUGINS_VERSION = [3, 0, 0];
const PLUGINS_ZZ = "PPOUI";
const PLUGINS_URL = "https://www.minebbs.com/resources/fp-gui.5031/";
ll.registerPlugin(
    /* name */ PLUGINS_NAME,
    /* introduction */ PLUGINS_JS,
    /* version */ PLUGINS_VERSION,
    /* otherInformation */ {
        "作者": PLUGINS_ZZ,
        "发布网站": PLUGINS_URL
    }
);
let Gm_Tell = `§e§l[§d${PLUGINS_NAME}§e]§r§b `;
if (File.exists(`.\\plugins\\${PLUGINS_ZZ}\\debug`)) {
    logger.setTitle(PLUGINS_NAME + ' Debug');
    logger.setLogLevel(5);
    logger.warn('你已开启Debug模式，将会输出Debug信息');
    Gm_Tell = `§e§l[§d${PLUGINS_NAME}§c Debug§e]§r§b `;
    mc.listen("onUseItemOn", (pl, it, bl, si) => {
        if (it.type == 'minecraft:arrow') {
            pl.runcmd("fp");
        }
    })
}

/**
 *  配置文件
 */
const FILE_PATH = `.\\Plugins\\${PLUGINS_ZZ}\\${PLUGINS_NAME}\\`;
const __init = {
    "_Config": {
        "time": 10,/* 循环时间 */
        "AutomaticOnline": true,/* 自动上线 */
        "InterceptDamage": true,/* 拦截伤害 */
        "AutomaticResurrection": true,/* 自动复活 */
        "NameRegx": "^[a-zA-Z0-9][a-zA-Z0-9\\s]*$",/* 模拟玩家正则 */
        "AddPrompt": "添加假人，名称仅允许英文、数字、空格\n%Error%"
    },
    "_Button": {
        "main": [
            {
                "name": "添加假人",
                "image": "textures/ui/color_plus"
            },
            {
                "name": "假人传送",
                "image": "textures/ui/FriendsIcon"
            },
            {
                "name": "假人管理",
                "image": "textures/ui/anvil_icon"
            },
            {
                "name": "模拟操作",
                "image": "textures/ui/dressing_room_animation"
            },
            {
                "name": "下线假人",
                "image": "textures/ui/flyingdescend"
            }
        ],
        "simulation": [
            {
                "name": "模拟朝向",
                "image": "textures/ui/icon_steve"
            },
            {
                "name": "模拟破坏",
                "image": "textures/ui/anvil_icon"
            },
            {
                "name": "模拟攻击",
                "image": "textures/ui/icon_recipe_equipment"
            },
            {
                "name": "模拟使用物品",
                "image": "textures/ui/icon_book_writable"
            }
        ],
        "DummyManagement": [
            {
                "name": "查看所有假人",
                "image": "textures/ui/icon_sign"
            },
            {
                "name": "上线所有假人",
                "image": "textures/ui/flyingascend_pressed"
            },
            {
                "name": "下线所有假人",
                "image": "textures/ui/flyingdescend_pressed"
            },
            {
                "name": "编辑假人",
                "image": "textures/ui/icon_setting"
            },
            {
                "name": "删除假人",
                "image": "textures/ui/icon_trash"
            }
        ]
    },
    "_USerData": {
        "op": [],
        "user": []
    }
}
/** 配置文件 */
const Config = data.openConfig(FILE_PATH + `Config.json`, 'json', JSON.stringify(__init._Config));
/** 用户文件 */
const User_Data = data.openConfig(FILE_PATH + `User.json`, 'json', JSON.stringify(__init._USerData));
/** 按钮文件 */
const Buttons = data.openConfig(FILE_PATH + 'Button.json', 'json', JSON.stringify(__init._Button));
function RELOAD_FILE() {
    Config.reload();
    User_Data.reload();
    Buttons.reload();
    Save_FP = JSON.parse(file.readFrom(Save_Path));
    return true;
}

/**
 *  缓存数组
 */
/**模拟破坏缓存 */
let _SIMULATED_DAMAGE = [];
/**模拟攻击缓存 */
let _SIMULATED_ATTACK = [];

/**
 *  注册命令
 */
//todo 2023/5/10 增强命令
const Cmd = mc.newCommand('fp', '模拟玩家GUI', PermType.Any);
Cmd.setEnum("ChangeAction", ["add", "remove"]);
Cmd.setEnum("ChangeAction_1", ["op", "user"]);
Cmd.setEnum("ListAction", ["reload", "k", "d", "a"]);
Cmd.mandatory("action", ParamType.Enum, "ChangeAction", 1);
Cmd.mandatory("action_1", ParamType.Enum, "ChangeAction_1", 1);
Cmd.optional("action", ParamType.Enum, "ListAction", 1);// 可选参数
Cmd.mandatory("name", ParamType.RawText);// 名称参数
Cmd.overload(["ChangeAction", "ChangeAction_1", "name"]);
Cmd.overload(["ListAction"]);
Cmd.setCallback((cmd, ori, out, res) => {
    logger.debug(cmd, ori, out, res);
    let op = User_Data.get('op'); let user = User_Data.get('user'); let xuid;
    switch (res.action) {
        case "add":// 添加
            if (ori.type !== 7) return out.error('此命令仅限控制台执行');
            switch (res.action_1) {
                case "op":
                    xuid = data.name2xuid(res.name);
                    if (op.indexOf(xuid) == -1) {
                        if (xuid == '') {
                            out.error(`获取玩家${res.name}的XUID失败！`);
                        } else {
                            out.success(`成功将玩家${res.name}添加为插件管理！`);
                            op.push(xuid);
                            User_Data.set('op', op);
                        }
                    } else {
                        out.error(`玩家${res.name}已是插件管理！`);
                    }
                    break;
                case "user":
                    xuid = data.name2xuid(res.name);
                    if (user.indexOf(xuid) == -1) {
                        if (xuid == '') {
                            out.error(`获取玩家${res.name}的XUID失败！`);
                        } else {
                            out.success(`成功将玩家${res.name}添加为子用户`);
                            user.push(xuid);
                            User_Data.set('user', user);
                        }
                    } else {
                        out.error(`玩家${res.name}已是子用户！`);
                    }
                    break;
            }
            break;
        case "remove":// 移除
            if (ori.type !== 7) return out.error('此命令仅限控制台执行');
            switch (res.action_1) {
                case "op":
                    xuid = data.name2xuid(res.name);
                    if (op.indexOf(xuid) == -1) {
                        out.error(`获取玩家${res.name}的XUID失败！`);
                    }
                    else {
                        op.splice(op.indexOf(xuid), 1);
                        User_Data.set('op', op);
                        out.success(`移除玩家${res.name}的管理权限成功！`);
                    }
                    break;
                case "user":
                    xuid = data.name2xuid(res.name);
                    if (user.indexOf(xuid) == -1) {
                        out.error(`获取玩家${res.name}的XUID失败！`);
                    }
                    else {
                        user.splice(user.indexOf(xuid), 1);
                        User_Data.set('user', user);
                        out.success(`移除玩家${res.name}的子用户权限成功！`);
                    }
                    break;
            }
            break;
        case "reload":// 重载
            if (ori.type !== 7) return out.error('此命令仅限控制台执行');
            RELOAD_FILE(); out.success('操作完成');
            break;
        case "k":// 下线所有
            if (ori.type !== 0) return out.error('此命令仅限玩家执行');
            if (!Other_Func.PERMISSION_CHECK(ori.player)) return out.error('无权限执行');
            mc.getOnlinePlayers().forEach(pl => {
                if (pl.isSimulatedPlayer()) {
                    SIMULATE_PLAYER_CORE.OFFLINE(pl.name);
                }
            })
            break;
        case "d":// 关闭所有模拟破坏 
            if (ori.type !== 0) return out.error('此命令仅限玩家执行');
            if (!Other_Func.PERMISSION_CHECK(ori.player)) return out.error('无权限执行');
            _SIMULATED_DAMAGE = [];
            break;
        case "a":// 关闭所有模拟攻击
            if (ori.type !== 0) return out.error('此命令仅限玩家执行');
            if (!Other_Func.PERMISSION_CHECK(ori.player)) return out.error('无权限执行');
            _SIMULATED_ATTACK = [];
            break;
        default:// 打开GUI
            if (ori.type !== 0) return out.error('此命令仅限玩家执行');
            if (!Other_Func.PERMISSION_CHECK(ori.player)) return out.error('无权限执行');
            if (op.indexOf(ori.player.xuid) !== -1) {
                GRAPHIC_FORM(ori.player);
            } else {
                if (user.indexOf(ori.player.xuid) !== -1) {
                    GRAPHIC_FORM(ori.player);
                } else {
                    ori.player.tell(Gm_Tell + '无权限执行')
                }
            }
            break;
    }
})
Cmd.setup();

/**
 *  图形表单
 */
function GRAPHIC_FORM(pl) {
    const fm = mc.newSimpleForm();
    fm.setTitle(PLUGINS_NAME);
    fm.setContent('· 请选择一个操作');
    Buttons.get('main').forEach(i => {
        fm.addButton(i.name, i.image);
    });
    pl.sendForm(fm, (pl, id) => {
        if (id == null) return Other_Func.Close_Tell(pl);
        switch (id) {
            case 0:
                (function (pl, err) {
                    const fm = mc.newCustomForm();
                    fm.setTitle(PLUGINS_NAME);
                    fm.addLabel(Config.get('AddPrompt').replace(/%Error%/g, err));
                    fm.addInput('输入玩家名称', 'String');
                    fm.addInput("目标坐标 X,Y,Z 请使用逗号分隔x,y,z坐标轴\n默认为当前坐标", "String X,Y,Z", `${pl.blockPos.x},${pl.blockPos.y},${pl.blockPos.z}`);
                    fm.addDropdown("选择目标维度", ["主世界", "地狱", "末地"], pl.blockPos.dimid);
                    pl.sendForm(fm, (pl, dt) => {
                        if (dt == null) return Other_Func.Close_Tell(pl);
                        let Reg = RegExp(Config.get('NameRegx'));
                        if (!Reg.test(dt[1])) return GO_ONLINE_UI(pl, "名称不合法！");
                        let pos = dt[2].split(',');
                        const IntBlockPos = new IntPos(Number(pos[0]), Number(pos[1]), Number(pos[2]), parseInt(dt[3]));
                        if (SIMULATE_PLAYER_CORE.GO_ONLINE(dt[1], IntBlockPos)) {
                            pl.tell(Gm_Tell + `上线假人<${dt[1]}>到<${IntBlockPos}>成功！`);
                            Other_Func.Write_Logs(pl.realName, '添加假人', dt[1], IntBlockPos)
                        }
                        CloseContinue(pl)
                    })
                })(pl, '')
                break;
            case 1:
                (function (pl) {
                    const simulatedPlayer = SIMULATE_PLAYER_CORE.GET_SIMULATION_PLAYER();
                    if (simulatedPlayer.length == 0) return pl.tell(Gm_Tell + "当前世界没有假人，无法继续操作");
                    const fm = mc.newCustomForm();
                    fm.setTitle(PLUGINS_NAME);
                    fm.addDropdown("选择一个模拟玩家", simulatedPlayer, 0);
                    fm.addInput(`目标坐标 X,Y,Z 请使用逗号分隔x,y,z坐标轴\n默认为当前坐标`, "String X,Y,Z", `${pl.blockPos.x},${pl.blockPos.y},${pl.blockPos.z}`);
                    fm.addDropdown("选择目标维度", ["主世界", "地狱", "末地"], pl.blockPos.dimid);
                    pl.sendForm(fm, (pl, dt) => {
                        if (dt == null) return Other_Func.Close_Tell(pl);
                        let pos = dt[1].split(',');
                        const IntBlockPos = new IntPos(Number(pos[0]), Number(pos[1]), Number(pos[2]), parseInt(dt[2]));
                        if (SIMULATE_PLAYER_CORE.DELIVERY(simulatedPlayer[dt[0]], IntBlockPos)) {
                            pl.tell(Gm_Tell + `成功将假人<${simulatedPlayer[dt[0]]}>传送到${IntBlockPos}`);
                            Other_Func.Write_Logs(pl.realName, '传送假人', simulatedPlayer[dt[0]], IntBlockPos)
                        } else {
                            pl.tell(Gm_Tell + `传送假人<${simulatedPlayer[dt[0]]}>失败`);
                        }
                        CloseContinue(pl)
                    })
                })(pl)
                break;
            case 2:/* 假人管理 */
                (function (pl) {
                    const fm = mc.newSimpleForm();
                    fm.setTitle(PLUGINS_NAME);
                    fm.setContent('· 请选择一个操作');
                    Buttons.get('DummyManagement').forEach(i => {
                        fm.addButton(i.name, i.image);
                    });
                    pl.sendForm(fm, (pl, id) => {
                        switch (id) {
                            case 0:/* 查看所有假人 */
                                (function (pl) {
                                    const tmp = JSON.parse(file.readFrom(Save_Path));
                                    const fm = mc.newCustomForm();
                                    fm.setTitle(PLUGINS_NAME);
                                    tmp.forEach(i => {
                                        const p1 = mc.getPlayer(i.name); let POS; let State = '否';
                                        if (p1) { POS = p1.blockPos; State = '是' } else { State = '否'; POS = new IntPos(i.pos.x, i.pos.y, i.pos.z, i.pos.dimid); }
                                        fm.addLabel(`[假人名称]  ${i.name}\n[坐标维度]  ${POS}\n[是否在线]  ${State}\n[自动上线]  ${boolToCNString(i.GoOnline)}\n[拦截伤害]  ${boolToCNString(i.Invincible)}\n[自动复活]  ${boolToCNString(i.Resurrection)}`)
                                    })
                                    pl.sendForm(fm, (pl, dt) => {
                                        if (dt == null) return Other_Func.Close_Tell(pl);
                                        CloseContinue(pl);
                                    })
                                })(pl)
                                break;
                            case 1:/* 上线所有假人 */
                                (function (pl) {
                                    const tmp = JSON.parse(file.readFrom(Save_Path));
                                    tmp.forEach(i => {
                                        const pos = new IntPos(i.pos.x, i.pos.y, i.pos.z, i.pos.dimid);
                                        if (SIMULATE_PLAYER_CORE.GO_ONLINE(i.name, pos)) {
                                            pl.tell(Gm_Tell + `上线 <${i.name}> 成功`)
                                        }
                                    })
                                    CloseContinue(pl)
                                })(pl)
                                break;
                            case 2:/* 下线所有假人 */
                                (function (pl) {
                                    mc.getOnlinePlayers().forEach(pl => {
                                        if (pl.isSimulatedPlayer()) {
                                            SIMULATE_PLAYER_CORE.OFFLINE(pl.name);
                                        }
                                    })
                                    CloseContinue(pl)
                                })(pl)
                                break;
                            case 3:/* 编辑假人 */
                                (function (pl) {
                                    let tmp = JSON.parse(file.readFrom(Save_Path));
                                    const fm = mc.newSimpleForm();
                                    fm.setTitle(PLUGINS_NAME);
                                    fm.setContent(`· 选择一个假人`);
                                    tmp.forEach(i => {
                                        fm.addButton(`[名称] ${i.name}`);
                                    });
                                    pl.sendForm(fm, (pl, id) => {
                                        if (id == null) return Other_Func.Close_Tell(pl);
                                        const p1 = mc.getPlayer(tmp[id].name); let POS; let State = '否';
                                        if (p1) { POS = p1.blockPos; State = '是' } else { State = '否'; POS = new IntPos(tmp[id].pos.x, tmp[id].pos.y, tmp[id].pos.z, tmp[id].pos.dimid); }
                                        pl.sendModalForm(PLUGINS_NAME, `[假人名称]  ${tmp[id].name}\n[坐标维度]  ${POS}\n[是否在线]  ${State}\n[自动上线]  ${boolToCNString(tmp[id].GoOnline)}\n[拦截伤害]  ${boolToCNString(tmp[id].Invincible)}\n[自动复活]  ${boolToCNString(tmp[id].Resurrection)}`, '编辑', '返回', (pl, res) => {
                                            switch (res) {
                                                case true:
                                                    (function (pl) {
                                                        const fm = mc.newCustomForm()
                                                        fm.setTitle(PLUGINS_NAME)
                                                        fm.addInput("假人名称", "String", tmp[id].name)
                                                        fm.addSwitch("自动上线", Boolean(tmp[id].GoOnline).valueOf())
                                                        fm.addSwitch("拦截伤害", Boolean(tmp[id].Invincible).valueOf())
                                                        fm.addSwitch("自动复活", Boolean(tmp[id].Resurrection).valueOf())
                                                        fm.addInput("假人坐标 [使用英文逗号分隔坐标]", "String X,Y,Z", tmp[id].pos.x + ',' + tmp[id].pos.y + ',' + tmp[id].pos.z);
                                                        fm.addDropdown("坐标维度", ['主世界', "地狱", "末地"], parseInt(tmp[id].pos.dimid));
                                                        pl.sendForm(fm, (pl, dt) => {
                                                            if (dt == null) return Other_Func.Close_Tell(pl);
                                                            /* 处理数据 */
                                                            const Input_IntPos_Array = dt[4].split(',');
                                                            const IntPut_POS = new IntPos(Number(Input_IntPos_Array[0]), Number(Input_IntPos_Array[1]), Number(Input_IntPos_Array[2]), parseInt(dt[5]));
                                                            const data = {
                                                                "name": dt[0],
                                                                "GoOnline": Boolean(dt[1]).valueOf(),
                                                                "Invincible": Boolean(dt[2]).valueOf(),
                                                                "Resurrection": Boolean(dt[3]).valueOf(),
                                                                "pos": {
                                                                    "x": IntPut_POS.x,
                                                                    "y": IntPut_POS.y,
                                                                    "z": IntPut_POS.z,
                                                                    "dimid": IntPut_POS.dimid
                                                                }
                                                            }
                                                            /* 更新/保存数据 */
                                                            const BackUP = tmp[id];
                                                            tmp[id] = data;
                                                            file.writeTo(Save_Path, JSON.stringify(tmp, null, '\t'));
                                                            Save_FP = JSON.parse(file.readFrom(Save_Path));
                                                            /* 询问重新上线 */
                                                            if (JSON.stringify(data) !== JSON.stringify(BackUP)) {
                                                                pl.sendModalForm(PLUGINS_NAME, `检测到假人数据变更\n是否重新上线假人？`, '重新上线', '放弃并返回主页', (pl, res) => {
                                                                    switch (res) {
                                                                        case true:
                                                                            if (mc.getPlayer(BackUP.name).simulateDisconnect()) {
                                                                                setTimeout(() => {// 延迟200毫秒，防止名称重复
                                                                                    mc.spawnSimulatedPlayer(
                                                                                        data.name,
                                                                                        IntPut_POS
                                                                                    );
                                                                                }, 200)
                                                                            }
                                                                            break;
                                                                        case false:
                                                                            GRAPHIC_FORM(pl);
                                                                            break;
                                                                        default:
                                                                            return Other_Func.Close_Tell(pl);
                                                                    }
                                                                })
                                                            } else {
                                                                CloseContinue(pl);
                                                            }
                                                        })
                                                    })(pl)
                                                    break;
                                                case false:
                                                    GRAPHIC_FORM(pl);
                                                    break;
                                                default:
                                                    return Other_Func.Close_Tell(pl);
                                            }
                                        })
                                    })
                                })(pl)
                                break;
                            case 4:/* 删除假人 */
                                (function (pl) {
                                    let tmp = JSON.parse(file.readFrom(Save_Path));
                                    const fm = mc.newSimpleForm();
                                    fm.setTitle(PLUGINS_NAME);
                                    fm.setContent(`· 选择一个假人`);
                                    tmp.forEach(i => {
                                        fm.addButton(`[名称] ${i.name}`);
                                    });
                                    pl.sendForm(fm, (pl, id) => {
                                        if (id == null) return Other_Func.Close_Tell(pl);
                                        const p1 = mc.getPlayer(tmp[id].name); let POS; let State = '否';
                                        if (p1) { POS = p1.blockPos; State = '是' } else { State = '否'; POS = new IntPos(tmp[id].pos.x, tmp[id].pos.y, tmp[id].pos.z, tmp[id].pos.dimid); }
                                        pl.sendModalForm(PLUGINS_NAME, `[假人名称]  ${tmp[id].name}\n[坐标维度]  ${POS}\n[是否在线]  ${State}\n[自动上线]  ${boolToCNString(tmp[id].GoOnline)}\n[拦截伤害]  ${boolToCNString(tmp[id].Invincible)}\n[自动复活]  ${boolToCNString(tmp[id].Resurrection)}`, '确认删除', '返回', (pl, res) => {
                                            switch (res) {
                                                case true:
                                                    (function (pl) {
                                                        /* 更新/保存数据 */
                                                        const BackUP = tmp[id];
                                                        tmp.splice(id, 1);
                                                        file.writeTo(Save_Path, JSON.stringify(tmp, null, '\t'));
                                                        Save_FP = JSON.parse(file.readFrom(Save_Path));
                                                        /* 询问下线 */
                                                        if (JSON.stringify(tmp[id]) !== JSON.stringify(BackUP)) {
                                                            pl.sendModalForm(PLUGINS_NAME, `假人已删除\n是否重新下线此假人？`, '下线', '放弃并返回主页', (pl, res) => {
                                                                switch (res) {
                                                                    case true:
                                                                        if (mc.getPlayer(BackUP.name).simulateDisconnect()) {
                                                                            pl.tell(Gm_Tell + `下线${BackUP.name}成功！`)
                                                                        }
                                                                        break;
                                                                    case false:
                                                                        GRAPHIC_FORM(pl);
                                                                        break;
                                                                    default:
                                                                        return Other_Func.Close_Tell(pl);
                                                                }
                                                            })
                                                        } else {
                                                            CloseContinue(pl);
                                                        }
                                                    })(pl)
                                                    break;
                                                case false:
                                                    GRAPHIC_FORM(pl);
                                                    break;
                                                default:
                                                    return Other_Func.Close_Tell(pl);
                                            }
                                        })
                                    })
                                })(pl)
                                break;
                            default:
                                return Other_Func.Close_Tell(pl);
                        }
                    })
                })(pl)
                break;
            case 3://模拟操作
                (function (pl) {
                    // todo 优化表单
                    const bt = Buttons.get('simulation');
                    const fm = mc.newSimpleForm();
                    fm.setTitle(PLUGINS_NAME);
                    fm.setContent('· 请选择一个操作');
                    bt.forEach(i => {
                        fm.addButton(i.name, i.image);
                    });
                    pl.sendForm(fm, (pl, id) => {
                        if (id == null) return Other_Func.Close_Tell(pl);
                        switch (id) {
                            case 0://模拟朝向
                                (function (pl) {
                                    const simulatedPlayer = SIMULATE_PLAYER_CORE.GET_SIMULATION_PLAYER();
                                    if (simulatedPlayer.length == 0) return pl.tell(Gm_Tell + "当前世界没有假人，无法继续操作");
                                    const fm = mc.newCustomForm();
                                    fm.setTitle(PLUGINS_NAME);
                                    fm.addDropdown("选择一个模拟玩家", simulatedPlayer, 0);
                                    pl.sendForm(fm, (pl, dt) => {
                                        if (dt == null) return Other_Func.Close_Tell(pl);
                                        if (SIMULATE_PLAYER_CORE.ORIENTATION(simulatedPlayer[dt[0]], pl.blockPos)) {
                                            pl.tell(Gm_Tell + '设置<' + simulatedPlayer[dt[0]] + '>的模拟朝向成功！')
                                            Other_Func.Write_Logs(pl.realName, '模拟朝向', simulatedPlayer[dt[0]], pl.blockPos)
                                        }
                                    })
                                })(pl)
                                break;
                            case 1://模拟破坏
                                (function (pl) {
                                    const simulatedPlayer = SIMULATE_PLAYER_CORE.GET_SIMULATION_PLAYER();
                                    if (simulatedPlayer.length == 0) return pl.tell(Gm_Tell + "当前世界没有假人，无法继续操作");
                                    const fm = mc.newCustomForm();
                                    fm.setTitle(PLUGINS_NAME);
                                    fm.addDropdown("选择一个模拟玩家", simulatedPlayer, 0);
                                    fm.addSwitch("开启 <=>关闭", false);
                                    pl.sendForm(fm, (pl, dt) => {
                                        if (dt == null) return Other_Func.Close_Tell(pl);
                                        if (!dt[1]) {
                                            if (_SIMULATED_DAMAGE.indexOf(simulatedPlayer[dt[0]]) == -1) {
                                                _SIMULATED_DAMAGE.push(simulatedPlayer[dt[0]]);
                                                pl.tell(Gm_Tell + `开启 < ${simulatedPlayer[dt[0]]}> 的模拟破坏成功！`)
                                                Other_Func.Write_Logs(pl.realName, '开启模拟破坏', simulatedPlayer[dt[0]])
                                            } else {
                                                pl.tell(Gm_Tell + '请勿重复开启模拟破坏！')
                                            }
                                        }
                                        else {
                                            //移除
                                            if (_SIMULATED_DAMAGE.indexOf(simulatedPlayer[dt[0]]) == -1) {
                                                pl.tell(Gm_Tell + `${simulatedPlayer[dt[0]]} 未开启模拟破坏！`)
                                            } else {
                                                _SIMULATED_DAMAGE.splice(_SIMULATED_DAMAGE.indexOf(simulatedPlayer[dt[1]]), 1)
                                                pl.tell(Gm_Tell + `关闭 < ${simulatedPlayer[dt[0]]}> 的模拟破坏成功！`)
                                                Other_Func.Write_Logs(pl.realName, '关闭模拟破坏', simulatedPlayer[dt[0]])
                                            }
                                        }
                                    })
                                })(pl)
                                break;
                            case 2://模拟攻击
                                (function (pl) {
                                    const simulatedPlayer = SIMULATE_PLAYER_CORE.GET_SIMULATION_PLAYER();
                                    if (simulatedPlayer.length == 0) return pl.tell(Gm_Tell + "当前世界没有假人，无法继续操作");
                                    const fm = mc.newCustomForm();
                                    fm.setTitle(PLUGINS_NAME);
                                    fm.addDropdown("选择一个模拟玩家", simulatedPlayer, 0);
                                    fm.addSwitch("开启 <=>关闭", false);
                                    pl.sendForm(fm, (pl, dt) => {
                                        if (dt == null) return Other_Func.Close_Tell(pl);
                                        if (!dt[1]) {
                                            if (_SIMULATED_ATTACK.indexOf(simulatedPlayer[dt[0]]) == -1) {
                                                _SIMULATED_ATTACK.push(simulatedPlayer[dt[0]])
                                                pl.tell(Gm_Tell + `开启 < ${simulatedPlayer[dt[0]]}> 的模拟攻击成功！`)
                                                Other_Func.Write_Logs(pl.realName, '开启模拟攻击', simulatedPlayer[dt[0]])
                                            } else {
                                                pl.tell(Gm_Tell + '请勿重复开启模拟攻击！')
                                            }
                                        } else {
                                            if (_SIMULATED_ATTACK.indexOf(simulatedPlayer[dt[0]]) == -1) {
                                                pl.tell(Gm_Tell + `${simulatedPlayer[dt[0]]} 未开启模拟攻击！`)
                                            } else {
                                                _SIMULATED_ATTACK.splice(_SIMULATED_ATTACK.indexOf(simulatedPlayer[dt[0]]), 1)
                                                pl.tell(Gm_Tell + `关闭 < ${simulatedPlayer[dt[0]]}> 的模拟攻击成功！`)
                                                Other_Func.Write_Logs(pl.realName, '关闭模拟攻击', simulatedPlayer[dt[0]])
                                            }
                                        }
                                    })
                                })(pl)
                                break;
                            case 3://模拟使用物品
                                (function (pl) {
                                    const simulatedPlayer = SIMULATE_PLAYER_CORE.GET_SIMULATION_PLAYER();
                                    if (simulatedPlayer.length == 0) return pl.tell(Gm_Tell + "当前世界没有假人，无法继续操作");
                                    const fm = mc.newCustomForm();
                                    fm.setTitle(PLUGINS_NAME);
                                    fm.addDropdown("选择一个模拟玩家", simulatedPlayer, 0);
                                    pl.sendForm(fm, (pl, dt) => {
                                        if (dt == null) return Other_Func.Close_Tell(pl);
                                        if (mc.getPlayer(simulatedPlayer[dt[0]]).simulateUseItem()) {
                                            pl.tell(Gm_Tell + '使用成功！')
                                            Other_Func.Write_Logs(pl.realName, '模拟使用物品', simulatedPlayer[dt[0]])
                                        } else {
                                            pl.tell(Gm_Tell + '使用失败！')
                                        }
                                    })
                                })(pl)
                                break;
                        }
                    })
                })(pl)
                break;
            case 4:
                (function (pl) {
                    SelectSimulatedPlayer(pl, id => {
                        if (SIMULATE_PLAYER_CORE.OFFLINE(id)) {
                            _SIMULATED_DAMAGE.splice(_SIMULATED_DAMAGE.indexOf(id), 1);
                            _SIMULATED_ATTACK.splice(_SIMULATED_ATTACK.indexOf(id), 1);
                            pl.tell(Gm_Tell + `下线假人 <${id}> 成功！`);
                            Other_Func.Write_Logs(pl.realName, '下线假人', id)
                        } else {
                            pl.tell(Gm_Tell + `下线假人 <${id}> 失败！`);
                        }
                    })
                })(pl)
                break;
        }
    })
    /**
     * 是否继续
     * @param {*} pl 
     */
    const CloseContinue = (pl) => {
        pl.sendModalForm(PLUGINS_NAME, "操作完成 是否继续？", "返回主菜单", "放弃表单", (pl, res) => {
            switch (res) {
                case true:
                    GRAPHIC_FORM(pl);
                    break;
                default:
                    return Other_Func.Close_Tell(pl);
            }
        })
    }
    /**
     * 布尔类型或数字类型转是否
     * @param {*} bool  
     * @returns 
     */
    function boolToCNString(bool) {
        if (bool === true || bool === 1) {
            return "是";
        } else if (bool === false || bool === 0) {
            return "否";
        } else {
            return "[错误]输入值不为布尔类型或数字类型！";
        }
    }
    /**
     * @param {*} pl 玩家对象
     * @param {*} callback 回调 名称
     * @returns 
     */
    function SelectSimulatedPlayer(pl, callback) {
        const SimulatedPlayer = SIMULATE_PLAYER_CORE.GET_SIMULATION_PLAYER();
        if (SimulatedPlayer.length == 0) return pl.tell(Gm_Tell + "当前世界没有假人，无法继续操作");
        const fm = mc.newSimpleForm();
        fm.setTitle(PLUGINS_NAME);
        fm.setContent('· 请选择一个假人');
        SimulatedPlayer.forEach(i => {
            fm.addButton(i);
        });
        pl.sendForm(fm, (pl, id) => {
            if (id == null) return Other_Func.Close_Tell(pl);
            callback(SimulatedPlayer[id]);
        })
    }
}

/**
 *  模拟增强
 */

let Save_FP = [];
const Save_Path = FILE_PATH + 'Save_FakePlayer.json';
if (!file.exists(Save_Path)) {
    file.writeTo(Save_Path, '[]');
}
Save_FP = JSON.parse(file.readFrom(Save_Path))

/* 自动上线 */
mc.listen('onServerStarted', () => {
    if (Boolean(Config.get('AutomaticOnline')).valueOf()) {
        const Save_FP = JSON.parse(file.readFrom(Save_Path))
        for (let i = 0; i < Save_FP.length; i++) {
            if (Save_FP[i].GoOnline) {
                const INTBLOCKPOS = new IntPos(
                    Number(Save_FP[i].pos.x),
                    Number(Save_FP[i].pos.y),
                    Number(Save_FP[i].pos.z),
                    parseInt(Save_FP[i].pos.dimid)
                )
                if (mc.getPlayer(Save_FP[i].name)) return false;
                SIMULATE_PLAYER_CORE.GO_ONLINE(Save_FP[i].name, INTBLOCKPOS);
            }
        }
    }
})

/* 死亡自动复活 */
mc.listen("onPlayerDie", (pl, sou) => {
    if (Boolean(Config.get('InterceptDamage')).valueOf()) {
        if (pl.isSimulatedPlayer()) {
            const index = Save_FP.findIndex(i => i.name === pl.name);
            if (index !== -1) {
                if (Boolean(Save_FP[index].Resurrection).valueOf()) {
                    Other_Func.Write_Logs('', '假人死亡', pl.realName, '')
                    const tmp = {
                        "name": pl.name,
                        "x": pl.blockPos.x,
                        "y": pl.blockPos.y,
                        "z": pl.blockPos.z,
                        "dimid": pl.blockPos.dimid
                    };
                    if (pl.simulateDisconnect()) {
                        setTimeout(() => {// 延迟200毫秒，防止名称重复
                            mc.spawnSimulatedPlayer(
                                tmp.name,
                                Number(tmp.x),
                                Number(tmp.y),
                                Number(tmp.z),
                                parseInt(tmp.dimid),
                            );
                        }, 200)
                    }
                }
            }
        }
    }
})

/* 假人无敌 */
mc.listen("onMobHurt", function (mob, source, damage, cause) {
    if (Boolean(Config.get('InterceptDamage')).valueOf()) {
        if (mob.isPlayer()) {
            const pl = mc.getPlayer(mob.uniqueId);
            if (pl.isSimulatedPlayer) {
                const index = Save_FP.findIndex(i => i.name === pl.name);
                if (index !== -1) {
                    if (Boolean(Save_FP[index].Invincible).valueOf()) {
                        return false;
                    }
                }
            }
        }
    }
})

setInterval(() => {//持续破坏
    if (_SIMULATED_DAMAGE.length == 0) return false;
    for (let i of _SIMULATED_DAMAGE) {
        mc.getPlayer(i).simulateDestroy()
    }
}, Config.get('time'))
setInterval(() => {//持续攻击
    if (_SIMULATED_ATTACK.length == 0) return false;
    for (let i of _SIMULATED_ATTACK) {
        mc.getPlayer(i).simulateAttack()
    }
}, Config.get('time'))


/**
 *  模拟核心
 */
const SIMULATE_PLAYER_CORE = {
    /**
     * 获取所有模拟玩家
     * @returns Arry
     */
    GET_SIMULATION_PLAYER() {
        let simulatedPlayer = [];
        mc.getOnlinePlayers().forEach(pl => {
            if (pl.isSimulatedPlayer()) simulatedPlayer.push(pl.name);
        })
        return simulatedPlayer;
    },
    /**
     * 上线模拟玩家
     * @param {String} name 模拟玩家名称
     * @param {String} pos 上线坐标
     * @returns true-成功 false-失败 null-参数缺少
     */
    GO_ONLINE(name, pos) {
        if (name == null || pos == null) return null;
        if (mc.getPlayer(name)) return null;
        if (mc.spawnSimulatedPlayer(name, pos)) {
            (function () {
                Save_FP = JSON.parse(file.readFrom(Save_Path));
                if (Save_FP.find(i => i.name === name)) return;
                Save_FP.push({
                    "name": name,
                    "GoOnline": true,/* 上线 */
                    "Invincible": true,/* 无敌 */
                    "Resurrection": true,/* 复活 */
                    "pos": {
                        "x": pos.x,
                        "y": pos.y,
                        "z": pos.z,
                        "dimid": pos.dimid
                    }
                })
                file.writeTo(Save_Path, JSON.stringify(Save_FP, null, "\t"))
            })()
            return true;
        } else {
            return false;
        }
    },
    /**
     * 下线模拟玩家
     * @param {String} name 模拟玩家名称
     * @returns true-成功 false-失败 null-参数缺少
     */
    OFFLINE(name) {
        if (!mc.getPlayer(name).isSimulatedPlayer()) return false;
        if (name == null) return null;
        if (mc.getPlayer(name).simulateDisconnect()) {
            mc.broadcast(`§e${name} 退出了游戏`);
            return true;
        } else {
            return false;
        }
    },
    /**
     * 传送模拟玩家
     * @param {String} name 模拟玩家名称
     * @param {String} pos 传送坐标
     * @returns true-成功 false-失败 null-参数缺少
     */
    DELIVERY(name, pos) {
        if (!mc.getPlayer(name).isSimulatedPlayer()) return false;
        if (name == null || pos == null) return null;
        if (mc.getPlayer(name).teleport(pos)) {
            if (Config.get('Save_FakePlayer')) {
                tmp = JSON.parse(file.readFrom(Save_Path))
                let new_pos = {
                    "x": pos.x,
                    "y": pos.y,
                    "z": pos.z,
                    "dimid": pos.dimid
                }
                for (let i = 0; i < tmp.length; i++) {
                    if (name == tmp[i].name) {
                        tmp[i].pos = new_pos
                        file.writeTo(Save_Path, JSON.stringify(tmp, null, "\t"));
                        break;
                    }
                }
            }
            return true;
        } else {
            return false;
        }
    },
    /**
     * 设置模拟玩家朝向
     * @param {String} name 模拟玩家名称
     * @param {String} pos 传送坐标
     * @returns true-成功 false-失败 null-参数缺少
     */
    ORIENTATION(name, pos) {
        if (!mc.getPlayer(name).isSimulatedPlayer()) return false;
        if (name == null || pos == null) return null;
        if (mc.getPlayer(name).simulateLookAt(pos)) {
            return true;
        } else {
            return false;
        }
    }
}

/**
 *  其他功能
 */
const Other_Func = {
    /**
     * 权限检查
     * @param {*} pl 玩家对象
     * @returns 
     */
    PERMISSION_CHECK(pl) {
        const tmp = User_Data.get('op')
        if (tmp.indexOf(pl.xuid) !== -1) {
            return true
        }
        else {
            return false
        }
    },
    /**
     * 关闭表单提示
     * @param {*} pl 玩家
     */
    Close_Tell(pl) {
        pl.tell(Gm_Tell + '表单已放弃')
    },
    /**
     * 输出日志到CSV
     * @param {*} player 触发主体
     * @param {*} str 事件
     * @param {*} pls 目标假人
     * @param {*} fj 附加信息
     */
    Write_Logs(player, str, pls, fj) {
        const Log_File = `.\\logs\\${PLUGINS_NAME}.csv`;/*日志文件路径*/
        const write = `时间, 触发玩家, 事件, 目标模拟玩家, 附加信息` + '\n';//预写入内容
        if (!File.exists(Log_File)) {
            File.writeTo(Log_File, write);
            logger.warn(`File < ${PLUGINS_NAME}.csv > does not exist, creating file...`);
        };
        logger.info(`${player} ${str} ${pls} ${fj}`);
        File.writeLine(Log_File, `${system.getTimeStr()}, ${player}, ${str}, ${pls}, ${fj}`);
    }
}