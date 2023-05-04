//LiteLoaderScript Dev Helper
/// <reference path="c:\Users\Administrator\Documents\aids/dts/HelperLib-master/src/index.d.ts"/>

/*
mc.listen("onUseItemOn", (pl, it, bl, si) => {
    if (it.type == 'minecraft:arrow') {
        pl.runcmd("fp")
    }
})*/


const PLUGINS_NAME = "FP";
const PLUGINS_JS = `${PLUGINS_NAME} 模拟玩家`;
const PLUGINS_VERSION = [2, 1, 0];
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

const _inits = {
    "Config": {
        "time": 20
    },
    "USerData": {
        "op": [],
        "user": []
    }
}

const Path = `.\\Plugins\\${PLUGINS_ZZ}\\${PLUGINS_NAME}\\`;
let Config = data.openConfig(Path + `Config.json`, 'json', JSON.stringify(_inits.Config));
let User_Data = data.openConfig(Path + `User.json`, 'json', JSON.stringify(_inits.USerData));
// 设置重载
function Reloads() {
    Config.reload();
    User_Data.reload();
    logger.info('重载完成')
};

let _Destory = [];//模拟破坏
let _Att = [];//模拟攻击
let _USE_ITEMS = [];//模拟物品

// 注册真命令
const Cmd = mc.newCommand('fp', '模拟玩家GUI', PermType.Any);
Cmd.setEnum("ChangeAction", ["add", "remove"]);
Cmd.setEnum("ListAction", ["reload", "k", "d", "a"]);
Cmd.mandatory("action", ParamType.Enum, "ChangeAction", 1);
Cmd.optional("action", ParamType.Enum, "ListAction", 1);
Cmd.mandatory("name", ParamType.RawText);
Cmd.overload(["ChangeAction", "name"]);
Cmd.overload(["ListAction"]); Cmd.setCallback((cmd, ori, out, res) => {
    let tmp = User_Data.get('op'); let plxuid; let tmp1 = User_Data.get('user')
    switch (res.action) {
        case "add"://添加
            if (ori.type !== 7) return out.error('此命令仅限控制台执行')
            switch (res.name.split(' ')[0]) {
                case "o":// op
                    plxuid = data.name2xuid(res.name.split(' ')[1])
                    if (tmp.indexOf(plxuid) == -1) {
                        if (plxuid == '') {
                            out.error(`获取玩家${res.name.split(' ')[1]}的XUID失败！`)
                        }
                        else {
                            out.success('成功将玩家' + res.name.split(' ')[1] + '添加为插件管理')
                            tmp.push(plxuid)
                            User_Data.set('op', tmp)
                        }
                    }
                    else {
                        out.error('玩家' + res.name.split(' ')[1] + '已是插件管理！')
                    }
                    break;
                case "u":// 子用户
                    plxuid = data.name2xuid(res.name.split(' ')[1])
                    if (tmp1.indexOf(plxuid) == -1) {
                        if (plxuid == '') {
                            out.error(`获取玩家${res.name.split(' ')[1]}的XUID失败！`)
                        }
                        else {
                            out.success('成功将玩家' + res.name.split(' ')[1] + '添加为子用户')
                            tmp1.push(plxuid)
                            User_Data.set('user', tmp1)
                        }
                    }
                    else {
                        out.error('玩家' + res.name.split(' ')[1] + '已是子用户！')
                    }
                    break;
                default:
                    out.error('命令格式错误! fp add {o/u} {玩家名}')
                    break;
            }
            break;
        case "remove"://删除
            if (ori.type !== 7) return out.error('此命令仅限控制台执行')
            switch (res.name.split(' ')[0]) {
                case "o":// op
                    plxuid = data.name2xuid(res.name.split(' ')[1])
                    if (tmp.indexOf(plxuid) == -1) {
                        out.error(`玩家${res.name.split(' ')[1]}不是插件管理，获取XUID失败！`)
                    }
                    else {
                        tmp.splice(tmp.indexOf(plxuid), 1)
                        User_Data.set('op', tmp)
                        out.success('移除玩家' + res.name.split(' ')[1] + '的管理权限成功！')
                    }
                    break;
                case "u":// 子用户
                    plxuid = data.name2xuid(res.name.split(' ')[1])
                    if (tmp1.indexOf(plxuid) == -1) {
                        out.error(`玩家${res.name.split(' ')[1]}不是插件管理，获取XUID失败！`)
                    }
                    else {
                        tmp1.splice(tmp1.indexOf(plxuid), 1)
                        User_Data.set('user', tmp1)
                        out.success('移除玩家' + res.name.split(' ')[1] + '的子用户权限成功！')
                    }
                    break;
                default:
                    out.error('命令格式错误! fp remove {o/u} {玩家名}')
                    break;
            }
            break;
        case "reload"://重载
            if (ori.type !== 7) return out.error('此命令仅限控制台执行')
            Reloads();
            out.success('重载完成')
            break;
        case "d":// 关闭所有模拟破坏 
            if (ori.type !== 0) return out.error('此命令仅限玩家执行')
            if (!qx(ori.player)) return out.error('无权限执行')
            _Destory = [];
            break;
        case "k":// 下线所有
            if (ori.type !== 0) return out.error('此命令仅限玩家执行')
            if (!qx(ori.player)) return out.error('无权限执行')
            mc.getOnlinePlayers().forEach(pl => {
                if (pl.isSimulatedPlayer()) {
                    let ttmp = pl.name;//缓存ID防止空值
                    if (pl.simulateDisconnect()) {
                        mc.broadcast('§e' + ttmp + ' 退出了游戏')
                    }
                }
            })
            break;
        case "a":// 关闭所有模拟攻击
            if (ori.type !== 0) return out.error('此命令仅限玩家执行')
            if (!qx(ori.player)) return out.error('无权限执行')
            _Att = [];
            break;
        default:// 打开GUI
            if (ori.type !== 0) return out.error('此命令仅限玩家执行');
            if (tmp.indexOf(ori.player.xuid) !== -1) {
                MainGUI(ori.player)
            }
            else {
                if (tmp1.indexOf(ori.player.xuid) !== -1) {
                    MainGUI(ori.player)
                }
                else {
                    ori.player.tell(GM_Tell + '无权限访问！')
                }
            }
            break;
    }
})
Cmd.setup();

