//LiteLoaderScript Dev Helper
/// <reference path="c:\Users\Administrator\Documents\aids/dts/HelperLib-master/src/index.d.ts"/> 

// 注册插件
const PLUGINS_NAME = 'MENU';
const PLUGINS_JS = 'MENU菜单';
const PLUGINS_VERSION = [1, 0, 0];
const PLUGINS_ZZ = 'PPOUI';
const PLUGINS_URL = '';
ll.registerPlugin(
    /* name */ PLUGINS_NAME,
    /* introduction */ PLUGINS_JS,
    /* version */ PLUGINS_VERSION,
    /* otherInformation */ {
        '作者': PLUGINS_ZZ,
        '发布网站': PLUGINS_URL
    }
);

// 配置文件
const Path = `.\\Plugins\\${PLUGINS_ZZ}\\${PLUGINS_NAME}\\`;
const __inits = {
    "Config": {
        "Debug": true,
        "Version": "1.0.0",
        "EntryFile": "index",
        "Listen": {
            "Enable": true,
            "Item": "minecraft:clock",
            "RunCmd": "menu"
        },
        "RegCmd": {
            "CmdName": "menu",
            "Describe": "打开菜单"
        }
    },
    "index": {
        "Title": "默认入口文件",
        "Describe": "默认菜单文件",
        "Button": [
            {
                "name": "执行命令",
                "Describe": "( •̀ ω •́ )y",
                "image": "",
                "type": "command",
                "open": "menu"
            },
            {
                "name": "执行命令(OP)",
                "Describe": "( •̀ ω •́ )y",
                "image": "",
                "type": "op_command",
                "open": "menu"
            },
            {
                "name": "子菜单",
                "Describe": "( •̀ ω •́ )y",
                "image": "",
                "type": "form",
                "open": "test"
            },
            {
                "name": "子菜单(OP)",
                "Describe": "( •̀ ω •́ )y",
                "image": "",
                "type": "op_form",
                "open": "test"
            },
            {
                "name": "OPtools - 踢出玩家(OP)",
                "Describe": "( •̀ ω •́ )y",
                "image": "",
                "type": "optools",
                "open": "Kick_Ui"
            }
        ]
    }
}
let Config = data.openConfig(Path + 'Config.json', 'json', JSON.stringify(__inits.Config));

//设置日志头/消息头
let Gm_Tell;
if (Config.get("Debug") == false) {
    logger.setTitle(PLUGINS_NAME)
    logger.setConsole(true, 4)
    Gm_Tell = `§e[§l§d${PLUGINS_NAME}§r§e] §b`
}
else {
    logger.setTitle(PLUGINS_NAME + ' Debug')
    logger.setConsole(true, 5)
    Gm_Tell = `§e[§l§d${PLUGINS_NAME} §cDebug§r§e] §b`
}

// 导入OPTools接口
const Form_inside_API = ll.import('Form_inside_API');

// 监听器
mc.listen("onUseItemOn", (pl, it, bl, si) => {
    if (Config.get("Listen").Enable == false) return;
    if (it.type == Config.get("Listen").Item) {
        pl.runcmd(Config.get("Listen").RunCmd)
    }
})

// 注册命令
const Cmd = mc.newCommand(Config.get("RegCmd").CmdName, Config.get("RegCmd").Describe, PermType.Any);
Cmd.setAlias(Config.get("RegCmd").CmdAlias);
Cmd.setEnum("ListAction", ["gui", "mgr", "reload"]);
Cmd.optional("action", ParamType.Enum, "ListAction", 1);
Cmd.overload(["ListAction"]);
Cmd.setCallback((cmd, ori, out, res) => {
    switch (res.action) {
        case "reload":
            Config.reload();
            out.success('重载完成')
            break;
        case "mgr":
            if (!ori.player.isOP()) return pl.tell(Gm_Tell + '此功能仅限管理员使用');
            Seting(ori.player);
            break;
        default:
            CHECK_READ_FILE(Config.get('EntryFile'), dt => {
                if (dt.status) {
                    Main_Menu(ori.player, dt.data);
                }
                else {
                    ori.player.tell(Gm_Tell + '§c§l' + '解析JSON字符串失败！\n' + String(dt.data));
                    logger.error('解析JSON字符串失败！\n' + String(dt.data));
                }
            })
            break;
    }
});
Cmd.setup();

const isTrue_false = (sw) => {
    return sw === 1 ? true : false;
}

