//LiteLoaderScript Dev Helper
/// <reference path="c:\Users\Administrator\Documents\aids/dts/HelperLib-master/src/index.d.ts"/> 

// 妈的，为什么之前不写注释，现在还要理解这坨答辩  太草了

const PLUGINS_NAME = "Server_Announcements";
const PLUGINS_JS = `${PLUGINS_NAME}服务器公告插件`;
const PLUGINS_VERSION = [2, 0, 1]
const PLUGINS_ZZ = "PPOUI";
const PLUGINS_URL = "https://www.minebbs.com/resources/server_announcements.5218/";
ll.registerPlugin(
    /* name */ PLUGINS_NAME,
    /* introduction */ PLUGINS_JS,
    /* version */ PLUGINS_VERSION,
    /* otherInformation */ {
        "作者": PLUGINS_ZZ,
        "下载链接": PLUGINS_URL
    }
);

// 配置文件
const Conf_Path = `.\\Plugins\\PPOUI\\${PLUGINS_NAME}\\`;
const Config = data.openConfig(Conf_Path + 'Config.json', 'json', JSON.stringify(
    {
        "version": "2.0.0",  //配置文件版本
        "Command": {
            "name": "sa",// 顶层命令
            "alias": "公告",//命令别名
            "description": "打开公告"//命令描述
        },
        "NO_PROMPT_SWITCH": true,  //不再提示开关
        "LOADING_POP_UP_WINDOW": true,  //进服弹出公告
        "SWITCH_DEFAULT_STATE": false,   //不再提示开关默认状态
        "INSPECTION_MODE": 0,  //公告变动检测 0为都检测 1为仅服务器启动时检测 2为玩家进服时检测
        "FORM_TITLE": "公告",  //表单标题
        "PROMPT_CONTENT": "表单已放弃",  //关闭表单时提示
        "CONTENT": "欢迎加入服务器\nQQ群:123xxxxx",   //公告内容
        "BACKUP": "",
        "CLOSED_PLAYERS": []  //存储关闭弹窗的玩家
    }
))
function Conf_reload() {
    Config.reload()
    colorLog('green', '重载配置文件完成')
}


// 注册命令
{
    const { name, alias, description } = Config.get('Command');
    const Command = mc.newCommand(name, description, PermType.Any);
    Command.setAlias(alias);
    Command.setEnum('mj', ['reload']);
    Command.optional('re', ParamType.Enum, 'mj');
    Command.overload(['re']);
    Command.setCallback((_, ori, out, res) => {
        switch (res.re) {
            case "reload":
                if (Config.get('INSPECTION_MODE') == 0 || Config.get('INSPECTION_MODE') == 1 || Config.get('INSPECTION_MODE') == 2) {
                    if (Config.get('BACKUP') == '') {
                        UPDATE_BACKUP(1)
                    } else {
                        if (Config.get('BACKUP') == Config.get('CONTENT')) {
                        } else {
                            log('检测到公告变更，正在处理...');
                            UPDATE_BACKUP(0)
                        }
                    }
                }
                Conf_reload();
                PROFILE_CHECK();
                break;
            default:
                if (!ori.player) {
                    return out.error('此命令仅限玩家执行！');
                }
                MainGUI(ori.player, 1);
                PROFILE_CHECK();
                break;
        }
    })
    Command.setup();
}

// 监听事件
{
    mc.listen('onJoin', (pl) => {
        if (Config.get('INSPECTION_MODE') == 0 || Config.get('INSPECTION_MODE') == 2) {
            if (Config.get('BACKUP') == '') {
                UPDATE_BACKUP(1)
            }
            else {
                if (Config.get('BACKUP') == Config.get('CONTENT')) {
                }
                else {
                    log('检测到公告变更，正在处理...')
                    UPDATE_BACKUP(0)
                }
            }
        }
        if (Config.get('LOADING_POP_UP_WINDOW') == true) {
            if (qx(pl)) {
                MainGUI(pl)
            }
        }
        PROFILE_CHECK()
    })
    mc.listen('onServerStarted', d => {
        if (Config.get('INSPECTION_MODE') == 0 || Config.get('INSPECTION_MODE') == 1) {
            if (Config.get('BACKUP') == '') {
                UPDATE_BACKUP(1)
            }
            else {
                if (Config.get('BACKUP') == Config.get('CONTENT')) {
                }
                else {
                    log('检测到公告变更，正在处理...')
                    UPDATE_BACKUP(0)
                }
            }
        }
        PROFILE_CHECK()
    })
}


function UPDATE_BACKUP(num) {
    if (num == 0) {
        let tmp = Config.get('CLOSED_PLAYERS')
        tmp.splice(tmp)
        Config.set('CLOSED_PLAYERS', tmp)
        Config.set('BACKUP', Config.get('CONTENT'))
    }
    if (num == 1) {
        Config.set('BACKUP', Config.get('CONTENT'))
    }
}
function PROFILE_CHECK() {
    if (Config.get('INSPECTION_MODE') !== 0 && Config.get('INSPECTION_MODE') !== 1 && Config.get('INSPECTION_MODE') !== 2) {
        logger.error(`检测到配置项“检测模式(INSPECTION_MODE)”配置错误,允许值0,1,2,当前配置值:${Config.get('INSPECTION_MODE')}\n详细内容请前往MineBBS查看，链接:${PLUGINS_URL}`)
    }
}
function qx(pl) {
    let tmp = Config.get('CLOSED_PLAYERS')
    if (tmp.indexOf(pl.realName) !== -1) {
        return false
    }
    else {
        return true
    }
}
function MainGUI(pl, num) {
    let fm = mc.newCustomForm()
        .setTitle(Config.get('FORM_TITLE'))
        .addLabel(Config.get('CONTENT'))
    if (Config.get('NO_PROMPT_SWITCH') == true) {
        let SWITCH_STATUS
        if (num == 1) {
            if (qx(pl)) { SWITCH_STATUS = false } else { SWITCH_STATUS = true }
        } else {
            SWITCH_STATUS = Config.get('SWITCH_DEFAULT_STATE')
        }
        fm.addSwitch('不再弹出', SWITCH_STATUS)
    }
    pl.sendForm(fm, (pl, dt) => {
        if (dt == null) { Close_Tell(pl); return }
        if (Config.get('NO_PROMPT_SWITCH') == true) {
            if (dt[1] == 1) {
                let tmp = Config.get('CLOSED_PLAYERS')
                if (tmp.indexOf(pl.realName) == -1) {
                    let tmp = Config.get('CLOSED_PLAYERS')
                    tmp.push(pl.realName)
                    Config.set('CLOSED_PLAYERS', tmp)
                    Conf_reload()
                }
            }
            else {
                let tmp = Config.get('CLOSED_PLAYERS')
                tmp.splice(tmp.indexOf(pl.realName), 1)
                Config.set('CLOSED_PLAYERS', tmp)
                Conf_reload()
            }
        }
    })
}

// 关闭提示
const Gm_Tell = `§l§6[§e${PLUGINS_NAME}§6] §d`
function Close_Tell(pl) {
    pl.tell(Gm_Tell + Config.get('PROMPT_CONTENT'))
}
// 输出插件信息
colorLog('green', `${PLUGINS_NAME} 加载成功!`)
colorLog('green', `插件版本: ${PLUGINS_VERSION}`)
colorLog('green', `插件作者: ${PLUGINS_ZZ}`)
colorLog('green', `发布网站: ${PLUGINS_URL}`)