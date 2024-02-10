
/*            注意
 * 插件源码归原作者（PPOUI）所有
 * 未经允许禁止 二改、转载、整合等
 * 本插件为免费插件，仅在MineBBS发布
*/

const PLUGINS_NAME = "PP"
const PLUGINS_JS = `§d§l${PLUGINS_NAME} §a留§e言§b板§r`
const PLUFINS_VERSION = [2, 0, 0]
const PLUGINS_ZZ = 'PPOUI'//请勿更改
const PLUGINS_URL = 'https://www.minebbs.com/resources/pp-gui-gui.5201/'//请勿更改

ll.registerPlugin(
    /* name */ PLUGINS_NAME,
    /* introduction */ PLUGINS_JS,
    /* version */ PLUFINS_VERSION,
    /* otherInformation */ {
        "作者": PLUGINS_ZZ,
        "发布地址": PLUGINS_URL
    }
);
const Conf_Path = `.\\Plugins\\${PLUGINS_NAME}\\`;
const user_init = { "user": [], "BLACKLIST": [] }
const data_init = { "data": [], "RECYCLE_BIN": [] }
const Config_init = { "version": "1.0", "PROMPT_TEXT": "文明留言", "RECYCLE_BIN": 1, "LEAVING_A_MESSAGE": 1, "VIEW_COMMENTS": 1, "DELETE_MESSAGE": 1, "SEARCH": 1, "ACHIEVEMENT_TIPS": 0 }
const button_init = { "Main": [{ "name": "我要留言", "images": "textures/ui/book_edit_default" }, { "name": "查看留言板", "images": "textures/ui/icon_sign" }, { "name": "删除留言", "images": "textures/ui/realms_red_x" }, { "name": "搜索留言", "images": "textures/ui/magnifyingGlass" }, { "name": "管理菜单", "images": "textures/ui/op" }], "MANAGE_FORMS": [{ "name": "用户管理", "images": "textures/ui/FriendsDiversity" }, { "name": "回收站管理", "images": "textures/ui/icon_trash" }, { "name": "删除留言", "images": "textures/ui/realms_red_x" }, { "name": "插件设置", "images": "textures/ui/settings_glyph_color_2x" }, { "name": "重载配置文件", "images": "textures/ui/refresh_light" }] }
const Config = data.openConfig(Conf_Path + 'Config.json', 'json', JSON.stringify(Config_init))
const Conf_data = data.openConfig(Conf_Path + 'data.json', 'json', JSON.stringify(data_init))
const Conf_User = data.openConfig(Conf_Path + 'user.json', 'json', JSON.stringify(user_init))
const Conf_BUtton = data.openConfig(Conf_Path + 'Button.json', 'json', JSON.stringify(button_init))
function Conf_reload() {
    Config.reload()
    Conf_data.reload()
    Conf_User.reload()
    Conf_BUtton.reload()
    colorLog('green', '重载配置文件完成！')
}


// 注册命令
const cmd = mc.newCommand("pp", PLUGINS_JS, PermType.Any)
// pp add <name: String>
cmd.setEnum("add", ["add"])
cmd.mandatory("ac", ParamType.Enum, "add");
cmd.mandatory("name", ParamType.String)
cmd.overload(["add", "name"])

// pp remove <name: String>
cmd.setEnum("remove", ["remove"])
cmd.mandatory("ac", ParamType.Enum, "remove")
cmd.overload(["remove", "name"])

// pp [help, reload, gui]
cmd.setEnum("kx", ["help", "reload", "gui"])
cmd.optional("ac", ParamType.Enum, "kx", "kx", 1);
cmd.overload(["kx"]);

