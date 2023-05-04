//LiteLoaderScript Dev Helper
/// <reference path="c:\Users\Administrator\Documents\Aids/dts/HelperLib-master/src/index.d.ts"/> 

/* 如果需要输出debug信息，请在./plugins/PPOUI目录下创建一个debug的文件（无后缀 */

/** 
 *  注册插件
 */
const PLUGINS_NAME = 'OPTools';
const PLUGINS_JS = 'OPTools';
const PLUGINS_VERSION = [2, 5, 3];
const PLUGINS_ZZ = 'PPOUI';
const PLUGINS_URL = 'https://www.minebbs.com/resources/op-tools-op-gui.4836/';
ll.registerPlugin(
    /* name */ PLUGINS_NAME,
    /* introduction */ PLUGINS_JS,
    /* version */ PLUGINS_VERSION,
    /* otherInformation */ {
        '作者': PLUGINS_ZZ,
        '发布网站': PLUGINS_URL
    }
);

logger.info(`Loading...\n
                  ____  _____    _______          _     
                 / __ \\|  __ \\  |__   __|        | |    
                | |  | | |__) |    | | ___   ___ | |___ 
                | |  | |  ___/     | |/ _ \\ / _ \\| / __|
                | |__| | |         | | (_) | (_) | \\__ \\
                 \\____/|_|         |_|\\___/ \\___/|_|___/\n
    ---- ${PLUGINS_URL} ----
                        By: ${PLUGINS_ZZ}   Version: ${PLUGINS_VERSION.join('.').replace(/,/g, '.')}
`)


/* 设置日志头/消息头 */
let Gm_Tell;
if (!File.exists('.\\plugins\\PPOUI\\debug')) {
    logger.setTitle(PLUGINS_NAME);
    logger.setConsole(true, 4);
    Gm_Tell = `§e[§l§d${PLUGINS_NAME}§r§e] §b`;
} else {
    logger.setTitle(PLUGINS_NAME + ' Debug');
    logger.setConsole(true, 5);
    Gm_Tell = `§e[§l§d${PLUGINS_NAME} §cDebug§r§e] §b`;
    logger.warn(`你已开启Debug功能，将会输出Debug信息`);
    logger.debug('log debug is true');
    mc.listen("onUseItemOn", (pl, it, bl, si) => {
        if (it.type == 'minecraft:clock') {
            pl.runcmd("tools");
            //pl.runcmd("tools set");
        }
    })
}

/**
 *  预释放文件
 */
const Config_init = {
    /* 配置文件 */
    "Config": {
        "version": "2.5.3",
        "language": "zh_CN",/* 语言 */
        "BindCmd": false,/* 命令绑定 */
        "Network": true,/* 网络请求 */
        "Cleaner_API": false,/* Cleaner扫地机API */
        "FilterSimulatedPlayers": true,/* 过滤模拟玩家 */
        "Motd_Enable": false,
        "Motd_Time": 2000,/* Motd切换时间 */
        "Kick_Txt": "你已被管理员踢出服务器",/* 踢出默认内容 */
        "Broad_head": "§e[§d广播§r§e] §r",/* 广播消息头 */
        "Clear_Cmd": "kill @e[type=item]",/* 清理掉落物命令 */
        "Ban_Cmd": {
            "Ban": "ban #&#${Player}#&# ${time} ${Reason}",
            "UnBan": "unban #&#${Player}#&#"
        },
        "Log": {
            "Output_Colsole": true, /* 输出控制台 */
            "Output_csv": true,/* 输出CSV */
            "Date_Differentiation": false/* 按天记录日志 */
        },
        "Motd": ["motd1", "motd2", "motd3"]/* Motd内容 */
    },
    /* 主页面 */
    "MainGUI": {
        "version": "2.4.0",
        "Main": [
            {
                "name": "踢出玩家",
                "image": "textures/ui/permissions_visitor_hand",
                "type": "inside",
                "open": "Kick_Ui"
            },
            {
                "name": "杀死玩家",
                "image": "textures/ui/icon_recipe_equipment",
                "type": "inside",
                "open": "Kill_Ui"
            },
            {
                "name": "更改天气",
                "image": "textures/ui/icon_fall",
                "type": "inside",
                "open": "Weather_Ui"
            },
            {
                "name": "更改时间",
                "image": "textures/items/clock_item",
                "type": "inside",
                "open": "Time_Ui"
            },
            {
                "name": "广播消息",
                "image": "textures/ui/sound_glyph_color_2x",
                "type": "inside",
                "open": "Broad_Ui"
            },
            {
                "name": "设置MOTD",
                "image": "textures/ui/settings_glyph_color_2x",
                "type": "inside",
                "open": "Motd_Ui"
            },
            {
                "name": "设置人数",
                "image": "textures/ui/settings_glyph_color_2x",
                "type": "inside",
                "open": "Set_Player_Ui"
            },
            {
                "name": "玩家传送",
                "image": "textures/ui/dressing_room_skins.png",
                "type": "inside",
                "open": "Tp_Ui"
            },
            {
                "name": "清理掉落物",
                "image": "textures/ui/icon_trash",
                "type": "inside",
                "open": "Clear_Item_Ui"
            },
            {
                "name": "更改游戏模式",
                "image": "textures/ui/icon_setting",
                "type": "inside",
                "open": "setMode_Ui"
            },
            {
                "name": "更改游戏规则",
                "image": "textures/ui/icon_bookshelf",
                "type": "inside",
                "open": "setRule_Ui"
            },
            {
                "name": "获取隐藏方块",
                "image": "textures/ui/icon_blackfriday",
                "type": "inside",
                "open": "getBlock_Ui"
            },
            {
                "name": "执行后台命令",
                "image": "textures/ui/creator_glyph_color",
                "type": "inside",
                "open": "ConsoleCmd_Ui"
            },
            {
                "name": "发消息给玩家",
                "image": "textures/ui/message",
                "type": "inside",
                "open": "sendPlayer_Ui"
            },
            {
                "name": "崩溃玩家客户端",
                "image": "textures/ui/cancel",
                "type": "inside",
                "open": "Crash_Ui"
            },
            {
                "name": "以玩家身份说话",
                "image": "textures/ui/sound_glyph_color_2x",
                "type": "inside",
                "open": "Player_Talk_Ui"
            },
            {
                "name": "玩家身份执行命令",
                "image": "textures/ui/creator_glyph_color",
                "type": "inside",
                "open": "Player_Cmd_Ui"
            },
            {
                "name": "Ban GUI",
                "image": "textures/ui/ErrorGlyph",
                "type": "inside",
                "open": "Ban_Ui"
            },
            {
                "name": "发送表单",
                "image": "",
                "type": "inside",
                "open": "Forms_Ui"
            },
            {
                "name": "玩家详细信息",
                "image": "",
                "type": "inside",
                "open": "Info_Ui"
            },
            {
                "name": "命令黑名单",
                "image": "",
                "type": "inside",
                "open": "Black_Cmd_Ui"
            },
            {
                "name": "药水GUI",
                "image": "",
                "type": "inside",
                "open": "Potion_Ui"
            }
        ]
    },
    /* 按钮文件 */
    "ButtonData": {
        "Rule": [
            {
                "name": "随机刻",
                "image": "",
                "txt": "描述: 每游戏刻每区段中随机的方块刻发生的频率",
                "type": "randomTickSpeed"
            },
            {
                "name": "误伤/PVP",
                "image": "",
                "txt": "描述: 玩家之间能否造成伤害",
                "type": "pvp"
            },
            {
                "name": "显示坐标",
                "image": "",
                "txt": "描述: 是否在聊天框区域持续实时显示玩家坐标",
                "type": "showcoordinates"
            },
            {
                "name": "火焰蔓延",
                "image": "",
                "txt": "描述: 火是否蔓延及自然熄灭",
                "type": "dofiretick"
            },
            {
                "name": "TNT爆炸",
                "image": "",
                "txt": "描述: TNT是否会爆炸",
                "type": "tntexplodes"
            },
            {
                "name": "生物掉落",
                "image": "",
                "txt": "描述: 生物在死亡时是否掉落物品",
                "type": "domobloot"
            },
            {
                "name": "方块掉落",
                "image": "",
                "txt": "描述: 方块被破坏时是否掉落物品",
                "type": "dotiledrops"
            },
            {
                "name": "立即重生",
                "image": "",
                "txt": "描述: 玩家死亡时是否不显示死亡界面直接重生",
                "type": "doimmediaterespawn"
            },
            {
                "name": "重生半径",
                "image": "",
                "txt": "描述: 首次进入服务器的玩家和没有重生点的死亡玩家在重生时与世界重生点坐标的距离",
                "type": "spawnradius"
            },
            {
                "name": "昼夜更替",
                "image": "",
                "txt": "描述: 是否进行昼夜更替和月相变化",
                "type": "dodaylightcycle"
            },
            {
                "name": "天气更替",
                "image": "",
                "txt": "描述: 天气是否变化",
                "type": "doweathercycle"
            },
            {
                "name": "生物生成",
                "image": "",
                "txt": "描述: 生物是否自然生成",
                "type": "domobspawning"
            },
            {
                "name": "生物破坏",
                "image": "",
                "txt": "描述: 生物是否能够进行破坏",
                "type": "mobgriefing"
            },
            {
                "name": "实体掉落",
                "image": "",
                "txt": "描述: 非生物实体是否掉落物品",
                "type": "doentitydrops"
            },
            {
                "name": "幻翼生成",
                "image": "",
                "txt": "描述: 幻翼是否在夜晚生成",
                "type": "doinsomnia"
            },
            {
                "name": "死亡不掉落",
                "image": "",
                "txt": "描述: 玩家死亡后是否保留物品栏物品、经验",
                "type": "keepinventory"
            },
            {
                "name": "命令方块开关",
                "image": "",
                "txt": "描述: 命令方块在游戏中是否被启用",
                "type": "commandblocksenabled"
            },
            {
                "name": "命令方块输出",
                "image": "",
                "txt": "描述: 命令方块执行命令时是否在聊天框中向管理员显示",
                "type": "commandblockoutput"
            }
        ],
        "Block": [
            {
                "name": "§l命令方块",
                "image": "textures/ui/creator_glyph_color",
                "type": "command_block"
            },
            {
                "name": "§l屏障方块",
                "image": "textures/blocks/barrier",
                "type": "barrier"
            },
            {
                "name": "§l边界方块",
                "image": "textures/blocks/border",
                "type": "border_block"
            },
            {
                "name": "§l结构方块",
                "image": "textures/blocks/structure_block",
                "type": "structure_block"
            },
            {
                "name": "§l结构空位",
                "image": "textures/blocks/structure_void",
                "type": "structure_void"
            },
            {
                "name": "§l光源方块",
                "image": "textures/items/light_block_15.png",
                "type": "light_block"
            }
        ]
    },
    /* 药水数据 */
    "PotionData": [
        {
            "name": "伤害吸收",
            "image": "",
            "type": "absorption"
        },
        {
            "name": "不祥之兆",
            "image": "",
            "type": "bad_omen"
        },
        {
            "name": "失明",
            "image": "",
            "type": "blindness"
        },
        {
            "name": "潮涌能量",
            "image": "",
            "type": "conduit_power"
        },
        {
            "name": "黑暗",
            "image": "",
            "type": "darkness"
        },
        {
            "name": "中毒（致命）",
            "image": "",
            "type": "fatal_poison"
        },
        {
            "name": "防火",
            "image": "",
            "type": "fire_resistance"
        },
        {
            "name": "急迫",
            "image": "",
            "type": "haste"
        },
        {
            "name": "生命提升",
            "image": "",
            "type": "health_boost"
        },
        {
            "name": "饱和",
            "image": "",
            "type": "saturation"
        },
        {
            "name": "饥饿",
            "image": "",
            "type": "hunger"
        },
        {
            "name": "瞬间伤害",
            "image": "",
            "type": "instant_damage"
        },
        {
            "name": "瞬间治疗",
            "image": "",
            "type": "instant_health"
        },
        {
            "name": "隐身",
            "image": "",
            "type": "invisibility"
        },
        {
            "name": "跳跃提升",
            "image": "",
            "type": "jump_boost"
        },
        {
            "name": "飘浮",
            "image": "",
            "type": "levitation"
        },
        {
            "name": "挖掘疲劳",
            "image": "",
            "type": "mining_fatigue"
        },
        {
            "name": "反胃",
            "image": "",
            "type": "nausea"
        },
        {
            "name": "夜视",
            "image": "",
            "type": "night_vision"
        },
        {
            "name": "中毒",
            "image": "",
            "type": "poison"
        },
        {
            "name": "生命恢复",
            "image": "",
            "type": "regeneration"
        },
        {
            "name": "抗性提升",
            "image": "",
            "type": "resistance"
        },
        {
            "name": "缓降",
            "image": "",
            "type": "slow_falling"
        },
        {
            "name": "缓慢",
            "image": "",
            "type": "slowness"
        },
        {
            "name": "速度",
            "image": "",
            "type": "speed"
        },
        {
            "name": "力量",
            "image": "",
            "type": "strength"
        },
        {
            "name": "村庄英雄",
            "image": "",
            "type": "village_hero"
        },
        {
            "name": "水下呼吸",
            "image": "",
            "type": "water_breathing"
        },
        {
            "name": "虚弱",
            "image": "",
            "type": "weakness"
        },
        {
            "name": "凋零",
            "image": "",
            "type": "wither"
        }
    ],
    /* 用户文件 */
    "UserData": {
        "op": [],
        "user": []
    }
};