//主界面
function MainGUI(pl) {
    let fm = mc.newSimpleForm()
    fm.setTitle(`${PLUGINS_JS}`)
    fm.setContent("选择一项操作")
    fm.addButton("添加假人", "textures/ui/book_addtextpage_default.png")  //0
    fm.addButton('假人传送', "textures/ui/item_container_transfer_mode.png")  //1
    fm.addButton('模拟朝向', "textures/ui/icon_steve.png")  //2
    fm.addButton('模拟破坏', "textures/ui/anvil_icon.png")  //3
    fm.addButton('模拟攻击', "textures/ui/icon_recipe_equipment")//4
    fm.addButton('模拟使用物品');//5
    fm.addButton("下线假人", "textures/ui/icon_trash.png")  //6
    pl.sendForm(fm, (pl, id) => {
        if (id == null) { Close_Tell(pl) }
        if (id == null) { return null }
        switch (id) {
            case 0:
                add_ui(pl);
                //添加假人
                function add_ui(pl) {
                    var fm = mc.newCustomForm()
                        .setTitle(`${PLUGINS_JS}`)
                        .addLabel('请勿随意添加无用假人')
                        .addInput("输入要添加的假人ID\n建议使用英文或拼音首字母", "ID")
                        .addSwitch("确认", false)
                    pl.sendForm(fm, (pl, data) => {
                        if (data == null) { return Close_Tell(pl) }
                        if (data[2] == 1) {
                            if (data[1] == '') {
                                pl.tell(GM_Tell + '输入框为空！')
                            }
                            else {
                                Fake_UP(pl, data[1])
                            }
                        }
                        else {
                            add_ui(pl)
                        }
                    })
                }
                break;
            case 1:
                tp_ui(pl);
                //功能-传送
                function tp_ui(pl) {
                    let Online_Players = []//获取所有在线玩家
                    mc.getOnlinePlayers().forEach(pl => {
                        if (pl.isSimulatedPlayer()) {
                            Online_Players.push(pl.name)
                        }
                    })
                    let fm_tp = mc.newCustomForm()
                    fm_tp.setTitle(`${PLUGINS_JS}`)
                    fm_tp.addLabel('注意：仅限选择假人')
                    fm_tp.addDropdown('选择一个模拟玩家', Online_Players, 0)
                    fm_tp.addSwitch('确认', false)
                    pl.sendForm(fm_tp, (pl, data) => {
                        if (data == null) { return Close_Tell(pl) }
                        if (data[2] == 1) {
                            Fake_TP(pl, Online_Players[data[1]])
                        }
                        else {
                            Close_Tell(pl)
                        }
                    })
                }
                break;
            case 2:
                look_ui(pl);
                //看脚下方块
                function look_ui(pl) {
                    let Online_Players = []//获取所有在线玩家
                    mc.getOnlinePlayers().forEach(pl => {
                        if (pl.isSimulatedPlayer()) {
                            Online_Players.push(pl.name)
                        }
                    })
                    let fm = mc.newCustomForm()
                        .setTitle(`${PLUGINS_JS}`)
                        .addLabel('看向脚下方块')
                        .addDropdown('选择一个模拟玩家', Online_Players, 0)
                        .addSwitch('确认')
                    pl.sendForm(fm, (pl, data) => {
                        if (data == null) { return Close_Tell(pl) }
                        if (data[2] == 1) {
                            Fake_Look(pl, Online_Players[data[1]])
                        }
                        else {
                            look_ui(pl)
                        }
                    })
                }
                break;
            case 3:
                block_ui(pl)
                //功能-破坏开
                function block_ui(pl) {
                    let Online_Players = []//获取所有在线玩家
                    mc.getOnlinePlayers().forEach(pl => {
                        if (pl.isSimulatedPlayer()) {
                            Online_Players.push(pl.name)
                        }
                    })
                    let fm = mc.newCustomForm()
                        .setTitle(`${PLUGINS_JS}`)
                        .addLabel('警告：使用前请确认朝向是否正确！')
                        .addDropdown('选择一个模拟玩家', Online_Players, 0)
                        .addStepSlider('切换', ['开启', '关闭'])
                        .addSwitch('确认')
                    pl.sendForm(fm, (pl, data) => {
                        if (data == null) { return Close_Tell(pl) }
                        if (data[3] == 1) {
                            let tmp_jr = mc.getPlayer(Online_Players[data[1]]).isSimulatedPlayer()
                            if (tmp_jr == 1) {
                                if (data[2] == 0) {
                                    if (_Destory.indexOf(Online_Players[data[1]]) == -1) {
                                        _Destory.push(Online_Players[data[1]]);
                                        pl.tell(GM_Tell + Online_Players[data[1]] + '开启模拟破坏成功！');
                                        Write_Logs(pl.realName, `开启模拟破坏`, Online_Players[data[1]], '');
                                    }
                                    else {
                                        pl.tell(GM_Tell + '请勿重复开启模拟破坏！')
                                    }
                                }
                                else {
                                    //移除
                                    if (_Destory.indexOf(Online_Players[data[1]]) == -1) {
                                        pl.tell(`${Online_Players[data[1]]}未开启模拟破坏！`)
                                    }
                                    else {
                                        _Destory.splice(_Destory.indexOf(Online_Players[data[1]]), 1)
                                        pl.tell('关闭' + Online_Players[data[1]] + '的模拟破坏成功！')
                                        Write_Logs(pl.realName, `关闭模拟破坏`, Online_Players[data[1]], '')
                                    }
                                }
                            }
                            else {
                                pl.tell(GM_Tell + Online_Players[data[1]] + '不是模拟玩家！')
                            }
                        }
                        else {
                            block_ui(pl)
                        }
                    })
                }
                break;
            case 4:
                Attack(pl);
                //模拟攻击
                function Attack(pl) {
                    let Online_Players = []//获取所有在线玩家
                    mc.getOnlinePlayers().forEach(pl => {
                        if (pl.isSimulatedPlayer()) {
                            Online_Players.push(pl.name)
                        }
                    })
                    let fm = mc.newCustomForm()
                        .setTitle(PLUGINS_JS)
                        .addDropdown('选择一个模拟玩家', Online_Players, 0)
                        .addStepSlider('切换', ['开启', '关闭'])
                        .addSwitch('确认')
                    pl.sendForm(fm, (pl, data) => {
                        if (data == null) { Close_Tell(pl); return }
                        if (data[2] == 1) {
                            switch (data[1]) {
                                case 0:
                                    //开
                                    if (_Att.indexOf(Online_Players[data[0]]) == -1) {
                                        _Att.push(Online_Players[data[0]])
                                        pl.tell(GM_Tell + Online_Players[data[0]] + '开启模拟攻击成功！')
                                        Write_Logs(pl.realName, `开启模拟攻击`, Online_Players[data[0]], '')
                                    }
                                    else {
                                        pl.tell(GM_Tell + '请勿重复开启模拟攻击！')
                                    }
                                    break;
                                case 1:
                                    //off
                                    if (_Att.indexOf(Online_Players[data[0]]) == -1) {
                                        pl.tell(`${Online_Players[data[0]]}未开启模拟攻击！`)
                                    }
                                    else {
                                        _Att.splice(_Att.indexOf(Online_Players[data[0]]), 1)
                                        pl.tell('关闭' + Online_Players[data[0]] + '的模拟攻击成功！')
                                        Write_Logs(pl.realName, `关闭模拟攻击`, Online_Players[data[0]], '')
                                    }
                                    break;
                            }
                        }
                        else {
                            Attack(pl)
                        }
                    })
                }
                break;
            case 5:
                USE_ITEMS(pl);
                function USE_ITEMS(pl) {
                    let Online_Players = []//获取所有在线玩家
                    mc.getOnlinePlayers().forEach(pl => {
                        if (pl.isSimulatedPlayer()) {
                            Online_Players.push(pl.name)
                        }
                    })
                    let fm = mc.newCustomForm();
                    fm.setTitle(`${PLUGINS_JS}`);
                    fm.addDropdown('选择模拟玩家', Online_Players, 0);
                    //fm.addSwitch('使用一次 <=> 持续使用');
                    pl.sendForm(fm, (pl, dt) => {
                        if (dt == null) return Close_Tell(pl);
                        //if (dt[1] == 1) {
                        //使用多次

                        //}
                        //else {
                        //使用一次
                        if (mc.getPlayer(Online_Players[dt[0]]).simulateUseItem()) {
                            pl.tell(GM_Tell + '使用成功！')
                        }
                        else pl.tell(GM_Tell + '使用失败！')
                        //}
                    })
                }
                break;
            case 6:
                down_ui(pl);
                //下线假人
                function down_ui(pl) {
                    let Online_Players = []//获取所有在线玩家
                    mc.getOnlinePlayers().forEach(pl => {
                        if (pl.isSimulatedPlayer()) {
                            Online_Players.push(pl.name)
                        }
                    })
                    var fm = mc.newCustomForm()
                        .setTitle(`${PLUGINS_JS}`)
                        .addLabel("下线你的假人")
                        .addDropdown("下线模拟玩家", Online_Players, 0)
                        .addSwitch("确认", false)
                    pl.sendForm(fm, (pl, data) => {
                        if (data == null) { Close_Tell(pl) }
                        if (data == null) { return null }
                        if (data[2] == 1) {
                            Fake_Down(pl, Online_Players[data[1]])
                            //移除
                            if (_Destory.indexOf(Online_Players[data[1]]) == -1) {
                            }
                            else {
                                _Destory.splice(_Destory.indexOf(Online_Players[data[1]]), 1)
                                _Att.splice(_Destory.indexOf(Online_Players[data[1]]), 1)
                                pl.tell(GM_Tell + '关闭' + Online_Players[data[1]] + '的模拟破坏成功！')
                                Write_Logs(pl.realName, `请求下线模拟玩家`, Online_Players[1], '')
                            }
                        }
                    })
                }
                break;
        }
    })
}