cmd.setCallback((_, ori, out, res) => {
    let tmp = Conf_User.get('user')
    let plxuid;
    switch (res.ac) {
        case "add":
            if (ori.type !== 7) return out.error("Please on Console Use this Command")
            plxuid = data.name2xuid(res.name)
            if (tmp.indexOf(plxuid) == -1) {
                if (plxuid == '') {
                    logger.error('获取玩家' + res.name + '的XUID失败！')
                } else {
                    colorLog('green', '玩家' + res.name + '已设置为管理员')
                    tmp.push(plxuid)
                    Conf_User.set('user', tmp)
                }
            } else {
                logger.warn('玩家' + res.name + '已是管理员！请勿重复添加')
            }
            break;
        case "remove":
            if (ori.type !== 7) return out.error("Please on Console Use this Command")
            plxuid = data.name2xuid(res.name)
            if (tmp.indexOf(plxuid) == -1) {
                logger.warn('获取玩家' + res.name + '的XUID失败！')
            } else {
                tmp.splice(tmp.indexOf(plxuid), 1)
                Conf_User.set('user', tmp)
                colorLog('green', '成功移除管理员' + res.name)
            }
            break;
        case "help":
            colorLog('yellow', `+======+ ${PLUGINS_JS} 帮助 v${PLUFINS_VERSION} +======+`)
            colorLog('green', 'pp add [玩家名]      添加管理员')
            colorLog('green', 'pp remove [玩家名]   移除管理员')
            colorLog('green', 'pp reload            重载配置文件')
            colorLog('green', '注意：添加/移除管理员请勿带上括号[]')
            colorLog('yellow', '+=====================================+')
            break;
        case "reload":
            if (ori.type !== 7) return out.error("Please on Console Use this Command")
            Conf_reload()
            break;
        default:
            ori.player != null ? MainGUI(ori.player) : out.error("Player Null")
    }
})
cmd.setup()

// 表单部分
function MainGUI(pl) {
    const fm = mc.newSimpleForm()
    fm.setTitle(`${PLUGINS_JS}`)
    fm.setContent('请选择一个操作')
    let bt = Conf_BUtton.get('Main')
    bt.forEach(dt => {
        fm.addButton(dt.name, dt.images)
    })
    pl.sendForm(fm, (pl, id) => {
        if (id == null) { Close_tell(pl); return null }
        switch (id) {
            case 0:
                Config.get('LEAVING_A_MESSAGE') == 1 && CLOSURE_JUDGMENT(pl) == true ? UserForm.LeaveAMessage(pl) : OFF(pl)
                break;
            case 1:
                Config.get('VIEW_COMMENTS') == 1 ? UserForm.ViewComments(pl) : OFF(pl)
                break;
            case 2:
                Config.get('DELETE_MESSAGE') == 1 ? UserForm.DeleteMessage(pl) : OFF(pl)
                break;
            case 3:
                Config.get('SEARCH') == 1 ? UserForm.Serach(pl) : OFF(pl)
                break;
            case 4:
                AUTHORITY_JUDGMENT(pl) == true ? Setting.Main(pl) : null
                break;
        }
    })
}
class Setting {
    static Main(pl) {
        const fm = mc.newSimpleForm()
            .setTitle(`${PLUGINS_JS}`)
            .setContent('选择一个操作')
        let bt = Conf_BUtton.get('MANAGE_FORMS')
        bt.forEach(dt => {
            fm.addButton(dt.name, dt.images)
        })
        pl.sendForm(fm, (pl, id) => {
            if (id == null) { Close_tell(pl); return null }
            switch (id) {
                case 0:
                    Setting.UserManagement(pl)
                    break;
                case 1:
                    Setting.RecycleBinManagement(pl)
                    break;
                case 2:
                    Setting.DeleteMessage(pl)
                    break;
                case 3:
                    Setting.PluginSettings(pl)
                    break;
                case 4:
                    Conf_reload()
                    C_tell(pl, '重载配置文件完成！')
                    break;
                default:
                    Close_tell(pl)
            }
        })
    }