/**
 *  加载文件
 */
/** 文件路径 */
const Path = `.\\Plugins\\${PLUGINS_ZZ}\\${PLUGINS_NAME}\\`;
/** 配置文件 */
const Config = data.openConfig(Path + 'config\\Config.json', 'json', JSON.stringify(Config_init.Config));
/** 主页文件 */
const Main_Data = data.openConfig(Path + 'data\\MainGUI.json', 'json', JSON.stringify(Config_init.MainGUI));
/** 用户文件 */
const User_Data = data.openConfig(Path + 'data\\UserData.json', 'json', JSON.stringify(Config_init.UserData));
/** 游戏规则\隐藏方块 文件 */
const Button_Data = data.openConfig(Path + 'data\\ButtonData.json', 'json', JSON.stringify(Config_init.ButtonData));
/** 设置重载 */
function Reloads() {
    Config.reload();
    Main_Data.reload();
    User_Data.reload();
    Button_Data.reload();
    logger.info(Tr("reloads"));
}

/**
 *  加载语言包
 */
i18n.load(Path + `Lang\\language.json`, Config.get('language'), {
    "en": {},
    "zh_CN": {
        "BlackCmd.Step": "§a§l• 选择操作类型",
        "BlackCmd.Step.1": "添加命令",
        "BlackCmd.Step.2": "删除命令",
        "BlackCmd.drop": "选择需要删除的命令",
        "BlackCmd.err.0": "指令前面不要加 /",
        "BlackCmd.err.1": "命令已存在，无法重复添加",
        "BlackCmd.input": "输入要添加的命令",
        "BlackCmd.ok.0": "添加成功！",
        "BlackCmd.ok.1": "移除成功！",
        "Permission.Group.Continue": "§a§l• 操作完成\n是否继续?",
        "Permission.Group.Continue0": "§a§l继续",
        "Permission.Group.Continue1": "§c§l放弃表单",
        "Permission.Group.all.list": "名称: {name}\nGUID: {guid}\n权限: {Permission}\n用户: {data}",
        "Permission.Group.title": "§a{} §r| §d设置GUI §r| §e权限组",
        "Permission.Group.type": "§a§l• 请选择选择一个操作",
        "Permission.Group.type0": "§a§l添加",
        "Permission.Group.type1": "§c§l删除",
        "Permission.add.0": "选择需要添加的权限",
        "Permission.button.0": "查看所有权限组",
        "Permission.button.1": "创建一个权限组",
        "Permission.button.2": "查看指定权限组",
        "Permission.button.3": "修改权限组权限",
        "Permission.button.4": "修改权限组用户",
        "Permission.button.5": "修改权限组名称",
        "Permission.button.6": "查询用户所在权限组",
        "Permission.button.7": "删除一个权限组",
        "Permission.button.8": "返回上一级",
        "Permission.del.0": "请选择需要删除的用户",
        "Permission.del.1": "请选择需要删除的权限",
        "Permission.input.0": "输入权限组名称",
        "Permission.player": "选择一个玩家",
        "Permission.player.input": "离线|手动输入玩家名",
        "Permission.player.is": "在线 <=> 离线",
        "Permission.rname": "输入要修改的名称",
        "Potion.drop": "选择药水ID",
        "Potion.level": "药水效果等级",
        "Potion.lz": "关闭粒子效果",
        "Potion.time": "输入时长[秒]",
        "ban.broad": "§e[§d广播§e] §c玩家<{name}>已服务器被封禁! \n原因: <{reason}> 时间: <{time}>",
        "ban.broad.switch": "公开处刑 ｜ 广播到游戏内",
        "ban.input": "手动输入玩家",
        "ban.mode": "模式：在线<=>离线",
        "ban.player": "选择需要封禁的玩家",
        "ban.reason": "封禁原因",
        "ban.step.0": "封禁玩家",
        "ban.step.1": "解禁玩家",
        "ban.step.txt": "选择操作类型\n已选择",
        "ban.succes": "已向控制台发送封禁命令\nBan {} {} {}",
        "ban.time": "封禁时长(分钟)",
        "block.ui.light": "请输入光源等级",
        "block.ui.light.number": "请按要求输入数值！",
        "block.ui.succes.err": "获取失败！",
        "block.ui.succes.ok": "获取成功！",
        "block.ui.txt": "选择需要获取的方块",
        "close": "表单已放弃",
        "cmd": "{}管理工具",
        "cmd.add.err": "玩家<{}>已是插件管理，请勿重复添加！",
        "cmd.add.op": "玩家<{}>已设置为插件管理",
        "cmd.error": "错误！无访问权限！",
        "cmd.remove": "移除玩家<{}>的管理权限成功",
        "cmd.set": "{}管理工具｜设置",
        "cmd.xuid.err": "获取玩家<{}>的XUID失败！",
        "consolecmd.input": "• 输入待执行的命令",
        "crash.drop": "选择一个玩家",
        "crash.ui.succes.err": "崩溃玩家客户端失败！请重试",
        "crash.ui.succes.ok": "崩溃玩家客户端成功！",
        "getblock.input": "请输入数量",
        "gmode.slider.mode": "选择操作类型",
        "gmode.ui.slider.0": "生存",
        "gmode.ui.slider.1": "创造",
        "gmode.ui.slider.2": "冒险",
        "gmode.ui.slider.3": "旁观",
        "gmode.ui.slider.default": "default",
        "gmode.ui.slider.txt": "滑动选择模式\n\n<default>---<生存>----<创造>----<冒险>----<旁观>\n\n已选择",
        "gmode.ui.succes.err": "更改游戏模式失败! ",
        "gmode.ui.succes.ok": "更改游戏模式成功！\n<{}> => {}",
        "gmode.ui.swich.0": "更改自己",
        "gmode.ui.swich.1": "更改玩家",
        "grule.ui.modalform.0": "开启或关闭游戏规则\n",
        "grule.ui.modalform.1": "开启",
        "grule.ui.modalform.2": "关闭",
        "grule.ui.succes.err": "更改游戏规则失败",
        "grule.ui.succes.ok": "更改游戏规则完成\n{} => {}",
        "grule.ui.txt": "选择需要设置的游戏规则",
        "input.null": "检测到输入框为空，为避免出错已停止执行",
        "input.num": "检测到输入的内容<{}>不是数字，为避免出错已停止执行",
        "isForms.0": "模式表单\n一个文本框+两个按钮",
        "isForms.0.ok": "玩家<{}>选择了<{}>",
        "isForms.1": "普通表单1\n一个文本框+一个输入框",
        "isForms.2": "普通表单2\n一个文本框+一个开关",
        "isForms.3": "普通表单3\n一个文本框",
        "isForms.Playerinput": "玩家<{}>输入了<{}>",
        "isForms.Playerswitch": "玩家<{}>提交了表单，开关状态<{}>",
        "isForms.close": "玩家<{}>放弃了表单",
        "isForms.input.0": "输入文本框显示的内容",
        "isForms.input.button.0": "输入按钮1的文本",
        "isForms.input.button.1": "输入按钮2的文本",
        "isForms.input.tip": "输入框提示输入的内容",
        "isForms.sendPlayer": "请选择接受此表单的玩家",
        "isForms.switch.tip": "开关显示的内容",
        "isForms.title": "{} 表单构建器",
        "isForms?": "选择需要发送的表单类型",
        "isPem_List": "§l§a• 选择一个权限组",
        "item.succes.err": "清理失败，请重试！",
        "item.succes.ok": "清理成功！",
        "kick.drop": "选择需要踢出的玩家",
        "kick.input": "踢出时显示的内容",
        "kick.succes.err": "踢出玩家<{}>失败！",
        "kick.succes.ok": "踢出玩家<{}>成功！",
        "kill.drop": "选择一个需要Kill的玩家",
        "kill.succes.err": "Kill玩家<{}>失败！",
        "kill.succes.ok": "Kill玩家<{}>成功！",
        "main.ishere": "§a§l• 请选择选择一个操作",
        "motd.input": "输入要更改的Motd内容",
        "motd.succes.err": "更改MOTD失败，请重试",
        "motd.succes.ok": "成功更改MOTD为<{}>",
        "news.input": "输入待广播的内容",
        "news.slider.0": "普通消息",
        "news.slider.1": "聊天消息",
        "news.slider.2": "物品栏消息",
        "news.slider.txt": "选择广播等级 默认普通消息\n\n<普通消息>--------<聊天消息>--------<物品栏消息>\n\n已选择",
        "news.succes.err": "广播失败，请重试",
        "news.succes.ok": "广播成功！",
        "online.getxuid.error": "玩家不在线，在线获取XUID失败, 将使用name2xuid库查询",
        "permissionGroupHasNoPermission": "你所在的权限组没有任何可用功能！",
        "pl_cmd.drop": "选择一个玩家",
        "pl_cmd.input": "• 输入待执行的命令",
        "player.cmd.succes.err": "执行失败！请重试！",
        "player.cmd.succes.ok": "以玩家身份执行命令成功！\n<{}> => <{}>",
        "playerinfo": "玩家名: {name}\n玩家真名: {realname}\nXUID: {xuid}\nUUID: {uuid}\n坐标: {pos}\n上次死亡坐标: {deathpos}\n\nIP: {ip}\n延迟: {ping}\n丢包: {loss}\n系统: {os}\n平均延迟: {avgping}\n平均丢包: {avgloss}\n客户端识别ID: {id}",
        "playerinfo?": "选择需要查看的玩家",
        "potion.player": "选择一个玩家",
        "potionAdd": "添加药水效果",
        "potionDel": "移除所有药水效果",
        "reloads": "重载完成！",
        "rule.input.speed": "输入要设置的随机刻",
        "rule.speed.succes.err": "设置随机刻失败!",
        "rule.speed.succes.ok": "设置随机刻<{}>完成",
        "s_pl.txt": "选择一个玩家",
        "send_pl.succes.err": "发送消息失败！",
        "send_pl.succes.ok": "发送消息<{}>给<{}>成功！",
        "set.button.0": "插件设置",
        "set.button.1": "热重载插件",
        "set.button.2": "重载配置文件",
        "set.button.3": "权限组",
        "set.cleaner": "启用Cleaner API清理",
        "set.input.0": "踢出默认内容",
        "set.input.1": "广播消息头",
        "set.input.2": "清理掉落物命令(启用Cleaner时不可用)",
        "set.lang": "当前已加载语言：<{}>",
        "set.title": "§a{} §r| §d设置GUI",
        "set_mode.player": "选择一个玩家(更改自己时不可用",
        "set_pl.input": "输入要设置的最大人数",
        "set_pl.succes.err": "设置人数失败，请重试",
        "set_pl.succes.ok": "已设置最大人数为<{}>",
        "switch": "确认",
        "talk.ui.dropdown": "选择一个玩家(受害者)",
        "talk.ui.input": "输入要说的内容",
        "talk.ui.succes.err": "执行失败！请重试！",
        "talk.ui.succes.ok": "执行成功！",
        "tell.input.msg": "输入待发送的消息",
        "tell.input.title": "输入成就消息的标题",
        "tell.mode.0": "普通消息",
        "tell.mode.1": "聊天消息",
        "tell.mode.2": "成就消息",
        "tell.mode.3": "音乐盒消息",
        "tell.mode.4": "物品栏上方消息",
        "tell.send.mode": "选择发送消息显示的位置\n\n已选择",
        "time.slider.0": "上午",
        "time.slider.1": "中午",
        "time.slider.2": "傍晚",
        "time.slider.3": "晚上",
        "time.slider.4": "深夜",
        "time.slider.5": "凌晨",
        "time.slider.txt": "<上午>---<中午>--<傍晚>--<晚上>--<深夜>---<凌晨>\n\n已选择",
        "time.succes.err": "更改游戏时间为<{}>失败，请重试",
        "time.succes.ok": "成功更改游戏时间为<{}>",
        "time.txt": "滑动选择需要更改的时间",
        "tp.here.slider.0": "传送玩家",
        "tp.here.slider.1": "玩家传玩家",
        "tp.here.slider.2": "玩家传坐标",
        "tp.here.slider.txt": "<传送玩家>--------<玩家传玩家>-------<玩家传坐标>\n\n已选择",
        "tp.here.ui.txt": "滑动选择一个操作",
        "tp.mode": "选择操作类型\n\n已选择",
        "tp.player.Dimensions.0": "主世界",
        "tp.player.Dimensions.1": "地狱",
        "tp.player.Dimensions.2": "末地",
        "tp.player.Dimensions.txt": "选择一个维度",
        "tp.player.ui.drop.0": "选择一个需传送的玩家",
        "tp.player.ui.drop.1": "选择一个目标玩家",
        "tp.player.ui.input": "输入坐标 XYZ\n注：坐标XYZ请使用英文逗号隔开",
        "tp.player.ui.succes.err": "传送失败！请重试！",
        "tp.player.ui.succes.ok": "传送成功！\n<{}> => <{}>",
        "tp.player.ui.swich.0": "自己传送至玩家",
        "tp.player.ui.swich.1": "玩家传送至自己",
        "tp.player.ui.txt": "选择一个玩家",
        "tp.player.ui.xyz.succes.err": "传送失败！请检查输入坐标是否正确！\n§e坐标 §c<{}>",
        "tp.player.ui.xyz.succes.ok": "传送成功！<{}> => {}>{}",
        "unban.succes": "已向控制台发送解封命令\nUnBan {}",
        "weather.slider.0": "晴天",
        "weather.slider.1": "雨天",
        "weather.slider.2": "雷暴",
        "weather.slider.txt": "<晴天>---------------<雨天>---------------<雷暴>\n\n已选择",
        "weather.succes.err": "更改天气为<{}>失败！",
        "weather.succes.ok": "成功更改天气为<{}>",
        "weather.txt": "滑动选择需要更改的天气"
    }
})
/** 加载默认翻译文件 */
const Tr = i18n.tr;
logger.info(`The language file was loaded successfully <${Config.get('language')}>`);