// 监听模拟玩家死亡事件
mc.listen("onPlayerDie", (pl, sou) => {
    if (pl.isSimulatedPlayer()) {
        // 是模拟玩家 缓存数据
        let tmp = {
            "name": pl.name,
            "x": pl.pos.x,
            "y": pl.pos.y,
            "z": pl.pos.z,
            "dimid": pl.pos.dimid
        }
        // 判断是否下线成功
        if (pl.simulateDisconnect()) {
            // 下线成功，重新上线
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
})

/**
 * 判断输入内容是否为数字
 * @param {*} nums 数值 
 * @returns 
 */
function num(nums) {
    var reg = /^[0-9]+.?[0-9]*$/;
    if (reg.test(nums)) {
        return true;
    }
    return false;
}

/**
 * 上线模拟玩家
 * @param {*} pl 玩家对象
 * @param {*} FK_Name 模拟玩家名称
 * @param {*} FK_Pos 模拟玩家坐标
 */
function Fake_UP(pl, FK_Name, FK_Pos) {
    if (FK_Pos == null) {
        FK_Pos = pl.pos
    }
    let res = mc.spawnSimulatedPlayer(FK_Name, FK_Pos)
    if (res == 0) {
        pl.tell(GM_Tell + "生成模拟玩家失败")
    }
    else {
        Write_Logs(pl.realName, `上线模拟玩家`, FK_Name, FK_Pos)
    }
}

/**
 * 下线模拟玩家
 * @param {*} pl 玩家对象
 * @param {*} FK_Name 模拟玩家名称
 */
function Fake_Down(pl, FK_Name) {
    let res1 = mc.getPlayer(FK_Name).isSimulatedPlayer()
    if (res1 == 1) {
        let res = mc.getPlayer(FK_Name).simulateDisconnect()
        if (res == 1) {
            pl.tell(GM_Tell + "下线成功")
            mc.broadcast('§e' + FK_Name + ' 退出了游戏')
            Write_Logs(pl.realName, `下线模拟玩家`, FK_Name, '');
        }
        else {
            pl.tell(GM_Tell + "下线模拟玩家失败")
        }
    }
    else {
        pl.tell(GM_Tell + FK_Name + '不是模拟玩家，无法下线！')
    }
}
/**
 * 传送模拟玩家
 * @param {*} pl 玩家对象
 * @param {*} FK_Name 模拟玩家名称
 */
function Fake_TP(pl, FK_Name) {
    let res = mc.getPlayer(FK_Name).isSimulatedPlayer()
    if (res == 1) {
        let res1 = mc.getPlayer(FK_Name).teleport(pl.pos)
        if (res1 == 1) {
            pl.tell(GM_Tell + '传送假人成功！')
            Write_Logs(pl.realName, `传送模拟玩家`, FK_Name, pl.pos)
        }
        else {
            pl.tell(GM_Tell + '传送失败！')
        }
    }
    else {
        pl.tell(GM_Tell + FK_Name + '不是模拟玩家，无法传送！')
    }
}
/**
 * 看向脚下方块
 * @param {*} pl 玩家对象
 * @param {*} FK_Name 模拟玩家名称
 */
function Fake_Look(pl, FK_Name) {
    let res1 = mc.getPlayer(FK_Name).isSimulatedPlayer()
    if (res1 == 1) {
        let res = mc.getPlayer(FK_Name).simulateLookAt(pl.getBlockStandingOn())
        if (res == 1) {
            pl.tell(GM_Tell + '看向脚下方块成功！')
            Write_Logs(pl.realName, '看向脚下方块', FK_Name, pl.pos)
        }
        else {
            pl.tell(GM_Tell + '看向脚下方块失败！')
        }
    }
    else {
        pl.tell(GM_Tell + '不是模拟玩家，执行失败！')
    }
}
//破坏开
setInterval(() => {
    for (let i of _Destory) {
        if (i.length == 0) {//判定数组是否为空
            return false
        }
        else {
            mc.getPlayer(i).simulateDestroy()
        }
    }
}, Config.get('time'))
//攻击
setInterval(() => {
    for (let i of _Att) {
        if (i.length == 0) {//判定数组是否为空
            return false
        }
        else {
            mc.getPlayer(i).simulateAttack()
        }
    }
}, Config.get('time'))


//放弃表单
var GM_Tell = `§e§l[§d${PLUGINS_NAME}§e]§r§b `
function Close_Tell(pl) {
    pl.tell(GM_Tell + "表单已放弃")
}

/**
 * 权限判断
 * @param {*} pl 玩家对象
 * @returns 
 */
function qx(pl) {
    let tmp = User_Data.get('op')
    if (tmp.indexOf(pl.xuid) !== -1) {
        return true
    }
    else {
        return false
    }
}

/**
 * 输出日志到CSV
 * @param {*} player 触发主体
 * @param {*} str 事件
 * @param {*} pls 目标假人
 * @param {*} fj 附加信息
 */
function Write_Logs(player, str, pls, fj) {
    let Log_File = `.\\logs\\${PLUGINS_NAME}.csv`;/*日志文件路径*/
    let write = '时间,触发玩家,事件,目标模拟玩家,附加信息\n';//预写入内容
    if (!File.exists(Log_File)) {
        File.writeTo(Log_File, write);
        logger.warn(`File <${PLUGINS_NAME}.csv> does not exist, creating file...`);
    };
    logger.info(`${player} ${str} ${pls} ${fj}`);
    File.writeLine(Log_File, `${system.getTimeStr()},${player},${str},${pls},${fj}`);
}
colorLog('green', `${PLUGINS_JS}加载成功！  版本:${PLUGINS_VERSION}`)
log(`作者：${PLUGINS_ZZ}  发布网站：${PLUGINS_URL}`)