    static UserManagement(pl) {
        let Online_Players = []
        mc.getOnlinePlayers().forEach(pl => {
            Online_Players.push(pl.realName)
        })
        const fm = mc.newCustomForm()
        fm.setTitle(`${PLUGINS_JS}`)
        fm.addInput('§c§l■§r离线 请输入玩家名', 'str')
        fm.addDropdown('§a§l■§r在线 请选择一个玩家', Online_Players, 0)
        fm.addStepSlider('§e§l■§r切换模式', ['§a§l■§r在线模式', '§c§l■§r离线模式'], 0)
        fm.addStepSlider('§e§l■§r操作类型', ['§c§l■§r封禁用户', '§a§l■§r解禁用户'], 0)
        pl.sendForm(fm, (pl, dt) => {
            if (dt == null) return Close_tell(pl);
            let stmp = Conf_User.get('BLACKLIST');
            if (dt[3] == 0) {
                // Ban User
                if (dt[2] == 0) {
                    // 在线
                    let plxuid = data.name2xuid(Online_Players[dt[1]])
                    if (stmp.indexOf(plxuid) != -1) return C_tell(pl, `玩家${Online_Players[dt[1]]}已被封禁，请勿重复封禁`);
                    if (plxuid == '') return C_tell(pl, `获取玩家${Online_Players[dt[1]]}的XUID失败！`)
                    C_tell(pl, `成功封禁用户${Online_Players[dt[1]]}`)
                    stmp.push(plxuid)
                    Conf_User.set('BLACKLIST', stmp)
                } else {
                    // 离线
                    if (dt[0] == '') return C_tell(pl, '输入框为空！');
                    let plxuid = data.name2xuid(dt[0])
                    if (stmp.indexOf(plxuid) != -1) return C_tell(pl, `玩家${dt[0]}已被封禁，请勿重复封禁`)
                    if (plxuid == '') return C_tell(pl, `获取玩家${dt[0]}的XUID失败！`)
                    C_tell(pl, `成功封禁用户${dt[0]}`)
                    stmp.push(plxuid)
                    Conf_User.set('BLACKLIST', stmp)
                }
            } else {
                // UnBan User
                if (dt[2] == 0) {
                    // 在线
                    let plxuid = data.name2xuid(Online_Players[dt[1]])
                    if (stmp.indexOf(plxuid) == -1) return C_tell(pl, '获取玩家' + Online_Players[dt[1]] + '的XUID失败！')
                    stmp.splice(stmp.indexOf(plxuid), 1)
                    Conf_User.set('BLACKLIST', stmp)
                    C_tell(pl, '已解禁用户' + Online_Players[dt[1]])
                } else {
                    let plxuid = data.name2xuid(dt[0])
                    if (stmp.indexOf(plxuid) == -1) return C_tell(pl, '获取玩家' + dt[0] + '的XUID失败！')
                    stmp.splice(stmp.indexOf(plxuid), 1)
                    Conf_User.set('BLACKLIST', stmp)
                    C_tell(pl, '已解禁用户' + dt[0])
                }
            }
        })
    }

    static RecycleBinManagement(pl) {
        const fm = mc.newSimpleForm()
        fm.setTitle(`${PLUGINS_JS}`)
        fm.setContent('选择一条留言')
        let bt1 = Conf_data.get('RECYCLE_BIN')
        let arr1 = []
        bt1.forEach(dt => {
            fm.addButton(`§e时间： §a${dt.time}\n§e内容： §d${dt.text}`)
            arr1.push(dt.gid)
        })
        pl.sendForm(fm, (pl, id2) => {
            if (id2 == null) return Close_tell(pl);
            let data_tmp2 = Conf_data.get('RECYCLE_BIN')
            let tmp = JSON.parse(File.readFrom(`./Plugins/${PLUGINS_NAME}/data.json`))
            let GUID = arr1[id2]
            let index = data_tmp2.findIndex(tmp => tmp.gid === GUID);
            pl.sendModalForm(PLUGINS_JS + '确认页', `§a§l|§r§e玩家： §b${data_tmp2[index].name}\n§a§l|§r§eXUID: §g${data_tmp2[index].xuid}\n§a§l|§r§e时间： §a${data_tmp2[index].time}\n§a§l|§r§e设备： §a${data_tmp2[index].os} §eIP： §o§a${data_tmp2[index].ip}§r\n§a§l|§r§eGID:§b${data_tmp2[index].gid}\n§a§l|§r§e内容： §d${data_tmp2[index].text}`, '永久删除', '放弃表单', (pl, fdt) => {
                switch (fdt) {
                    case true:
                        data_tmp2.splice(index, 1);
                        Conf_data.set('RECYCLE_BIN', data_tmp2)
                        C_tell(pl, `成功删除留言！  GID：${GUID}`)
                        break;
                    default:
                        Close_tell(pl);
                }
            })
        })
    }