/**
 *  设置初始内容
 *  版本/文件 检查
 */
mc.listen("onServerStarted", () => {
    const PROFILE_CHECK = { old: Config.get("version").replace(/,/g, "."), new: Config_init.Config.version }
    const HOME_PAGE_CHECK = { old: Main_Data.get("version").replace(/,/g, "."), new: Config_init.MainGUI.version }
    if (PROFILE_CHECK.old !== PROFILE_CHECK.new) logger.error(`The configuration file version does not match! \nCurrent version: ${PROFILE_CHECK.old} Latest version: ${PROFILE_CHECK.new}`);
    if (HOME_PAGE_CHECK.old !== HOME_PAGE_CHECK.new) logger.error(`The homepage file version does not match! \nCurrent version: ${HOME_PAGE_CHECK.old} Latest version: ${HOME_PAGE_CHECK.new}`);
    if (Config.get("Network")) {
        network.httpGet(`http://182.61.28.179:60003/api?type=${PLUGINS_NAME}`, (status, data) => {
            if (status !== -1) {
                const Get_JSON = JSON.parse(data);
                const Network_Version = Get_JSON.data[0].version;/* 设置获取的版本号 */
                logger.info(`[Network] ${Get_JSON.data[0].txt}`)/* 输出Get_JSON的data[0]数组的txt内容  网络公告 */
                if (Network_Version > PLUGINS_VERSION) {/* 进行版本检测匹配 */
                    logger.warn(`[Network] OPTools又有新版本啦 新版本号：${Network_Version} 请前往MineBBS下载新版本\n${PLUGINS_URL}`);
                }
            } else {
                logger.error(`[Network] 网络版本检查失败 状态码：${status}`);
            }
        })
    }
    if (Config.get("Motd_Enable")) {
        let MOTD_COUNT = 0;
        setInterval(() => {
            if (MOTD_COUNT == Config.get('Motd').length) MOTD_COUNT = 0;
            mc.setMotd(Config.get('Motd')[MOTD_COUNT]);
            MOTD_COUNT++;
        }, Config.get('Motd_Time'));
    }

    if (Config.get('BindCmd')) BindCmd();
    load_BlackCmd();
})

/**
 *  真命令注册
 */
const Cmd = mc.newCommand('tools', Tr("cmd", PLUGINS_NAME), PermType.Any);
Cmd.setAlias('optools');
Cmd.setEnum("ChangeAction", ["add", "remove"]);
Cmd.setEnum("ListAction", ["gui", "set", "reload"]);
Cmd.mandatory("action", ParamType.Enum, "ChangeAction", 1);
Cmd.optional("action", ParamType.Enum, "ListAction", 1);
Cmd.mandatory("name", ParamType.RawText);
Cmd.overload(["ChangeAction", "name"]);
Cmd.overload(["ListAction"]);
Cmd.setCallback((cmd, ori, out, res) => {
    let tmp = User_Data.get('op'); let plxuid; let Pl_Object; logger.debug(res.name);
    switch (res.action) {
        case "add":
            if (ori.type !== 7) return out.error('No permission, this command is only used by the console!');
            Pl_Object = mc.getPlayer(res.name);/* 尝试在线获取玩家对象 */
            if (Pl_Object == null) {/* 获取失败 */
                out.success(Tr("online.getxuid.error"));
                plxuid = data.name2xuid(res.name);/* 在线获取失败,离线库查询 */
            } else {/* 获取成功 */
                plxuid = Pl_Object.xuid;
            }
            if (tmp.indexOf(plxuid) == -1) {
                if (plxuid == '') {
                    out.error(Tr("cmd.xuid.err", res.name));
                } else {
                    out.success(Tr("cmd.add.op", res.name));
                    tmp.push(plxuid)
                    User_Data.set('op', tmp);
                }
            } else {
                out.error(Tr("cmd.add.err", res.name));
            }
            break;
        case "remove":
            if (ori.type !== 7) return out.error('No permission, this command is only used by the console!');
            Pl_Object = mc.getPlayer(res.name);/* 尝试在线获取玩家对象 */
            if (Pl_Object == null) {/* 获取失败 */
                out.success(Tr("online.getxuid.error"));
                plxuid = data.name2xuid(res.name);/* 在线获取失败,离线库查询 */
            } else {/* 获取成功 */
                plxuid = Pl_Object.xuid;
            };
            if (tmp.indexOf(plxuid) == -1) {
                out.error(Tr("cmd.xuid.err", res.name));
            } else {
                tmp.splice(tmp.indexOf(plxuid), 1);
                User_Data.set('op', tmp);
                out.success(Tr("cmd.remove", res.name));
            }
            break;
        case "reload":
            if (ori.type !== 7) return out.error('No permission, this command is only used by the console!');
            Reloads();
            out.success(Tr('reloads'))
            break;
        case "set":
            if (ori.type == 7) { return out.error('This command can only be executed by players! Do not use this command on the console.') }
            if (ori.type !== 0) { return out.error('This command can only be executed by players!') }
            if (!Func_Module.qx(ori.player)) {
                return out.error(Gm_Tell + Tr("cmd.error"))
            };
            Main_Set(ori.player);
            break;
        default:
            if (ori.type == 7) { return out.error('This command can only be executed by players! Do not use this command on the console.') }
            if (ori.type !== 0) { return out.error('This command can only be executed by players!') }
            if (!Func_Module.qx(ori.player)) {
                if (!Permission_Group.USERS_GROUP(ori.player.xuid) == 1 || Permission_Group.USERS_GROUP(ori.player.xuid) == null) {
                    return out.error(Gm_Tell + Tr("cmd.error"))
                };
            };
            Main(ori.player, Main_Data.get('Main'));
            break;
    }
})
Cmd.setup();

/**
 *  GUI设置
 */