function Seting(pl) {
    let fm = mc.newSimpleForm();
    fm.setTitle('[MENU] 设置');
    fm.addButton('插件设置');
    fm.addButton('编辑菜单');
    fm.addButton('新建子菜单');
    pl.sendForm(fm, (pl, id) => {
        switch (id) {
            case 0:
                FORM_1(pl);
                function FORM_1(pl) {
                    const fm = mc.newCustomForm();
                    fm.addLabel(`当前配置文件版本${Config.get('Version')}`);
                    fm.addInput('默认入口文件', 'File Name', Config.get("EntryFile"));
                    fm.addSwitch('启用监听器', isTrue_false(Config.get('Listen').Enable));
                    fm.addInput('监听物品', 'Minecraft Item', Config.get('Listen').Item);
                    fm.addInput('触发后执行命令', 'Menu CMD', Config.get('Listen').RunCmd);
                    fm.addInput('注册命令', 'Reg CMD', Config.get('RegCmd').CmdName);
                    fm.addInput('命令别名', 'CMD', Config.get('RegCmd').CmdAlias);
                    fm.addInput('命令描述', 'CMD', Config.get('RegCmd').Describe);
                    pl.sendForm(fm, (pl, dt) => {
                        if (dt == null) return pl.tell(Gm_Tell + '表单已放弃');
                        let reg = {
                            "CmdName": "menu",
                            "CmdAlias": "菜单",
                            "Describe": "打开菜单"
                        };
                        let listen = {
                            "Enable": true,
                            "Item": "minecraft:stick",
                            "RunCmd": "menu"
                        }
                    })
                }
                break;
            case 1:
                break;
            case 2:
                break;
            default:
                return pl.tell(Gm_Tell + '表单已放弃');
        }
    })
}

/**
 * 检查/读取文件
 * @param {*} FileName 文件名
 * @param {*} callback 回调数据
 */
function CHECK_READ_FILE(FileName, callback) {
    let tmp = {
        "status": true,
        "data": []
    }
    if (!File.exists(Path + `${FileName}.json`)) {
        File.writeTo(Path + `${FileName}.json`, JSON.stringify(__inits.index, null, '\t'));
    };
    try {
        tmp.data = JSON.parse(File.readFrom(Path + `${FileName}.json`));
    } catch (e) {
        tmp.status = false;
        tmp.data = e;
    };
    callback(tmp);
}

// GUI菜单
function Main_Menu(pl, JSON_FILE) {
    let fm = mc.newSimpleForm();
    if (JSON_FILE.Title == null || JSON_FILE.Title == undefined || JSON_FILE.Title == '') JSON_FILE.Title = PLUGINS_NAME;
    if (JSON_FILE.Describe == null || JSON_FILE.Describe == undefined || JSON_FILE.Describe == '') JSON_FILE.Describe = '未命名';
    fm.setTitle(JSON_FILE.Title);
    fm.setContent(JSON_FILE.Describe);
    let Arry = JSON_FILE.Button;
    Arry.forEach(i => {
        fm.addButton(i.name + '\n' + i.Describe, i.image);
    });
    pl.sendForm(fm, (pl, id) => {
        if (id == null) return pl.tell(Gm_Tell + '表单已放弃');
        let Menu_Arry;
        switch (Arry[id].type) {
            case "form":// 子表单
                CHECK_READ_FILE(Arry[id].open, dt => {
                    if (dt.status) {
                        Main_Menu(pl, dt.data);
                    }
                    else {
                        pl.tell(Gm_Tell + '§c§l' + '解析JSON字符串失败！\n' + String(dt.data));
                        logger.error('解析JSON字符串失败！\n' + String(dt.data));
                    }
                })
                break;
            case "op_form":// op子表单
                if (!pl.isOP()) return pl.tell(Gm_Tell + '此功能仅限管理员使用');
                CHECK_READ_FILE(Arry[id].open, dt => {
                    if (dt.status) {
                        Main_Menu(pl, dt.data);
                    }
                    else {
                        pl.tell(Gm_Tell + '§c§l' + '解析JSON字符串失败！\n' + String(dt.data));
                        logger.error('解析JSON字符串失败！\n' + String(dt.data));
                    }
                })
                break;
            case "command":// 执行命令
                pl.runcmd(Arry[id].open)
                break;
            case "op_command":// OP执行命令
                if (!pl.isOP()) return pl.tell(Gm_Tell + '此功能仅限管理员使用');
                pl.runcmd(Arry[id].open)
                break;
            case "optools":
                if (!pl.isOP()) return pl.tell(Gm_Tell + '此功能仅限管理员使用');
                Form_inside_API(pl.xuid, Arry[id].open);
                break;
        }
    })
}