    static DeleteMessage(pl) {
        const fm = mc.newSimpleForm()
        fm.setTitle(`${PLUGINS_JS}`)
        fm.setContent('选择一条留言')
        let bt = Conf_data.get('data')
        let arr = []
        bt.forEach(dt => {
            fm.addButton(`§e时间： §a${dt.time}\n§e内容： §d${dt.text}`)
            arr.push(dt.gid)
        })
        pl.sendForm(fm, (pl, id1) => {
            if (id1 == null) return Close_tell(pl);
            let data_tmp1 = Conf_data.get('data')
            let tmp = JSON.parse(File.readFrom(`./Plugins/${PLUGINS_NAME}/data.json`))
            let GUID = arr[id1]
            let index = data_tmp1.findIndex(tmp => tmp.gid === GUID);
            pl.sendModalForm(PLUGINS_JS + '确认页', `§a§l|§r§e玩家： §b${data_tmp1[index].name}\n§a§l|§r§eXUID: §g${data_tmp1[index].xuid}\n§a§l|§r§e时间： §a${data_tmp1[index].time}\n§a§l|§r§e设备： §a${data_tmp1[index].os} §eIP： §o§a${data_tmp1[index].ip}§r\n§a§l|§r§eGID:§b${data_tmp1[index].gid}\n§a§l|§r§e内容： §d${data_tmp1[index].text}`, '移至回收站', '放弃表单', (pl, fdt) => {
                switch (fdt) {
                    case true:
                        if (Config.get('RECYCLE_BIN') == 1) {
                            let del = Conf_data.get('RECYCLE_BIN')
                            del.push(data_tmp1[index])
                            Conf_data.set('RECYCLE_BIN', del)
                        }
                        data_tmp1.splice(index, 1);
                        Conf_data.set('data', data_tmp1)
                        C_tell(pl, `成功删除留言！  GID：${GUID}`)
                        break;
                    default:
                        Close_tell(pl);
                }
            })
        })
    }

    static PluginSettings(pl) {
        const fm = mc.newCustomForm()
        fm.setTitle(`${PLUGINS_JS}`)
        fm.addInput('§l§a|§r§e留言时显示的提示', 'str', Config.get('PROMPT_TEXT'))
        fm.addSwitch('§l§a|§r§e回收站功能\n §a用户删除的留言是否移至回收站', Boolean(Config.get('RECYCLE_BIN')).valueOf())
        fm.addSwitch('§l§a|§r§e留言功能\n §a是否允许用户留言', Boolean(Config.get('LEAVING_A_MESSAGE')).valueOf())
        fm.addSwitch('§l§a|§r§e查看留言板\n §a是否允许用户查看留言板', Boolean(Config.get('VIEW_COMMENTS')).valueOf())
        fm.addSwitch('§l§a|§r§e删除留言\n §a是否允许用户删除自己的留言', Boolean(Config.get('DELETE_MESSAGE')).valueOf())
        fm.addSwitch('§l§a|§r§e搜索功能\n §a是否允许用户使用搜索功能', Boolean(Config.get('SEARCH')).valueOf())
        fm.addSwitch('§l§a|§r§e通知功能\n §a是否启用成就栏通知', Boolean(Config.get('ACHIEVEMENT_TIPS')).valueOf())
        pl.sendForm(fm, (pl, dt1) => {
            if (dt1 == null) return Close_tell(pl);
            Config.set('PROMPT_TEXT', dt1[0])
            Config.set('RECYCLE_BIN', dt1[1])
            Config.set('LEAVING_A_MESSAGE', dt1[2])
            Config.set('VIEW_COMMENTS', dt1[3])
            Config.set('DELETE_MESSAGE', dt1[4])
            Config.set('SEARCH', dt1[5])
            Config.set('ACHIEVEMENT_TIPS', dt1[6])
            C_tell(pl, '重载配置文件完成')
        })
    }
}