function Main_Set(pl) {
    const fm = Func_Module.SimpleForm();
    fm.setTitle(Tr("set.title", PLUGINS_NAME));
    fm.setContent(Tr("Permission.Group.type"));
    fm.addButton(Tr("set.button.0"), "textures/ui/icon_setting.png");/* 设置 */
    fm.addButton(Tr("set.button.3"), "textures/ui/icon_multiplayer.png");
    /* fm.addButton(Tr("set.button.1"), "textures/ui/refresh.png");重载 */
    fm.addButton(Tr("set.button.2"), "textures/ui/refresh_light.png");/* 配置文件 */
    pl.sendForm(fm, (pl, id) => {
        if (id == null) { Close_Tell(pl); return };
        switch (id) {
            case 0:
                Seting(pl)
                function Seting(pl) {
                    const fm = Func_Module.CustomForm();
                    fm.addLabel(Tr("set.lang", Config.get("language")));
                    fm.addInput(Tr("set.input.0"), "String", Config.get("Kick_Txt"));
                    fm.addInput(Tr("set.input.1"), "String", Config.get("Broad_head"));
                    fm.addInput(Tr("set.input.2"), "String", Config.get("Clear_Cmd"));
                    fm.addSwitch(Tr("set.cleaner"), Func_Module.isTrue_false(Config.get("Cleaner_API")));
                    pl.sendForm(fm, (pl, data) => {
                        if (data == null) return Close_Tell(pl);
                        Config.set("Kick_Txt", data[1]);
                        Config.set("Broad_head", data[2]);
                        Config.set("Clear_Cmd", data[3]);
                        Config.set("Cleaner_API", data[4]);
                    })
                }
                break;
            case 1:
                /* 权限组 */
                isPermission_Group(pl);
                break;
            case 2:
                /* if (CmdEx(`ll reload ${PLUGINS_NAME}.js`)) {
                    pl.tell(Gm_Tell + Tr("reloads"))
                }
                break;
            case 3: */
                Reloads()
                pl.tell(Gm_Tell + Tr("reloads"))
                break;
        }
        /* 操作权限组 */
        function isPermission_Group(pl) {
            let fm = mc.newSimpleForm();
            fm.setTitle(Tr("Permission.Group.title", PLUGINS_NAME));
            fm.setContent(Tr("Permission.Group.type"));
            fm.addButton(Tr("Permission.button.0"), "textures/ui/icon_book_writable.png");/* 0 */
            fm.addButton(Tr("Permission.button.1"), "textures/ui/color_plus.png");/* 1 */
            fm.addButton(Tr("Permission.button.2"), "textures/ui/icon_book_writable.png");/* 2 */
            fm.addButton(Tr("Permission.button.3"), "textures/ui/gear.png");/* 3 */
            fm.addButton(Tr("Permission.button.4"), "textures/ui/FriendsDiversity.png");/* 4 */
            fm.addButton(Tr("Permission.button.5"), "textures/ui/gear.png");/* 5 */
            fm.addButton(Tr("Permission.button.6"), "textures/ui/magnifyingGlass.png");/* 6 */
            fm.addButton(Tr("Permission.button.7"), "textures/ui/realms_red_x.png");/* 7 */
            fm.addButton(Tr("Permission.button.8"), "textures/ui/icon_import.png");/* 8 */
            pl.sendForm(fm, (pl, id) => {
                switch (id) {
                    case 0:
                        list(pl);
                        function list(pl) {
                            let arr = User_Data.get('user');
                            let fm = mc.newCustomForm();
                            fm.setTitle(Tr("Permission.Group.title", PLUGINS_NAME));
                            arr.forEach((i) => {
                                fm.addLabel(Tr("Permission.Group.all.list", {
                                    name: i.name,
                                    guid: i.guid,
                                    Permission: i.Permission.join().replace(/,/g, `§r §l§e| §r`),
                                    data: i.data.join().replace(/,/g, `§r §l§e| §r`)
                                }));
                            });
                            pl.sendForm(fm, (pl, dt) => {
                                return isContinue(pl)
                            })
                        }
                        break;
                    case 1:
                        add(pl);
                        function add(pl) {
                            let fm = mc.newCustomForm();
                            fm.setTitle(Tr("Permission.Group.title", PLUGINS_NAME));
                            fm.addInput(Tr("Permission.input.0"), 'String');
                            pl.sendForm(fm, (pl, dt) => {
                                if (dt[0] !== '') {
                                    Permission_Group.CREATE_GROUP(dt[0]);
                                    return isContinue(pl)
                                } else {
                                    pl.tell(Gm_Tell + Tr("input.null"))
                                }
                            })
                        }
                        break;
                    case 2:
                        isPem_List(pl, arr => {
                            Appoint(pl, arr.guid)
                            function Appoint(pl, guid) {
                                let i = Permission_Group.GET_GROUP(guid);
                                let fm = mc.newCustomForm();
                                fm.setTitle(Tr("Permission.Group.title", PLUGINS_NAME));
                                fm.addLabel(Tr("Permission.Group.all.list", {
                                    name: i.name,
                                    guid: i.guid,
                                    Permission: i.Permission.join().replace(/,/g, `§r §l§e| §r`),
                                    data: i.data.join().replace(/,/g, `§r §l§e| §r`)
                                }));
                                pl.sendForm(fm, (pl, dt) => {
                                    return isContinue(pl)
                                })
                            }
                        })
                        break;
                    case 3:/* 修改权限组权限 */
                        isType(pl, dt => {
                            switch (dt.type) {
                                case true:
                                    /* add */
                                    Operating_Permissions_Users(pl, 'prem', 'add', dt.guid);
                                    break;
                                case false:
                                    /* del */
                                    Operating_Permissions_Users(pl, 'prem', 'del', dt.guid);
                                    break;
                                default:
                                    Close_Tell(pl);
                                    break;
                            }
                        })
                        break;
                    case 4:/* 修改权限组用户 */
                        isType(pl, dt => {
                            switch (dt.type) {
                                case true:
                                    /* add */
                                    Operating_Permissions_Users(pl, 'user', 'add', dt.guid);
                                    break;
                                case false:
                                    /* del */
                                    Operating_Permissions_Users(pl, 'user', 'del', dt.guid);
                                    break;
                                default:
                                    Close_Tell(pl);
                                    break;
                            }
                        })
                        break;
                    case 5:/* 修改权限组名称 */
                        isPem_List(pl, dt => {
                            Operating_Permissions_Users(pl, 'name', 'null', dt.guid)
                        })
                        break;
                    case 6:/* 查询用户所在权限组 */
                        serach(pl);
                        function serach(pl) {
                            let arry = [];
                            mc.getOnlinePlayers().forEach(pl => {
                                arry.push(pl.realName);
                            })
                            let fm = mc.newCustomForm();
                            fm.setTitle(Tr("Permission.Group.title", PLUGINS_NAME));
                            fm.addDropdown(Tr("Permission.player"), arry);
                            fm.addInput(Tr("Permission.player.input"), 'String');
                            fm.addSwitch(Tr("Permission.player.is"));
                            pl.sendForm(fm, (pl, dt) => {
                                if (dt == null) return Close_Tell(pl);
                                let gdt;
                                if (dt[2] == 0) {/* 判断在线/离线 */
                                    gdt = mc.getPlayer(arry[dt[0]]).xuid;
                                } else {
                                    if (dt[1] !== '') {
                                        gdt = data.name2xuid(dt[1])
                                    } else {
                                        pl.tell(Gm_Tell + Tr("input.null"))
                                    }
                                };
                                sok(pl)
                                function sok(pl) {
                                    let i = Permission_Group.USERS_GROUP(gdt);
                                    if (i == null || i == undefined) return Close_Tell(pl);
                                    logger.debug(i);
                                    let fm = mc.newCustomForm();
                                    fm.setTitle(Tr("Permission.Group.title", PLUGINS_NAME));
                                    fm.addLabel(Tr("Permission.Group.all.list", {
                                        name: i.name,
                                        guid: i.guid,
                                        Permission: i.Permission.join().replace(/,/g, `§r §l§e| §r`),
                                        data: i.data.join().replace(/,/g, `§r §l§e| §r`)
                                    }));
                                    pl.sendForm(fm, (pl, dt) => {
                                        return isContinue(pl)
                                    })
                                }
                            })
                        }
                        break;
                    case 7:/* 删除一个权限组 */
                        isPem_List(pl, dt => {
                            pl.sendModalForm(
                                Tr("Permission.Group.title", PLUGINS_NAME),
                                `§eAre you sure you want to delete the permission group <${dt.name}>?`,
                                '§cYes',
                                '§aNo',
                                (pl, res) => {
                                    if (res == null || res == false) return Close_Tell(pl);
                                    if (res == true) {
                                        Permission_Group.DELETE_GROUP(dt.guid);
                                        return isContinue(pl);
                                    }
                                }
                            )
                        })
                        break;
                    case 8:
                        Main_Set(pl);
                        break;
                    default:
                        Close_Tell(pl)
                        break;
                }
            })
        }
        /**
         * 操作权限/用户
         * @param {*} pl 玩家对象
         * @param {*} value 操作类别 user/perm/name
         * @param {*} type 操作类型 add/del
         * @param {*} guid 权限组ID
         */
        function Operating_Permissions_Users(pl, value, type, guid) {
            let arr;/* 初始数据 */let Arry = [];/* 处理后数据 */;
            switch (value) {
                case "user":
                    switch (type) {
                        case "add":/* 添加用户 */
                            arr = Permission_Group.GET_GROUP(guid);
                            mc.getOnlinePlayers().forEach(pl => {
                                Arry.push(pl.realName);
                            }); UI_1(pl);
                            function UI_1(pl) {
                                let fm = mc.newCustomForm();
                                fm.setTitle(Tr("Permission.Group.title", PLUGINS_NAME));
                                fm.addLabel(`${arr.name}\n${arr.guid}`);
                                fm.addDropdown(Tr("Permission.player"), Arry);
                                fm.addInput(Tr("Permission.player.input"), 'String');
                                fm.addSwitch(Tr("Permission.player.is"));
                                pl.sendForm(fm, (pl, dt) => {
                                    if (dt == null) return Close_Tell(pl);
                                    let gdt;
                                    if (dt[3] == 0) {/* 判断在线/离线 */
                                        gdt = mc.getPlayer(Arry[dt[1]]).xuid;
                                    } else {
                                        if (dt[2] !== '') {
                                            gdt = data.name2xuid(dt[2])
                                        } else {
                                            return pl.tell(Gm_Tell + Tr("input.null"))
                                        }
                                    }
                                    Permission_Group.ADD_USER(arr.guid, gdt);
                                    return isContinue(pl);
                                })
                            }
                            break;
                        case "del":/* 删除用户 */
                            arr = Permission_Group.GET_GROUP(guid);
                            arr.data.forEach(i => {
                                Arry.push(data.xuid2name(i))
                            }); UI_2(pl);
                            function UI_2(pl) {
                                let fm = mc.newCustomForm();
                                fm.setTitle(Tr("Permission.Group.title", PLUGINS_NAME));
                                fm.addLabel(`${arr.name}\n${arr.guid}`);
                                fm.addDropdown(Tr("Permission.del.0"), Arry);
                                pl.sendForm(fm, (pl, dt) => {
                                    if (dt == null) return Close_Tell(pl);
                                    Permission_Group.DELETE_USER(arr.guid, arr.data[dt[1]]);
                                    return isContinue(pl)
                                })
                            }
                            break;
                    }
                    break;
                case "prem":
                    switch (type) {
                        case "add":/* 添加权限 */
                            logger.debug('1')
                            arr = Permission_Group.GET_GROUP(guid);
                            Main_Data.get('Main').forEach(i => {
                                Arry.push(i.name);
                            }); UI_3(pl);
                            function UI_3(pl) {
                                let fm = mc.newCustomForm();
                                fm.setTitle(Tr("Permission.Group.title", PLUGINS_NAME));
                                fm.addLabel(`${arr.name}\n${arr.guid}`);
                                fm.addDropdown(Tr("Permission.add.0"), Arry);
                                pl.sendForm(fm, (pl, dt) => {
                                    if (dt == null) return Close_Tell(pl);
                                    Permission_Group.ADD_PERMISSION(arr.guid, Main_Data.get('Main')[dt[1]].open);
                                    return isContinue(pl)
                                })
                            }
                            break;
                        case "del":/* 删除权限 */
                            arr = Permission_Group.GET_GROUP(guid);
                            arr.Permission.forEach(i => {
                                Arry.push(i);
                            }); UI_4(pl);
                            function UI_4(pl) {
                                let fm = mc.newCustomForm();
                                fm.setTitle(Tr("Permission.Group.title", PLUGINS_NAME));
                                fm.addLabel(`${arr.name}\n${arr.guid}`);
                                fm.addDropdown(Tr("Permission.del.1"), Arry);
                                pl.sendForm(fm, (pl, dt) => {
                                    if (dt == null) return Close_Tell(pl);
                                    Permission_Group.DELETE_PERMISSIONS(arr.guid, arr.data[dt[1]]);
                                    return isContinue(pl)
                                })
                            }
                            break;
                    }
                    break;
                case "name":/* 修改名称 */
                    arr = Permission_Group.GET_GROUP(guid); UI_5(pl);
                    function UI_5(pl) {
                        let fm = mc.newCustomForm();
                        fm.setTitle(Tr("Permission.Group.title", PLUGINS_NAME));
                        fm.addLabel(`${arr.name}\n${arr.guid}`);
                        fm.addInput(Tr("Permission.rname"), 'String');
                        pl.sendForm(fm, (pl, dt) => {
                            if (dt == null) return Close_Tell(pl);
                            if (dt[1] !== '') {
                                if (dt[1] !== arr.name) {
                                    Permission_Group.RENAME_GROUP(arr.guid, dt[1]);
                                    return isContinue(pl)
                                } else {
                                    UI_5(pl);
                                }
                            } else {
                                pl.tell(Gm_Tell + Tr('input.null'))
                            }
                        })
                    }
                    break;
            }
        }
        /**
         * 操作类型
         * @param {*} pl 玩家对象
         * @param {*} callback true/false/null
         */
        function isType(pl, callback) {
            isPem_List(pl, dt => {
                pl.sendModalForm(
                    Tr(Tr("Permission.Group.title", PLUGINS_NAME)),
                    Tr("Permission.Group.type"),
                    Tr("Permission.Group.type0"),
                    Tr("Permission.Group.type1"),
                    (pl, dts) => {
                        callback({
                            "guid": dt.guid,
                            "type": dts
                        })
                    }
                )
            })
        }
        /**
         * 选择权限组
         * @param {*} pl 玩家对象
         * @param {*} callback 回调 名称 guid
         */
        function isPem_List(pl, callback) {
            let arr = Permission_Group.ALL_GROUPS();
            let fm = mc.newSimpleForm();
            fm.setTitle(Tr("Permission.Group.title", PLUGINS_NAME));
            fm.setContent(Tr("isPem_List"));
            arr.forEach(i => {
                fm.addButton(`${i.name}\n${i.guid}`);
            })
            pl.sendForm(fm, (pl, id) => {
                if (id == null) return Close_Tell(pl);
                callback(arr[id])
            })
        }
        /**
         * !权限组操作结束询问
         * @param {*} pl 玩家对象
         */
        function isContinue(pl) {
            pl.sendModalForm(
                Tr("Permission.Group.title", PLUGINS_NAME),
                Tr("Permission.Group.Continue"),
                Tr("Permission.Group.Continue0"),
                Tr("Permission.Group.Continue1"),
                (pl, dt) => {
                    if (dt) {
                        isPermission_Group(pl)
                    } else {
                        return Close_Tell(pl)
                    }
                }
            )
        }
    })
}

/* 映射表 */
const MAPPING_TABLE = {
    "Kick_Ui": Kick_Ui,
    "Kill_Ui": Kill_Ui,
    "Weather_Ui": Weather_Ui,
    "Time_Ui": Time_Ui,
    "Broad_Ui": Broad_Ui,
    "Motd_Ui": Motd_Ui,
    "Set_Player_Ui": Set_Player_Ui,
    "Tp_Ui": Tp_Ui,
    "Clear_Item_Ui": Clear_Item_Ui,
    "setMode_Ui": setMode_Ui,
    "setRule_Ui": setRule_Ui,
    "getBlock_Ui": getBlock_Ui,
    "Crash_Ui": Crash_Ui,
    "Player_Talk_Ui": Player_Talk_Ui,
    "ConsoleCmd_Ui": ConsoleCmd_Ui,
    "sendPlayer_Ui": sendPlayer_Ui,
    "Player_Cmd_Ui": Player_Cmd_Ui,
    "Ban_Ui": Ban_Ui,
    "Forms_Ui": isForms,
    "Info_Ui": PlayerInfo,
    "Black_Cmd_Ui": BlackCmd_Ui,
    "Potion_Ui": Potion_Ui,
};

/**
 * GUI主页
 * @param {Object} pl 玩家对象
 * @param {Array} Arry 菜单数组
 */
function Main(pl, Arry) {
    const fm = Func_Module.SimpleForm();
    fm.setContent(Tr("main.ishere"));
    const Bt = Arry; let new_Arry = [];/* 存储有权限的功能 */
    Bt.forEach((i) => {
        /* 判断用户是否为管理员 */
        if (!Func_Module.qx(pl)) {
            /* 不是管理员，检查可用权限 */
            if (Permission_Group.CHECK_PERMISSIONS(pl.xuid, i.open)) {
                fm.addButton(i.name, i.image);
                new_Arry.push(i);
            }
        } else {/* 是管理员 */
            fm.addButton(i.name, i.image);
            new_Arry.push(i);
        }
    });
    if (new_Arry.length == 0) return pl.tell(Tr("permissionGroupHasNoPermission"));
    pl.sendForm(fm, (pl, id) => {
        if (id == null) return Close_Tell(pl);
        const sw = new_Arry[id];
        switch (sw.type) {
            case "inside":
                MAPPING_TABLE[sw.open](pl);
                break;
            case "command":
                pl.runcmd(sw.open);
                break;
            case "form":
                if (!File.exists(Path + `Data\\${sw.open}.json`)) {
                    File.writeTo(Path + `Data\\${sw.open}.json`, '[]');
                    return pl.tell(`§c§l文件<${sw.open}.json>不存在！`, 5);
                }; let Menu_Arry;
                try {
                    Menu_Arry = JSON.parse(File.readFrom(Path + `Data\\${sw.open}.json`));
                } catch (e) {
                    if (e instanceof SyntaxError) {
                        return pl.tell(`§c§l文件<${sw.open}.json>语法错误！`, 5);
                    }
                };
                logger.debug(Menu_Arry);
                Main(pl, Menu_Arry);
                break;
        }
    })
}