class UserForm {
    /**
     * 搜索留言
     * @param {Player} pl 
     * @param {String} tmp 输入的内容
     */
    static Serach(pl, tmp) {
        let Online_Players = []
        mc.getOnlinePlayers().forEach(pl => {
            Online_Players.push(pl.realName)
        })
        const fm = mc.newCustomForm()
            .setTitle(`${PLUGINS_JS}`)
            .addInput('输入GID', 'str', tmp != null ? tmp : "")
        fm.addDropdown('选择一个玩家', Online_Players, 0)
            .addStepSlider('搜索模式', ['玩家', 'GID'])
        pl.sendForm(fm, (pl, data) => {
            if (data == null) return Close_tell(pl);
            let arr_i = []
            let data_tmp = Conf_data.get('data')
            let tmp = JSON.parse(File.readFrom(`./Plugins/${PLUGINS_NAME}/data.json`))
            switch (data[2]) {
                case 0:// 名称
                    const fm1 = mc.newCustomForm()
                    fm1.setTitle(`${PLUGINS_JS}`)
                    let count = 0
                    data_tmp.forEach(i => {
                        if (Online_Players[data[1]] == i.name) {
                            fm1.addLabel(`§a§l|§r§e玩家： §b${i.name}\n§a§l|§r§e时间： §a${i.time}\n§a§l|§r§e设备： §a${i.os} §eIP： §o§a${i.ip}§r\n§a§l|§r§e内容： §d${i.text}`)
                            count++;
                        }
                    })
                    fm1.addLabel(`检索玩家"${Online_Players[data[1]]}"完成   共${count}条结果`)
                    if (count !== 0) {
                        pl.sendForm(fm1, (pl) => { Close_tell(pl); })
                    } else {
                        pl.sendModalForm('ERROR 错误！', `未检索到玩家 "${Online_Players[data[1]]}"\n是否返回？`, '返回上一级', '放弃表单', (pl, dt) => {
                            switch (dt) {
                                case true:
                                    UserForm.Serach(pl, data[0])
                                    break;
                                default:
                                    Close_tell(pl)
                            }
                        })
                    }
                    break;
                case 1:// GUID
                    if (data[0] == '') return C_tell(pl, '输入框为空!');
                    arr_i = data_tmp.filter(i => i.guid == data[0])
                    if (arr_i.length == 0) {
                        pl.sendModalForm('ERROR 错误！', `未检索到GID "${data[0]}"\n是否返回？`, '返回上一级', '放弃表单', (pl, dt) => {
                            switch (dt) {
                                case true:
                                    UserForm.Serach(pl, data[0])
                                    break;
                                default:
                                    Close_tell(pl)
                            }
                        })
                    } else {
                        let GUID = arr_i[0]
                        let index = data_tmp.findIndex(tmp => tmp.gid === GUID);
                        pl.sendModalForm(`${PLUGINS_JS} 搜索 (${GUID})`, `§a§l|§r§e玩家： §b${data_tmp[index].name}\n§a§l|§r§e时间： §a${data_tmp[index].time}\n§a§l|§r§e设备： §a${data_tmp[index].os} §eIP： §o§a${data_tmp[index].ip}§r\n§a§l|§r§e内容： §d${data_tmp[index].text}`, '放弃表单', '返回上一级', (pl, dt) => {
                            switch (dt) {
                                case true:
                                    UserForm.Serach(pl, data[0])
                                    break;
                                default:
                                    Close_tell(pl)
                            }
                        })
                    }
                    break;
            }
        })
    }

    /**
     * 删除留言
     * @param {Player} pl 
     * @returns 
     */
    static DeleteMessage(pl) {
        const fm = mc.newSimpleForm()
            .setTitle(`${PLUGINS_JS}`)
            .setContent('选择一条留言')
        let bt = Conf_data.get('data')
        let arr = []
        bt.forEach(dt => {
            if (dt.name == pl.realName) {
                fm.addButton(`§e时间： §a${dt.time}\n§e内容： §d${dt.text}`)
                arr.push(dt.gid)
            }
        })
        if (arr.length === 0) return C_tell(pl, '你还没有留言，快去留言吧！')
        pl.sendForm(fm, (pl, id) => {
            if (id == null) return Close_tell(pl);
            let data_tmp = Conf_data.get('data')
            let tmp = JSON.parse(File.readFrom(`./Plugins/${PLUGINS_NAME}/data.json`))
            let GUID = arr[id]
            let index = data_tmp.findIndex(tmp => tmp.gid === GUID);
            pl.sendModalForm(PLUGINS_JS + '确认页', `§a§l|§r§e玩家： §b${data_tmp[index].name}\n§a§l|§r§e时间： §a${data_tmp[index].time}\n§a§l|§r§e设备： §a${data_tmp[index].os} §eIP： §o§a${data_tmp[index].ip}§r\n§a§l|§r§e内容： §d${data_tmp[index].text}`, '永久删除', '返回上一页', (pl, fdt) => {
                switch (fdt) {
                    case false:
                        UserForm.DeleteMessage(pl);
                        break;
                    case true:
                        if (Config.get('RECYCLE_BIN') == 1) {
                            let del = Conf_data.get('RECYCLE_BIN');
                            del.push(data_tmp[index]);
                            Conf_data.set('RECYCLE_BIN', del);
                        }
                        data_tmp.splice(index, 1);
                        Conf_data.set('data', data_tmp);
                        C_tell(pl, `成功删除留言！  GID：${GUID}`);
                        break;
                    default:
                        Close_tell(pl);
                        break;
                }
            })
        })
    }

    /**
     * 查看留言
     * @param {Player} pl 
     */
    static ViewComments(pl) {
        const fm = mc.newCustomForm()
            .setTitle(`${PLUGINS_JS}`)
        const tmp = Conf_data.get('data')
        tmp.forEach(dt => {
            fm.addLabel(`§a§l|§r§e玩家： §b${dt.name}\n§a§l|§r§e时间： §a${dt.time}\n§a§l|§r§e设备： §a${dt.os} §eIP： §o§a${dt.ip}§r\n§a§l|§r§e内容： §d${dt.text}`)
        })
        pl.sendForm(fm, (pl, data) => { Close_tell(pl); })
    }

    /**
     * 留言
     * @param {Player} pl 
     */
    static LeaveAMessage(pl) {
        const fm = mc.newCustomForm()
            .setTitle(`${PLUGINS_JS}`)
            .addLabel(Config.get('PROMPT_TEXT'))
            .addInput('输入要留言的内容', 'str')
        pl.sendForm(fm, (pl, data) => {
            if (data == null) return Close_tell(pl);
            if (data[1] == '') return C_tell(pl, '输入框为空！')
            const dv = pl.getDevice()
            let Conf_tmp = Conf_data.get('data')
            let data_tmp = {
                "name": pl.realName,
                "xuid": pl.xuid,
                "time": system.getTimeStr(),
                "text": data[1],
                "ip": dv.ip,
                "os": dv.os,
                "gid": system.randomGuid()
            }
            Conf_tmp.push(data_tmp)
            Conf_data.set('data', Conf_tmp)
        })
    }
}

const Gm_tell = `§l§a|§r§e[§d${PLUGINS_NAME}§e] §b`
function Close_tell(pl) {
    C_tell(pl, '表单已放弃')
}

function OFF(pl) {
    C_tell(pl, '管理员关闭了此功能')
}

/**
 * 封装：可选消息类型
 * @param {Player} pl 玩家
 * @param {String} txts 消息
 */
function C_tell(pl, txts) {
    Config.get('ACHIEVEMENT_TIPS') == 0 ? pl.tell(Gm_tell + txts) : pl.sendToast(`§l§a|§r§e[§d${PLUGINS_NAME}留言板§e]§r`, '§e§l■§b' + txts)
}

/**
 * 是否有权限打开管理表单
 * @param {Player} pl 
 * @returns 
 */
function AUTHORITY_JUDGMENT(pl) {
    let tmp = Conf_User.get('user')
    if (tmp.indexOf(pl.xuid) !== -1) {
        return true
    } else {
        C_tell(pl, '无权限访问！')
        return false
    }
}

/**
 * 用户是否被封禁
 * @param {Player} pl 
 * @returns 
 */
function CLOSURE_JUDGMENT(pl) {
    let tmp = Conf_User.get('BLACKLIST')
    if (tmp.indexOf(pl.xuid) !== -1) {
        C_tell(pl, '你已被管理员封禁，无法使用此功能')
        return false
    } else {
        return true
    }
}

colorLog('green', `版本：${PLUFINS_VERSION}`)
colorLog('green', `作者：${PLUGINS_ZZ}`)
colorLog('green', `MineBBS: ${PLUGINS_URL}`)