/* 踢出玩家 */
function Kick_Ui(pl) {
    const Online_Players = Func_Module.GET_ALL_ONLINE_PLAYERS();
    const fm = Func_Module.CustomForm();
    fm.addDropdown(Tr("kick.drop"), Online_Players, 0);
    fm.addInput(Tr("kick.input"), "String", Config.get("Kick_Txt"));
    pl.sendForm(fm, (pl, data) => {
        if (data == null) return Close_Tell(pl);
        if (mc.getPlayer(Online_Players[data[0]]).kick(data[1])) {
            pl.tell(Gm_Tell + Tr("kick.succes.ok", Online_Players[data[0]]));
        } else {
            pl.tell(Gm_Tell + Tr("kick.succes.err", Online_Players[data[0]]));
        }
    })
}

/* 杀死玩家 */
function Kill_Ui(pl) {
    const Online_Players = Func_Module.GET_ALL_ONLINE_PLAYERS();
    const fm = Func_Module.CustomForm();
    fm.addDropdown(Tr("kill.drop"), Online_Players, 0)
    pl.sendForm(fm, (pl, data) => {
        if (data == null) return Close_Tell(pl);
        if (mc.getPlayer(Online_Players[data[0]]).kill()) {
            pl.tell(Gm_Tell + Tr("kill.succes.ok", Online_Players[data[0]]));
        } else {
            pl.tell(Gm_Tell + Tr("kill.succes.err", Online_Players[data[0]]));
        }
    })
}

/* 更改天气 */
function Weather_Ui(pl) {
    const fm = Func_Module.CustomForm();
    const arr = Array.of(Tr("weather.slider.0"), Tr("weather.slider.1"), Tr("weather.slider.2"));
    fm.addLabel(Tr("weather.txt"));
    fm.addStepSlider(Tr("weather.slider.txt"), arr, 0);
    pl.sendForm(fm, (pl, data) => {
        if (data == null) return Close_Tell(pl);
        if (mc.setWeather(data[1])) {
            pl.tell(Gm_Tell + Tr("weather.succes.ok", arr[data[1]]));
        } else {
            pl.tell(Gm_Tell + Tr("weather.succes.err", arr[data[1]]));
        }
    })
}

/* 更改时间 */
function Time_Ui(pl) {
    const arr = Array.of(Tr("time.slider.0"), Tr("time.slider.1"), Tr("time.slider.2"), Tr("time.slider.3"), Tr("time.slider.4"), Tr("time.slider.5"));
    const fm = Func_Module.CustomForm();
    fm.addLabel(Tr("time.txt"));
    fm.addStepSlider(Tr("time.slider.txt"), arr);
    pl.sendForm(fm, (pl, data) => {
        if (data == null) return Close_Tell(pl);
        const timeMap = {
            0: "day",
            1: "noon",
            2: "sunset",
            3: "night",
            4: "midnight",
            5: "sunrise"
        };
        if (CmdEx(`time set ${timeMap[data[1]]}`)) {
            pl.tell(Gm_Tell + Tr("time.succes.ok", arr[data[1]]));
        } else {
            pl.tell(Gm_Tell + Tr("time.succes.err", arr[data[0]]));
        }
    })
}

/* 广播消息 */
function Broad_Ui(pl) {
    const fm = Func_Module.CustomForm();
    fm.addInput(Tr("news.input"), 'String');
    fm.addStepSlider(Tr("news.slider.txt"), [Tr("news.slider.0"), Tr("news.slider.1"), Tr("news.slider.2")]);
    pl.sendForm(fm, (pl, data) => {
        if (data == null) return Close_Tell(pl);
        if (data[0] == '') {
            pl.tell(Gm_Tell + Tr("input.null"));
        } else {
            const broadMap = {
                0: 0,
                1: 1,
                2: 5
            };
            if (Func_Module.Broad(`${Config.get("Broad_head")}${data[0]}`, broadMap[data[1]])) {
                pl.tell(Gm_Tell + Tr("news.succes.ok"));
            } else {
                pl.tell(Gm_Tell + Tr("news.succes.err"));
            }
        }
    })
}

/* 设置MOTD */
function Motd_Ui(pl) {
    if (Config.get("Motd_Enable")) {
        const StepSliderArray = Tr('motd.StepSlider.Array').split(',');
        let MotdArray = Config.get('Motd');
        const fm = Func_Module.CustomForm();
        fm.addDropdown(Tr('motd.dropdown'), MotdArray, 0);
        fm.addInput(Tr("motd.input"), 'String');
        fm.addStepSlider(Tr('motd.StepSlider'), StepSliderArray);/* 滑动选择框 添加/更改/删除 */
        pl.sendForm(fm, (pl, dt) => {
            if (dt == null) return Close_Tell(pl);
            switch (dt[2]) {
                case 0:
                    if (dt[1] == '') return pl.tell(Gm_Tell + Tr("input.null"));
                    MotdArray.push(dt[1]);
                    Config.set('Motd', MotdArray);
                    pl.tell(Gm_Tell + Tr('motd.succes', { 0: StepSliderArray[dt[2]], 1: dt[1] }));
                    break;
                case 1:
                    if (dt[1] == '') return pl.tell(Gm_Tell + Tr("input.null"));
                    MotdArray[dt[0]] = dt[1];
                    Config.set('Motd', MotdArray);
                    pl.tell(Gm_Tell + Tr('motd.succes', { 0: StepSliderArray[dt[2]], 1: dt[1] }));
                    break;
                case 2:
                    pl.tell(Gm_Tell + Tr('motd.succes', { 0: StepSliderArray[dt[2]], 1: MotdArray[dt[0]] }));
                    MotdArray.splice(dt[0], 1);
                    Config.set('Motd', MotdArray);
                    break;
            }
        })
    } else {
        pl.tell(Gm_Tell + "ERROR Motd_Enable: false");
    }
}

/* 设置人数 */
function Set_Player_Ui(pl) {
    const fm = Func_Module.CustomForm();
    fm.addInput(Tr("set_pl.input"), 'num');
    pl.sendForm(fm, (pl, data) => {
        if (data == null) return Close_Tell(pl);
        if (data[0] == '') {
            pl.tell(Gm_Tell + Tr("input.null"));
        } else {
            if (Func_Module.num(data[0])) {
                if (mc.setMaxPlayers(Number(data[0])) == 1) {
                    pl.tell(Gm_Tell + Tr("set_pl.succes.ok", data[0]));
                } else {
                    pl.tell(Gm_Tell + Tr("set_pl.succes.err"));
                }
            } else {
                pl.tell(Gm_Tell + Tr("input.num"));
            }
        }
    })
}

/* 清理掉落物 */
function Clear_Item_Ui(pl) {
    if (Config.get("Cleaner_API") !== 1) {
        if (CmdEx(Config.get("Clear_Cmd"))) {
            pl.tell(Gm_Tell + Tr("item.succes.ok"));
        } else {
            pl.tell(Gm_Tell + Tr("item.succes.err"));
        }
    } else {
        const CleanerAPI = { /* Cleaner_API导入 */
            ReloadCLeaner: ll.import("Cleaner", "ReloadCleaner"),
            Clean: ll.import("Cleaner", "Clean"),
            CleanMain: ll.import("Cleaner", "CleanMain"),
            GetAverageTPS: ll.import("Cleaner", "GetAverageTPS"),
            GetCurrentTPS: ll.import("Cleaner", "GetCurrentTPS"),
            Despawn: ll.import("Cleaner", "Despawn")
        };
        CleanerAPI.Clean();/* 执行清理任务 */
    }
}

/* 选择传送类型 */
function Tp_Ui(pl) {
    const fm = Func_Module.CustomForm();
    fm.addLabel(Tr("tp.here.ui.txt"));
    fm.addStepSlider(Tr("tp.here.slider.txt"), [Tr("tp.here.slider.0"), Tr("tp.here.slider.1"), Tr("tp.here.slider.2")]);
    pl.sendForm(fm, (pl, id) => {
        if (id == null) return Close_Tell(pl);
        switch (id[1]) {
            case 0:
                /* 传送至玩家 */
                _Tp_Player(pl)
                function _Tp_Player(pl) {
                    const Online_Players = Func_Module.GET_ALL_ONLINE_PLAYERS();
                    const fm = Func_Module.CustomForm();
                    fm.addDropdown(Tr("tp.player.ui.txt"), Online_Players, 0);
                    fm.addStepSlider(Tr("tp.mode"), [Tr("tp.player.ui.swich.0"), Tr("tp.player.ui.swich.1")]);
                    pl.sendForm(fm, (pl, data) => {
                        if (data == null) return Close_Tell(pl);
                        switch (data[1]) {
                            case 0:
                                /* 自己》玩家 */
                                if (Func_Module.Tep(pl, mc.getPlayer(Online_Players[data[0]]).pos)) {
                                    pl.tell(Gm_Tell + Tr("tp.player.ui.succes.ok", pl.realName, Online_Players[data[0]]));
                                } else {
                                    pl.tell(Gm_Tell + Tr("tp.player.ui.succes.err"));
                                }
                                break;
                            case 1:
                                /* 玩家》自己 */
                                if (Func_Module.Tep(mc.getPlayer(Online_Players[data[0]]), pl.pos)) {
                                    pl.tell(Gm_Tell + Tr("tp.player.ui.succes.ok", Online_Players(data[0]), pl.realName));
                                } else {
                                    pl.tell(Gm_Tell + Tr("tp.player.ui.succes.err"));
                                }
                                break;
                        }
                    })
                }
                break;
            case 1:
                /* 玩家传玩家 */
                _Tp_Player_Player(pl)
                function _Tp_Player_Player(pl) {
                    const Online_Players = Func_Module.GET_ALL_ONLINE_PLAYERS();
                    const fm = Func_Module.CustomForm();
                    fm.addDropdown(Tr("tp.player.ui.drop.0"), Online_Players, 0);
                    fm.addDropdown(Tr("tp.player.ui.drop.1"), Online_Players, 0);
                    pl.sendForm(fm, (pl, data) => {
                        if (data == null) return Close_Tell(pl);
                        if (Func_Module.Tep(mc.getPlayer(Online_Players[data[0]]), mc.getPlayer(Online_Players[data[1]]).pos)) {
                            pl.tell(Gm_Tell + Tr("tp.player.ui.succes.ok", Online_Players[data[0]], Online_Players[data[1]]));
                        } else {
                            pl.tell(Gm_Tell + Tr("tp.player.ui.succes.err"));
                        }
                    })
                }
                break;
            case 2:
                /* 玩家传坐标 */
                _Tp_Player_XYZ(pl)
                function _Tp_Player_XYZ(pl) {
                    const arr = Array.of(Tr("tp.player.Dimensions.0"), Tr("tp.player.Dimensions.1"), Tr("tp.player.Dimensions.2"));
                    const Online_Players = Func_Module.GET_ALL_ONLINE_PLAYERS();
                    const fm = Func_Module.CustomForm();
                    fm.addDropdown(Tr("tp.player.ui.txt"), Online_Players, 0);       /* data 0 */
                    fm.addDropdown(Tr("tp.player.Dimensions.txt"), arr);/* data 1 */
                    fm.addInput(Tr("tp.player.ui.input"), 'X,Y,Z');       /* data 2 */
                    pl.sendForm(fm, (pl, data) => {
                        if (data == null) return Close_Tell(pl);
                        if (data[2] == '') {
                            pl.tell(Gm_Tell + Tr("input.null"));
                        } else {
                            /* 参数类型转换 */
                            const XYZ = data[2].split(",");
                            const pos = new IntPos(parseInt(XYZ[0]), parseInt(XYZ[1]), parseInt(XYZ[2]), parseInt(data[1]));
                            if (mc.getPlayer(Online_Players[data[0]]).teleport(pos)) {
                                pl.tell(Gm_Tell + Tr("tp.player.ui.xyz.succes.ok", Online_Players[data[0]], arr[data[1]], data[2]));
                            } else {
                                pl.tell(Gm_Tell + Tr("tp.player.ui.xyz.succes.err", data[2]));
                            }
                        }
                    })
                }
                break;
        }
    })
}

/* 更改游戏模式 */
function setMode_Ui(pl) {
    const arr = Array.of(Tr("gmode.ui.slider.default"), Tr("gmode.ui.slider.0"), Tr("gmode.ui.slider.1"), Tr("gmode.ui.slider.2"), Tr("gmode.ui.slider.3"));
    const Online_Players = Func_Module.GET_ALL_ONLINE_PLAYERS();
    const fm = Func_Module.CustomForm();
    fm.addDropdown(Tr("set_mode.player"), Online_Players, 0);
    fm.addStepSlider(Tr("gmode.ui.slider.txt"), arr);
    fm.addStepSlider(Tr("gmode.slider.mode"), [Tr("gmode.ui.swich.0"), Tr("gmode.ui.swich.1")]);
    pl.sendForm(fm, (pl, data) => {
        if (data == null) return Close_Tell(pl);
        const gmodeStatusMap = {
            0: "5",
            1: "0",
            2: "1",
            3: "2",
            4: "6"
        };
        if (data[2] == 0) {
            /* 更改自己 */
            if (pl.setGameMode(parseInt(gmodeStatusMap[data[1]]))) {
                pl.tell(Gm_Tell + Tr("gmode.ui.succes.ok", pl.realName, arr[data[1]]));
            } else {
                pl.tell(Gm_Tell + Tr("gmode.ui.succes.err"));
            }
        } else {/* 更改玩家 */
            if (mc.getPlayer(Online_Players[data[0]]).setGameMode(parseInt(gmodeStatusMap[data[1]]))) {
                pl.tell(Gm_Tell + Tr("gmode.ui.succes.ok", Online_Players[data[0]], arr[data[1]]));
            } else {
                pl.tell(Gm_Tell + Tr("gmode.ui.succes.err"));
            }
        }
    })
}

/* 游戏规则 */
function setRule_Ui(pl) {
    const gamerule = Button_Data.get("Rule");
    const fm = Func_Module.SimpleForm();
    fm.setContent(Tr("grule.ui.txt"));
    gamerule.forEach(i => {
        fm.addButton(i.name, i.image);
    })
    pl.sendForm(fm, (pl, id) => {
        if (id == null) return Close_Tell(pl);
        /* 为设置随机刻增加GUI */
        if (gamerule[id].type == "randomTickSpeed") {
            speed(pl);
            function speed(pl) {
                const fm = Func_Module.CustomForm();
                fm.addInput(Tr("rule.input.speed"), "Number");
                pl.sendForm(fm, (pl, data) => {
                    if (data == null) return Close_Tell(pl);
                    if (data[0] == '') {
                        pl.tell(Gm_Tell + Tr("input.null"));
                    } else {
                        if (Func_Module.num(data[0])) {
                            if (CmdEx(`gamerule ${gamerule[id].type} ${data[0]}`)) {
                                pl.tell(Gm_Tell + Tr("rule.speed.succes.ok", data[0]));
                            } else {
                                pl.tell(Gm_Tell + Tr("rule.speed.succes.err"));
                            }
                        } else {
                            pl.tell(Gm_Tell + Tr("input.num"));
                        }
                    }
                })
            }
            return;
        }
        pl.sendModalForm(`${PLUGINS_NAME}`, `${Tr("grule.ui.modalform.0")}:${gamerule[id].name}\n${gamerule[id].txt}`, Tr("grule.ui.modalform.1"), Tr("grule.ui.modalform.2"), (pl, id1) => {
            if (id1 == null) return Close_Tell(pl);
            if (CmdEx(`gamerule ${gamerule[id].type} ${id1}`)) {
                pl.tell(Gm_Tell + Tr("grule.ui.succes.ok", gamerule[id].name, id1));
            } else {
                pl.tell(Gm_Tell + Tr("grule.ui.succes.err", gamerule[id].name, id1));
            }
        })
    })
}

/* 获取隐藏方块 */
function getBlock_Ui(pl) {
    const block = Button_Data.get("Block");
    const fm = Func_Module.SimpleForm();
    fm.setContent(Tr("block.ui.txt"));
    block.forEach(i => {
        fm.addButton(i.name, i.image);
    })
    pl.sendForm(fm, (pl, id) => {
        if (id == null) return Close_Tell(pl);
        const fm1 = Func_Module.CustomForm();
        fm1.addInput(Tr("getblock.input"), 'number', '1');
        if (block[id].type == "light_block") {/* 光明方块 */
            fm1.addInput(Tr("block.ui.light"), "num 1~15", "1");
        }
        pl.sendForm(fm1, (pl, data) => {
            if (data == null) return Close_Tell(pl);
            let isCmd;/* 待执行的命令 */
            if (block[id].type == "light_block") {
                isCmd = `give ${pl.realName} ${block[id].type} ${data[0]} ${data[1]}`;
            } else {
                isCmd = `give ${pl.realName} ${block[id].type} ${data[0]}`;
            }
            if (CmdEx(isCmd)) {
                pl.tell(Gm_Tell + Tr("block.ui.succes.ok"));
            } else {
                pl.tell(Gm_Tell + Tr("block.ui.succes.err"));
            }
        })
    })
}

/* 崩溃玩家客户端 */
function Crash_Ui(pl) {
    const onlinePlayers = [...mc.getOnlinePlayers()];
    const fm = Func_Module.CustomForm();
    fm.addDropdown(Tr("crash.drop"), onlinePlayers.map(p => p.realName), 0);
    pl.sendForm(fm, (pl, data) => {
        if (data == null) return Close_Tell(pl);
        const res = onlinePlayers[data[0]].crash();
        if (res == 1) {
            pl.tell(Gm_Tell + Tr("crash.ui.succes.ok"));
        } else {
            pl.tell(Gm_Tell + Tr("crash.ui.succes.err"));
        }
    })
}

/* 以某个玩家身份说话 */
function Player_Talk_Ui(pl) {
    const onlinePlayers = [...mc.getOnlinePlayers()]
    const fm = Func_Module.CustomForm();
    fm.addInput(Tr("talk.ui.input"), 'String');
    fm.addDropdown(Tr("talk.ui.dropdown"), onlinePlayers.map(p => p.realName), 0);
    pl.sendForm(fm, (pl, data) => {
        if (data == null) return Close_Tell(pl);
        if (data[0] == '') {
            pl.tell(Gm_Tell + Tr("input.null"));
        } else {
            const res = onlinePlayers[data[1]].talkAs(data[0]);
            if (res == 1) {
                pl.tell(Gm_Tell + Tr("talk.ui.succes.ok"));
            } else {
                pl.tell(Gm_Tell + Tr("talk.ui.succes.err"));
            }
        }
    })
}

/* 发消息给玩家 */
function sendPlayer_Ui(pl) {
    const Online_Players = Func_Module.GET_ALL_ONLINE_PLAYERS();
    const fm = Func_Module.CustomForm();
    fm.addDropdown(Tr("s_pl.txt"), Online_Players, 0);/* 选择玩家 0 */
    fm.addInput(Tr("tell.input.msg"), "String");/* 1 */
    fm.addStepSlider(Tr("tell.send.mode"), [Tr("tell.mode.0"), Tr("tell.mode.1"), Tr("tell.mode.2"), Tr("tell.mode.3"), Tr("tell.mode.4")]);
    fm.addInput(Tr("tell.input.title"));/* 3 */
    pl.sendForm(fm, (pl, data) => {
        if (data == null) return Close_Tell(pl);
        /* 输入框是否为空 */
        if (data[1] !== '') {
            const modeMap = {
                0: 0,
                1: 1,
                2: 6,
                3: 4,
                4: 5
            };
            if (send(Online_Players[data[0]], data[1], modeMap[data[2]], data[3])) {
                pl.tell(Gm_Tell + Tr("send_pl.succes.ok", data[1], Online_Players[data[0]]));
            } else {
                pl.tell(Gm_Tell + Tr("send_pl.succes.err"));
            }
        } else {
            pl.tell(Gm_Tell + Tr("input.null"));
        }
        /**
         * 发送消息
         * @param {String} pl 目标玩家
         * @param {String} txt 消息内容
         * @param {Number} mode 消息模式 0 1 4 5 6(成就)
         * @param {String} title 标题
         */
        function send(pl, txt, mode, title) {
            if (mode !== 6) {
                /* 非成就消息 */
                if (mc.getPlayer(pl).tell(txt, mode)) {
                    return true;
                } else {
                    return false;
                }
            } else {
                /* 成就消息 */
                if (mc.getPlayer(pl).sendToast(title, txt)) {
                    return true;
                } else {
                    return false;
                }
            }
        }
    })
}

/* 玩家身份执行命令 */
function Player_Cmd_Ui(pl) {
    const Online_Players = Func_Module.GET_ALL_ONLINE_PLAYERS();
    const fm = Func_Module.CustomForm();
    fm.addDropdown(Tr("pl_cmd.drop"), Online_Players, 0);
    fm.addInput(Tr("pl_cmd.input"), "String");
    pl.sendForm(fm, (pl, data) => {
        if (data == null) return Close_Tell(pl);
        if (data[1] !== '') {
            if (mc.getPlayer(Online_Players[data[0]]).runcmd(data[1])) {
                pl.tell(Gm_Tell + Tr("player.cmd.succes.ok", Online_Players[data[0]], data[1]));
            } else {
                pl.tell(Gm_Tell + Tr("player.cmd.succes.err"));
            }
        } else {
            pl.tell(Gm_Tell + Tr("input.null"));
        }
    })
}

/* 执行后台命令 */
let _ConsoleCmd_cache = []/* 保存执行结果 */
function ConsoleCmd_Ui(pl) {
    const fm = Func_Module.CustomForm();
    fm.addLabel("• Comsole Cmd");
    fm.addLabel(`${_ConsoleCmd_cache.join('\n\n')}`);
    fm.addInput(Tr("consolecmd.input"), "String");
    pl.sendForm(fm, (pl, data) => {
        if (data == null) return Close_Tell(pl);
        const res = mc.runcmdEx(`${data[2]}`);
        if (data[2] == '') {
            return pl.tell(Gm_Tell + Tr("input.null"));
        }
        _ConsoleCmd_cache.push(`§r> ${data[2]}`);
        if (res.success) {
            _ConsoleCmd_cache.push(`§r${res.output}`);
        } else {
            _ConsoleCmd_cache.push(`§r§c${res.output}§r`);
        }
        ConsoleCmd_Ui(pl);
    })
}

/* GUI封禁功能 */
function Ban_Ui(pl) {
    const Online_Players = Func_Module.GET_ALL_ONLINE_PLAYERS();
    const fm = Func_Module.CustomForm();
    fm.addDropdown(Tr("ban.player"), Online_Players, 0);/* 0选择玩家 */
    fm.addInput(Tr("ban.input"), "String");/* 1输入玩家 */
    fm.addStepSlider(Tr("ban.step.txt"), [Tr("ban.step.0"), Tr("ban.step.1")]);
    fm.addInput(Tr("ban.time"), "Number");/* 3封禁时间 */
    fm.addInput(Tr("ban.reason"), "String");/* 4原因 */
    fm.addSwitch(Tr("ban.mode"));/* 5在线离线 */
    fm.addSwitch(Tr("ban.broad.switch"), true);/* Bord */
    pl.sendForm(fm, (pl, data) => {
        if (data == null) return Close_Tell(pl);
        let Player;/* 存储玩家 */
        let time;/* 存储时间 */
        let Reason;/* 存储原因 */
        if (data[5] == 1) {
            Player = data[1];/* 离线 */
        } else {
            Player = Online_Players[data[0]];/* 在线 */
        };
        if (data[3] !== "") {/* 判断时间输入框 */
            if (!Func_Module.num(data[3])) {
                return pl.tell(Gm_Tell + Tr("input.num"));
            } else {
                time = data[3];
            }
        } else {
            time = "";/* 输入框为空 */
        };
        if (data[4] == "") { Reason = "" } else { Reason = data[4] }
        let Cmds = Config.get('Ban_Cmd');/* 读取命令 */
        switch (data[2]) {
            case 0:
                /* ban */
                CmdEx(Cmds.Ban = _toSpace(Cmds.Ban.replace('${Player}', Player).replace('${time}', time).replace('${Reason}', Reason)));
                if (data[6] == 1) { mc.broadcast(Tr("ban.broad", { name: Player, reason: Reason, time: time })) };
                pl.tell(Gm_Tell + Tr("ban.succes", Player, time, Reason));
                break;
            case 1:
                /* unban */
                CmdEx(Cmds.UnBan = _toSpace(Cmds.UnBan.replace('${Player}', data[1])));
                pl.tell(Gm_Tell + Tr("unban.succes", data[1]));
                break;
        }
        /**
         *  将#转换为""
         * @param {String} txt 
         * @returns 
         */
        function _toSpace(txt) {
            return txt.replace(/#&#/g, '"');
        }
    })
}

/* 查看玩家信息 */
function PlayerInfo(pl) {
    const Online_Players = Func_Module.GET_ALL_ONLINE_PLAYERS();
    const fm = Func_Module.CustomForm();
    fm.addDropdown(Tr("playerinfo?"), Online_Players);
    pl.sendForm(fm, (pl, dt) => {
        if (dt == null) return Close_Tell(pl);
        Info(pl, mc.getPlayer(Online_Players[dt[0]]));
        function Info(pl, pl2) {
            const dv = pl2.getDevice();
            const fm = Func_Module.CustomForm();
            fm.addLabel(Tr("playerinfo", {
                name: pl2.name,
                realname: pl2.realName,
                xuid: pl2.xuid,
                uuid: pl2.uuid,
                pos: pl2.pos,
                deathpos: pl2.deathpos,
                ip: dv.ip,
                ping: dv.lastPing,
                loss: dv.lastPacketLoss,
                os: dv.os,
                avgping: dv.avgPing,
                avgloss: dv.avgPacketLoss,
                id: dv.clientId
            }));
            pl.sendForm(fm, (pl, dt) => {
                return Close_Tell(pl);
            })
        }
    })
}

/* 发送表单 */
function isForms(pl) {
    const fm = Func_Module.SimpleForm();
    fm.setContent(Tr("isForms?"));
    fm.addButton(Tr("isForms.0"));
    fm.addButton(Tr("isForms.1"));
    fm.addButton(Tr("isForms.2"));
    fm.addButton(Tr("isForms.3"));
    pl.sendForm(fm, (pl, id) => {
        if (id == null) return Close_Tell(pl);
        const Online_Players = Func_Module.GET_ALL_ONLINE_PLAYERS();
        switch (id) {
            case 0:
                Forms_0(pl);
                function Forms_0(pl) {
                    const fm = mc.newCustomForm();
                    fm.setTitle(Tr("isForms.title", PLUGINS_NAME));
                    fm.addDropdown(Tr("isForms.sendPlayer"), Online_Players);
                    fm.addInput(Tr("isForms.input.0"), "String");
                    fm.addInput(Tr("isForms.input.button.0"), "String");
                    fm.addInput(Tr("isForms.input.button.1"), "String");
                    pl.sendForm(fm, (pl, dt) => {
                        if (dt == null) return Close_Tell(pl); opl = pl.realName;
                        mc.getPlayer(Online_Players[dt[0]]).sendModalForm(Tr("isForms.title", PLUGINS_NAME), dt[1], dt[2], dt[3], (pl, res) => {
                            switch (res) {
                                case true:
                                    mc.getPlayer(opl).tell(Gm_Tell + Tr("isForms.0.ok", mc.getPlayer(Online_Players[dt[0]]), dt[2]));
                                    break;
                                case false:
                                    mc.getPlayer(opl).tell(Gm_Tell + Tr("isForms.0.ok", mc.getPlayer(Online_Players[dt[0]]), dt[3]));
                                    break;
                            }
                        })
                    })
                }
                break;
            case 1:
                Forms_1(pl);
                function Forms_1(pl) {
                    const fm = mc.newCustomForm();
                    fm.setTitle(Tr("isForms.title", PLUGINS_NAME));
                    fm.addDropdown(Tr("isForms.sendPlayer"), Online_Players);
                    fm.addInput(Tr("isForms.input.0"), "String");
                    fm.addInput(Tr("isForms.input.tip"), "String");
                    pl.sendForm(fm, (pl, dt) => {
                        if (dt == null) return Close_Tell(pl); opl = pl.realName;
                        Mode0(mc.getPlayer(Online_Players[dt[0]]));
                        function Mode0(pl) {
                            let fm = mc.newCustomForm();
                            fm.setTitle(Tr("isForms.title", PLUGINS_NAME));
                            fm.addLabel(dt[1]);
                            fm.addInput(dt[2]);
                            pl.sendForm(fm, (pl, dt) => {
                                if (dt == null) { return mc.getPlayer(opl).tell(Gm_Tell + Tr("isForms.close", pl.realName)) }
                                if (dt[1] !== "") { return mc.getPlayer(opl).tell(Gm_Tell + Tr("isForms.Playerinput", pl.realName, dt[1])) }
                            })
                        }
                    })
                }
                break;
            case 2:
                Forms_2(pl);
                function Forms_2(pl) {
                    const fm = mc.newCustomForm();
                    fm.setTitle(Tr("isForms.title", PLUGINS_NAME));
                    fm.addDropdown(Tr("isForms.sendPlayer"), Online_Players);
                    fm.addInput(Tr("isForms.input.0"), "String");
                    fm.addInput(Tr("isForms.switch.tip"), "String");
                    pl.sendForm(fm, (pl, dt) => {
                        if (dt == null) return Close_Tell(pl); opl = pl.realName;
                        Mode1(mc.getPlayer(Online_Players[dt[0]]));
                        function Mode1(pl) {
                            let fm = mc.newCustomForm();
                            fm.setTitle(Tr("isForms.title", PLUGINS_NAME));
                            fm.addLabel(dt[1]);
                            fm.addSwitch(dt[2]);
                            pl.sendForm(fm, (pl, dt) => {
                                if (dt == null) { return mc.getPlayer(opl).tell(Gm_Tell + Tr("isForms.close", pl.realName)) }
                                return mc.getPlayer(opl).tell(Gm_Tell + Tr("isForms.Playerswitch", pl.realName, dt[1]));
                            })
                        }
                    })
                }
                break;
            case 3:
                Forms_3(pl)
                function Forms_3(pl) {
                    const fm = mc.newCustomForm();
                    fm.setTitle(Tr("isForms.title", PLUGINS_NAME));
                    fm.addDropdown(Tr("isForms.sendPlayer"), Online_Players);
                    fm.addInput(Tr("isForms.input.0"), "String");
                    pl.sendForm(fm, (pl, dt) => {
                        if (dt == null) return Close_Tell(pl); opl = pl.realName;
                        Mode2(mc.getPlayer(Online_Players[dt[0]]));
                        function Mode2(pl) {
                            const fm = mc.newCustomForm();
                            fm.setTitle(Tr("isForms.title", PLUGINS_NAME));
                            fm.addLabel(dt[1]);
                            pl.sendForm(fm, (pl, dt) => {
                                if (dt == null) { return };
                            })
                        }
                    })
                }
                break;
        }
    })
}

/* 命令黑名单 */
let BlackCmd;/* 存储黑名单命令 */
function load_BlackCmd() {/* 读取黑名单命令库 */
    if (!File.exists(Path + `Data\\BlackCmd.json`)) {
        File.writeTo(Path + `Data\\BlackCmd.json`, '[]');/* 文件不存在 */
        logger.warn(`File <BlackCmd.json> does not exist, creating file...`);
    };
    try {/* json语法检查 */
        BlackCmd = JSON.parse(File.readFrom(Path + `Data\\BlackCmd.json`));
    } catch (e) {
        if (e instanceof SyntaxError) {
            return logger.error(`File <${sw.open}.json> syntax error!`, 5);
        };
    };
};/* 进行监听拦截 */
mc.listen("onPlayerCmd", function (pl, cmd) {
    for (let i = 0; i < BlackCmd.length; i++) {
        if (cmd.includes(BlackCmd[i])) {
            Func_Module.Write_Logs('BlackCmd', `${pl.realName}`, `执行黑名单命令: /${cmd}`);
            return false;
        };
    }
});/* 添加/删除黑名单命令 */
function BlackCmd_Ui(pl) {
    const fm = Func_Module.CustomForm();
    fm.addInput(Tr('BlackCmd.input'), 'String');      /* data 0 */
    fm.addDropdown(Tr('BlackCmd.drop'), BlackCmd);     /* data 1 */
    fm.addStepSlider(Tr("BlackCmd.Step"), [Tr("BlackCmd.Step.1"), Tr("BlackCmd.Step.2")]);    /* data 2 */
    pl.sendForm(fm, (pl, data) => {
        if (data == null) return Close_Tell(pl);
        if (data[2] == 0) {
            if (data[0] == '') {/* 判断输入框 */
                pl.tell(Gm_Tell + Tr("input.null"));
            } else {
                if (!/^[^/].*/.test(data[0])) {/* 判断命令 */
                    pl.tell(Gm_Tell + Tr("BlackCmd.err.0"));
                } else {
                    if (BlackCmd.indexOf(data[0]) !== -1) {/* 判断重复 */
                        pl.tell(Gm_Tell + Tr("BlackCmd.err.1"));
                    } else {/* 添加 */
                        BlackCmd.push(data[0]);
                        File.writeTo(Path + `Data\\BlackCmd.json`, JSON.stringify(BlackCmd));
                        load_BlackCmd();
                        pl.tell(Gm_Tell + Tr("BlackCmd.ok.0"));
                    }
                }
            }
        } else {/* 删除 */
            BlackCmd.splice(data[1], 1);
            File.writeTo(Path + `Data\\BlackCmd.json`, JSON.stringify(BlackCmd));
            load_BlackCmd();
            pl.tell(Gm_Tell + Tr("BlackCmd.ok.1"));
        }
    })
}

/* 药水GUI */
function Potion_Ui(pl) {
    let PotionData;
    if (!File.exists(Path + `Data\\PotionData.json`)) {
        File.writeTo(Path + `Data\\PotionData.json`, JSON.stringify(Config_init.PotionData, null, '\t'))
    };
    try {
        PotionData = JSON.parse(File.readFrom(Path + `Data\\PotionData.json`));
    } catch (e) { return logger.error(`Reasons <PotionData.json> file cannot be loaded: ${e}`); };
    pl.sendModalForm(Tr("cmd", PLUGINS_NAME), Tr("main.ishere"), Tr("potionAdd"), Tr("potionDel"), (pl, res) => {
        if (res == null) return Close_Tell(pl);
        /* 获取在线玩家 */
        const Online_Players = Func_Module.GET_ALL_ONLINE_PLAYERS();
        /* 构建表单 */
        const fm = Func_Module.CustomForm();
        fm.addDropdown(Tr("potion.player"), Online_Players);/* 0 */
        switch (res) {
            case true:
                let _Arry = [];
                PotionData.forEach(i => {
                    _Arry.push(i.name);
                });
                fm.addDropdown(Tr("Potion.drop"), _Arry);/* 1 */
                fm.addInput(Tr("Potion.time"), "Number", '30');/* 2 */
                fm.addSlider(Tr("Potion.level"), 0, 255, 1);/* 3 */
                fm.addSwitch(Tr("Potion.lz"));/* 4 */
                pl.sendForm(fm, (pl, dt) => {
                    if (dt == null) return Close_Tell(pl); let PARTICLE = `false`;
                    if (dt[4]) PARTICLE = 'true';
                    let ID = PotionData.findIndex(y => y.name === _Arry[dt[1]]);
                    logger.debug(`effect "${Online_Players[dt[0]]}" ${PotionData[ID].type} ${dt[2]} ${dt[3]} ${PARTICLE}`);
                    CmdEx(`effect "${Online_Players[dt[0]]}" ${PotionData[ID].type} ${dt[2]} ${dt[3]} ${PARTICLE}`);
                });
                break;
            case false:
                pl.sendForm(fm, (pl, dt) => {
                    CmdEx(`effect "${Online_Players[dt[0]]}" clear`);
                    return Close_Tell(pl);
                })
                break;
        }
    }
    )
}

/* 命令绑定 */
function BindCmd() {
    if (!File.exists(Path + 'data\\BindCmd.json')) File.writeTo(Path + 'data\\BindCmd.json', '[]');
    const BindCmd_Array = JSON.parse(File.readFrom(Path + 'data\\BindCmd.json'));
    const CmdJurisdiction = (Type) => {
        switch (Type) {
            case "Any": return 'PermType.Any';
            case "Admin": return 'PermType.Admin';
            default: return 'PermType.Admin';
        }
    };
    if (BindCmd_Array.length == 0) return false;
    BindCmd_Array.forEach(i => {
        const ID = Func_Module.RandomID();
        let CALLBACK_PROCESSING_CODE = ``;
        if (i.PluginVerification) CALLBACK_PROCESSING_CODE = String(`if (!Func_Module.qx(ori.player)) {if (!Permission_Group.USERS_GROUP(ori.player.xuid) == 1 || Permission_Group.USERS_GROUP(ori.player.xuid) == null) {return out.error(Gm_Tell + Tr("cmd.error"))};};`);
        const StringCmd = String(`
        const %Cmd% = mc.newCommand("${i.Cmd}", "${i.Describe}", %PermType%);
        %Cmd%.overload([]);
        %Cmd%.setCallback((_, ori, out, res) => {
            if (ori.type == 7) { return out.error('This command can only be executed by players! Do not use this command on the console.') };
            if (ori.type !== 0) { return out.error('This command can only be executed by players!') };
            %CALLBACK_PROCESSING%
            ${i.Type}(ori.player);
        })
        %Cmd%.setup();
        `.replace(/%Cmd%/g, ID).replace(/%PermType%/g, CmdJurisdiction(i.PermType)).replace(/%CALLBACK_PROCESSING%/g, CALLBACK_PROCESSING_CODE)); logger.debug(StringCmd);
        try {
            eval(StringCmd);
        } catch (e) {
            return logger.error(`[BindCmd] Bind command <${i.Cmd} - ${i.Describe}> Error \n${e}`);
        }
        logger.info(`[BindCmd] Bind command <${i.Cmd} - ${i.Describe}> to function <${i.Type}> successful!`);
    })
}

// todo 模拟玩家管理
function SIMULATE_PLAYER_MANAGEMENT_Ui(pl) {
    const fm = Func_Module.SimpleForm();
    fm.setContent("选择一个操作");

    /**
     * 选择模拟玩家
     * @param {*} pl 传入玩家对象
     * @param {*} callback 回调玩家名
     */
    function isSimulatedPlayer(pl, callback) {
        const SimulatedPlayer = Func_Module.GET_ALL_SimulatedPlayer();
        const fm = Func_Module.SimpleForm();
        fm.setContent("选择一个模拟玩家");
        SimulatedPlayer.forEach(i => {
            const pos = mc.getPlayer(i).pos;
            fm.addButton(`${i}\nX:${pos.x} | Y:${pos.y} | Z:${pos.z} | Dimid:${pos.dimid}`);
        });
        pl.sendForm(fm, (pl, id) => {
            if (id == null) return Close_Tell(pl);
            callback(SimulatedPlayer[id]);
        })
    }
}

/**==============================================================
 *  !                          功能模块
    ==============================================================*/
const Func_Module = {
    /**
     * 10位随机ID
     * @returns ID
     */
    RandomID() {
        let str = '';
        const char = 'abcdefghijklmnopqrstuvwxyzQWERTYUIOPASDFGHJKLZXCVBNM';
        for (let i = 0; i < 10; i++) {
            let index = Math.floor(Math.random() * char.length);
            str += char[index];
        }
        return str;
    },
    /**
     * 按钮表单头
     */
    SimpleForm() {
        const fm = mc.newSimpleForm();
        fm.setTitle(Tr("cmd", PLUGINS_NAME));
        return fm;
    },
    /**
     * 自定义表单头
     */
    CustomForm() {
        const fm = mc.newCustomForm();
        fm.setTitle(Tr("cmd", PLUGINS_NAME));
        return fm;
    },
    /**
     * 0/1转true/false
     * @param {Boolean} sw 0/1
     * @returns 
     */
    isTrue_false(sw) {
        return sw === 1 ? true : false;
    },
    /**
     * 管理权限判断
     * @param {String} pl 玩家对象
     * @returns true有、false无
     */
    qx(pl) {
        let tmp = User_Data.get('op')
        if (tmp.indexOf(pl.xuid) !== -1) {
            return true
        } else {
            /* pl.tell(Gm_Tell + Tr("cmd.error")) */
            return false
        }
    },
    /**
     * 获取所有在线玩家名
     * @returns Arry 玩家名
     */
    GET_ALL_ONLINE_PLAYERS() {
        let Arry = [];
        mc.getOnlinePlayers().forEach(pl => {
            if (Config.get('FilterSimulatedPlayers') && !pl.isSimulatedPlayer()) {
                Arry.push(pl.realName);
            } else {
                Arry.push(pl.realName);
            }
        });
        return Arry;
    },
    /**
     * 获取所有模拟玩家
     * @returns Arry
     */
    GET_ALL_SimulatedPlayer() {
        let Arry = [];
        mc.getOnlinePlayers().forEach(pl => {
            if (pl.isSimulatedPlayer()) {
                Arry.push(pl.name);
            }
        })
        return Arry
    },
    /**
     *  写入日志
     *  @param {*} title 模块
     *  @param {*} zt 触发主体
     *  @param {*} txt 日志内容
     */
    Write_Logs(title, zt, txt) {
        let time_data = system.getTimeObj();/* 获取时间对象 */
        let time = `-${time_data.Y}-${time_data.M}-${time_data.D}`;
        let Log_File;/*日志文件路径*/let write;/* 预写入内容 */
        if (Config.get('Log').Output_csv == true) {
            if (Config.get('Log').Date_Differentiation == true) {
                Log_File = `.\\logs\\OPTools\\OPTools${time}.csv`
                write = '时间,模块,触发主体,内容\n'
            } else {
                Log_File = `.\\logs\\OPTools\\OPTools.csv`
                write = '时间,模块,触发主体,内容\n'
            }
        } else {
            if (Config.get('Log').Date_Differentiation == true) {
                Log_File = `.\\logs\\OPTools\\OPTools${time}.log`
            } else {
                Log_File = `.\\logs\\OPTools\\OPTools.log`
            }
        }
        if (!File.exists(Log_File)) {
            File.writeTo(Log_File, write);
            logger.warn(`File <OPTools log> does not exist, creating file...`);
        };
        if (Config.get('Log').Output_Colsole == true) { logger.info(`${title} ${zt} ${txt}`) }
        if (title == '' || title == null) { title = '' }
        File.writeLine(Log_File, `${system.getTimeStr()},${title},${zt},${txt}`);
    },
    /**
     *  传送功能
     *  @param {String} pl1 调用接口的玩家
     *  @param {Integer} pl2 目标玩家/坐标
     *  @returns 
     */
    Tep(pl1, pl2) {
        if (pl1.teleport(pl2)) {
            return true;
        } else {
            return false;
        }
    },
    /**
     *  输入内容是否为数字
     *  @param {String} nums 待检查的字符串
     *  @returns 
     */
    num(nums) {
        const reg = /^[0-9]+.?[0-9]*$/;
        if (reg.test(nums)) {
            return true;
        }
        return false;
    },
    /**
     *  广播消息
     *  @param {String} txt 待广播的内容
     *  @param {Number} num 广播模式
     *  @returns 
     */
    Broad(txt, num) {
        if (mc.broadcast(txt, num)) {
            return true;
        } else {
            return false;
        }
    }
}
/**
 *  执行命令
 * @param {String} cmd 待执行的命令
 * @returns 
 */
function CmdEx(cmd) {
    logger.debug(cmd);
    const res = mc.runcmdEx(cmd);
    if (res.success) {
        logger.debug(res.output);
        return true;
    } else {
        return false;
    }
}
/* 关闭提示 */
function Close_Tell(pl) {
    pl.tell(Gm_Tell + Tr("close"));
}

/**==============================================================
 *  !                        权限组模块
    ==============================================================*/
const Permission_Group = {
    /**
     * 创建组
     * @param {String} name 名称
     */
    CREATE_GROUP(name) {
        let arr = User_Data.get('user');
        const GUID = system.randomGuid();
        const tmp = {
            "name": name,
            "guid": GUID,
            "Permission": [],
            "data": []
        };
        arr.push(tmp);
        User_Data.set('user', arr);
        return GUID;
    },
    /**
     * 删除组
     * @param {String} guid 权限组ID
     */
    DELETE_GROUP(guid) {
        let arr = User_Data.get('user');
        const index = arr.findIndex(item => item.guid === guid);
        if (index >= 0) {
            arr.splice(index, 1);
            User_Data.set('user', arr);
        }
    },
    /**
     * 重复权限判断
     * @param {Number} mode 模式 0权限 1用户
     * @param {*} guid 权限组ID
     * @param {*} value 权限/用户 ID
     */
    REPEAT_CHECK(mode, guid, value) {
        let arr = User_Data.get('user');
        const index = arr.findIndex(item => item.guid === guid);
        if (index < 0) return null;
        const checkArray = mode === 0 ? arr[index].Permission : arr[index].data;
        return !checkArray.includes(value);
    },
    /**
     * 添加权限
     * @param {String} guid 权限组ID
     * @param {String} key 权限值
     */
    ADD_PERMISSION(guid, key) {
        if (!Permission_Group.REPEAT_CHECK(0, guid, key)) return false;
        let arr = User_Data.get('user');
        const index = arr.findIndex(item => item.guid === guid);
        if (index < 0) return false;
        arr[index].Permission.push(key);
        User_Data.set('user', arr);
        return true;
    },
    /**
     * 删除权限
     * @param {String} guid 权限组ID
     * @param {String} key 权限值
     */
    DELETE_PERMISSIONS(guid, key) {
        let arr = User_Data.get('user');
        const res = arr.findIndex(i => i.guid === guid); /* 获取权限组索引 */
        if (res === -1) return false;
        const qx = arr[res].Permission.findIndex(q => q === key); /* 获取权限值索引 */
        arr[res].Permission.splice(qx, 1); /* 删除权限 */
        User_Data.set('user', arr);
        return true;
    },
    /**
     * 添加用户
     * @param {String} guid 权限组ID
     * @param {String} xuid 玩家XUID
     */
    ADD_USER(guid, xuid) {
        if (!Permission_Group.REPEAT_CHECK(1, guid, xuid)) return false;
        let arr = User_Data.get('user');
        const index = arr.findIndex(item => item.guid === guid);
        if (index < 0) return false;
        arr[index].data.push(xuid);
        User_Data.set('user', arr);
        return true;
    },
    /**
     * 删除用户
     * @param {String} guid 权限组ID
     * @param {String} xuid 玩家XUID
     */
    DELETE_USER(guid, xuid) {
        let arr = User_Data.get('user');
        const index = arr.findIndex(item => item.guid === guid);
        if (index < 0) return;
        const sy = arr[index].data.indexOf(xuid);
        if (sy >= 0) {
            arr[index].data.splice(sy, 1);
            User_Data.set('user', arr);
        }
    },
    /**
     * 权限组是否存在
     * @param {String} guid 权限组ID
     * @returns 
     */
    INSPECTION_TEAM(guid) {
        return User_Data.get('user').some(item => item.guid === guid);
    },
    /**
     * 用户是否存在权限组内
     * @param {String} guid 权限组ID
     * @param {String} xuid 玩家XUID
     * @returns 
     */
    AFTER_INSPECTION(guid, xuid) {
        let arr = User_Data.get('user');
        const index = arr.findIndex(item => item.guid === guid);
        if (index < 0) return false;
        return arr[index].data.includes(xuid);
    },
    /**
     * 获取用户所在权限组
     * @param {String} xuid 用户ID
     * @returns 权限组
     */
    USERS_GROUP(xuid) {
        return User_Data.get('user').find(item => item.data.includes(xuid));
    },
    /**
     * 检查用户是否拥有权限
     * @param {String} xuid 用户ID
     * @param {String} key 权限值
     * @returns null用户不存在任何权限组
     */
    CHECK_PERMISSIONS(xuid, key) {
        const group = Permission_Group.USERS_GROUP(xuid);
        return group?.Permission.includes(key) ?? null;
    },
    /**
     * 获取所有权限组
     * @returns 名称和ID
     */
    ALL_GROUPS() {
        const arr = User_Data.get('user');
        return arr.map(({ name, guid }) => ({ name, guid }));
    },
    /**
     * 获取指定权限组数据
     * @param {*} guid 权限组
     * @returns 权限组数据
     */
    GET_GROUP(guid) {
        let arr = User_Data.get('user');
        const index = arr.findIndex(item => item.guid === guid);
        return index >= 0 ? arr[index] : null;
    },
    /**
     * 修改权限组名称
     * @param {*} guid 要修改的权限组
     * @param {*} name 要更改的名称
     */
    RENAME_GROUP(guid, name) {
        let arr = User_Data.get('user');
        const index = arr.findIndex(item => item.guid === guid);
        if (index < 0) return false;
        arr[index].name = name;
        User_Data.set('user', arr);
        return true;
    },
};

/**==========================================================
 *  !                       导出接口
 * ==========================================================
 */
const PERMISSION_GROUP_INTERFACE_Map = {
    CREATE_GROUP: Permission_Group.CREATE_GROUP,
    DELETE_GROUP: Permission_Group.DELETE_GROUP,
    ADD_PERMISSION: Permission_Group.ADD_PERMISSION,
    DELETE_PERMISSIONS: Permission_Group.DELETE_PERMISSIONS,
    ADD_USER: Permission_Group.ADD_USER,
    DELETE_USER: Permission_Group.DELETE_USER,
    INSPECTION_TEAM: Permission_Group.INSPECTION_TEAM,
    AFTER_INSPECTION: Permission_Group.AFTER_INSPECTION,
    USERS_GROUP: Permission_Group.USERS_GROUP,
    CHECK_PERMISSIONS: Permission_Group.CHECK_PERMISSIONS,
    ALL_GROUPS: Permission_Group.ALL_GROUPS,
    GET_GROUP: Permission_Group.GET_GROUP,
    RENAME_GROUP: Permission_Group.RENAME_GROUP
};
function PERMISSION_GROUP_INTERFACE(type, ...args) {
    return PERMISSION_GROUP_INTERFACE_Map[type](...args);
}
ll.export(PERMISSION_GROUP_INTERFACE, 'PERMISSION_GROUP');

/* 内部表单GUI导出 */
function Form_inside_API(xuid, type) {
    if (!xuid && type == null) return MAPPING_TABLE[type](mc.getPlayer(xuid));
}
ll.export(Form_inside_API, 'Form_inside_API');