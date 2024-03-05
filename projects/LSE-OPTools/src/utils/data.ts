import { pluginFile } from "./GlobalEnums.js";
import { formatPrintError } from "./util.js";
import { fileOperation } from "./file.js";

const __inits = {
    config: {
        version: "3.0.0",
        language: "zh_CN",
    },
    block: {
        version: "3.0.0",
        data: [
            {
                name: "§l命令方块",
                image: "textures/ui/creator_glyph_color",
                type: "command_block",
            },
            {
                name: "§l屏障方块",
                image: "textures/blocks/barrier",
                type: "barrier",
            },
            {
                name: "§l边界方块",
                image: "textures/blocks/border",
                type: "border_block",
            },
            {
                name: "§l结构方块",
                image: "textures/blocks/structure_block",
                type: "structure_block",
            },
            {
                name: "§l结构空位",
                image: "textures/blocks/structure_void",
                type: "structure_void",
            },
            {
                name: "§l光源方块",
                image: "textures/items/light_block_15.png",
                type: "light_block",
            },
        ],
    },
    potion: [
        {
            name: "伤害吸收",
            image: "",
            id: 22,
        },
        {
            name: "不祥之兆",
            image: "",
            id: 28,
        },
        {
            name: "失明",
            image: "",
            id: 15,
        },
        {
            name: "潮涌能量",
            image: "",
            id: 26,
        },
        {
            name: "黑暗",
            image: "",
            id: 30,
        },
        {
            name: "中毒（致命）",
            image: "",
            id: 25,
        },
        {
            name: "防火",
            image: "",
            id: 12,
        },
        {
            name: "急迫",
            image: "",
            id: 3,
        },
        {
            name: "生命提升",
            image: "",
            id: 21,
        },
        {
            name: "饱和",
            image: "",
            id: 23,
        },
        {
            name: "饥饿",
            image: "",
            id: 17,
        },
        {
            name: "瞬间伤害",
            image: "",
            id: 7,
        },
        {
            name: "瞬间治疗",
            image: "",
            id: 6,
        },
        {
            name: "隐身",
            image: "",
            id: 14,
        },
        {
            name: "跳跃提升",
            image: "",
            id: 8,
        },
        {
            name: "飘浮",
            image: "",
            id: 24,
        },
        {
            name: "挖掘疲劳",
            image: "",
            id: 4,
        },
        {
            name: "反胃",
            image: "",
            id: 9,
        },
        {
            name: "夜视",
            image: "",
            id: 16,
        },
        {
            name: "中毒",
            image: "",
            id: 19,
        },
        {
            name: "生命恢复",
            image: "",
            id: 10,
        },
        {
            name: "抗性提升",
            image: "",
            id: 11,
        },
        {
            name: "缓降",
            image: "",
            id: 27,
        },
        {
            name: "缓慢",
            image: "",
            id: 2,
        },
        {
            name: "速度",
            image: "",
            id: 1,
        },
        {
            name: "力量",
            image: "",
            id: 5,
        },
        {
            name: "村庄英雄",
            image: "",
            id: 29,
        },
        {
            name: "水下呼吸",
            image: "",
            id: 13,
        },
        {
            name: "虚弱",
            image: "",
            id: 18,
        },
        {
            name: "凋零",
            image: "",
            id: 20,
        },
    ],
    rule: {
        version: "3.0.0",
        data: [
            {
                rule: "commandBlockOutput",
                name: "广播命令方块输出",
                describe: "",
                effect: "命令方块执行命令时是否在聊天框中向管理员显示。",
            },
            {
                rule: "commandBlocksEnabled",
                name: "",
                describe: "",
                effect: "命令方块在游戏中是否被启用。",
            },
            {
                rule: "doDaylightCycle",
                name: "游戏内时间流逝",
                describe: "",
                effect: "是否进行昼夜更替和月相变化。",
            },
            {
                rule: "doEntityDrops",
                name: "非生物实体掉落",
                describe: "控制矿车（包括内容物）、物品展示框、船等的物品掉落",
                effect: "非生物实体是否掉落物品。",
            },
            {
                rule: "doFireTick",
                name: "火焰蔓延",
                describe: "",
                effect: "火是否蔓延及自然熄灭。",
            },
            {
                rule: "doImmediateRespawn",
                name: "立即重生",
                describe: "",
                effect: "玩家死亡时是否不显示死亡界面直接重生。",
            },
            {
                rule: "doInsomnia",
                name: "生成幻翼",
                describe: "",
                effect: "幻翼是否在夜晚生成。",
            },
            {
                rule: "doLimitedCrafting",
                name: "合成需要配方",
                describe: "若启用，玩家只能使用已解锁的配方合成。",
                effect: "玩家的合成配方是否需要解锁才能使用。",
            },
            {
                rule: "doMobLoot",
                name: "生物战利品掉落",
                describe: "控制生物死亡后是否掉落资源，包括经验球。",
                effect: "生物在死亡时是否掉落物品。",
            },
            {
                rule: "doMobSpawning",
                name: "生成生物",
                describe: "一些实体可能有其特定的规则。",
                effect: "生物是否自然生成。不影响刷怪笼。",
            },
            {
                rule: "doTileDrops",
                name: "方块掉落",
                describe: "控制破坏方块后是否掉落资源，包括经验球。",
                effect: "方块被破坏时是否掉落物品。",
            },
            {
                rule: "doWeatherCycle",
                name: "天气更替",
                describe: "",
                effect: "天气是否变化。",
            },
            {
                rule: "drowningDamage",
                name: "溺水伤害",
                describe: "",
                effect: "玩家是否承受窒息伤害。",
            },
            {
                rule: "fallDamage",
                name: "摔落伤害",
                describe: "",
                effect: "玩家是否承受跌落伤害。",
            },
            {
                rule: "fireDamage",
                name: "火焰伤害",
                describe: "",
                effect: "玩家是否承受火焰伤害。",
            },
            {
                rule: "freezeDamage",
                name: "冰冻伤害",
                describe: "",
                effect: "玩家是否承受冰冻伤害。",
            },
            {
                rule: "functionCommandLimit",
                name: "",
                describe: "",
                effect: "通过/function命令执行命令的最大数量。",
            },
            {
                rule: "keepInventory",
                name: "死亡后保留物品栏",
                describe: "",
                effect: "玩家死亡后是否保留物品栏物品、经验（死亡时物品不掉落、经验不清空）。",
            },
            {
                rule: "maxCommandChainLength",
                name: "命令连锁执行数量限制",
                describe: "应用于命令方块链和函数。",
                effect: "决定了连锁型命令方块能连锁执行的总数量。",
            },
            {
                rule: "mobGriefing",
                name: "允许破坏性生物行为",
                describe: "",
                effect: "生物是否能够进行破坏性行为，包括苦力怕、僵尸、末影人、恶魂、凋灵、末影龙、兔子、绵羊、村民和雪傀儡是否能放置、修改或破坏方块，生物是否能捡拾物品，以及唤魔者是否能将蓝色的绵羊变为红色[仅Java版]。这个规则也会影响生物（如僵尸猪灵和溺尸）寻找海龟蛋的能力。这还将会阻止村民的繁殖。这一游戏规则不会影响非生物实体，包括TNT和末地水晶。",
            },
            {
                rule: "naturalRegeneration",
                name: "生命值自然恢复",
                describe: "",
                effect: "玩家是否能在饥饿值足够时自然恢复生命值（不影响外部治疗效果，如金苹果、生命恢复状态效果等）。",
            },
            {
                rule: "playersSleepingPercentage",
                name: "入睡占比",
                describe: "跳过夜晚所需的入睡玩家占比。",
                effect: "设置跳过夜晚所需的入睡玩家所占百分比。设置为0时，1个玩家入睡即可跳过夜晚。设置为大于100的值会使玩家无法通过入睡跳过夜晚。",
            },
            {
                rule: "pvp",
                name: "",
                describe: "",
                effect: "玩家之间能否造成伤害。",
            },
            {
                rule: "randomTickSpeed",
                name: "随机刻速率",
                describe: "",
                effect: "每游戏刻每区段中随机的方块刻发生的频率（例如植物生长，树叶腐烂等）。为0时禁用随机刻，较高的数字将增大随机刻频率。",
            },
            {
                rule: "recipesunlock",
                name: "",
                describe: "",
                effect: "配方是否需要解锁。",
            },
            {
                rule: "respawnblocksexplode",
                name: "",
                describe: "",
                effect: "玩家在非主世界维度使用床或在非下界维度使用重生锚时是否会爆炸。",
            },
            {
                rule: "sendCommandFeedback",
                name: "发送命令反馈",
                describe: "",
                effect: "玩家执行命令的返回信息是否在聊天框中显示。同时影响命令方块是否保存命令输出文本。",
            },
            {
                rule: "showBorderEffect",
                name: "",
                describe: "",
                effect: "边界是否发出红色粒子。",
            },
            {
                rule: "showCoordinates",
                name: "",
                describe: "",
                effect: "是否在聊天框区域持续实时显示玩家坐标。",
            },
            {
                rule: "showDeathMessages",
                name: "显示死亡消息",
                describe: "",
                effect: "是否在聊天框中显示玩家的死亡信息。同样影响是否在宠物（狼、猫和鹦鹉）死亡时通知它的主人。",
            },
            {
                rule: "showTags",
                name: "",
                describe: "",
                effect: "是否展示物品的物品组件。",
            },
            {
                rule: "spawnRadius",
                name: "重生点半径",
                describe: "",
                effect: "首次进入服务器的玩家和没有重生点的死亡玩家在重生时与世界重生点坐标的距离。",
            },
            {
                rule: "tntExplodes",
                name: "",
                describe: "",
                effect: "TNT是否会爆炸。",
            },
        ],
    },
    ui: {
        version: "3.0.0",
        data: [
            {
                name: "玩家类",
                image: "",
                type: "subform",
                open: [
                    {
                        name: "踢出玩家",
                        image: "textures/ui/permissions_visitor_hand",
                        type: "inside",
                        open: "0x0",
                    },
                    {
                        name: "杀死玩家",
                        image: "textures/ui/icon_recipe_equipment",
                        type: "inside",
                        open: "0x1",
                    },
                    {
                        name: "以玩家身份说话",
                        image: "textures/ui/sound_glyph_color_2x",
                        type: "inside",
                        open: "0x2",
                    },
                    {
                        name: "玩家身份执行命令",
                        image: "textures/ui/creator_glyph_color",
                        type: "inside",
                        open: "0x3",
                    },
                    {
                        name: "崩溃玩家客户端",
                        image: "textures/ui/cancel",
                        type: "inside",
                        open: "0x4",
                    },
                    {
                        name: "玩家详细信息",
                        image: "",
                        type: "inside",
                        open: "0x5",
                    },
                ],
            },
            {
                name: "世界管理",
                image: "",
                type: "subform",
                open: [
                    {
                        name: "更改世界天气",
                        image: "textures/ui/icon_fall",
                        type: "inside",
                        open: "0x6",
                    },
                    {
                        name: "更改世界时间",
                        image: "textures/items/clock_item",
                        type: "inside",
                        open: "0x7",
                    },
                    {
                        name: "清理世界掉落物",
                        image: "textures/ui/icon_trash",
                        type: "inside",
                        open: "0x8",
                    },
                    {
                        name: "更改世界规则",
                        image: "textures/ui/icon_bookshelf",
                        type: "inside",
                        open: "0x9",
                    },
                ],
            },
            {
                name: "服务端类",
                image: "",
                type: "subform",
                open: [
                    {
                        name: "设置MOTD",
                        image: "textures/ui/settings_glyph_color_2x",
                        type: "inside",
                        open: "0x10",
                    },
                    {
                        name: "设置人数",
                        image: "textures/ui/settings_glyph_color_2x",
                        type: "inside",
                        open: "0x11",
                    },
                    {
                        name: "模拟控制台",
                        image: "textures/ui/creator_glyph_color",
                        type: "inside",
                        open: "0x12",
                    },
                ],
            },
            {
                name: "管理类",
                image: "",
                type: "subform",
                open: [
                    {
                        name: "玩家传送",
                        image: "textures/ui/dressing_room_skins.png",
                        type: "inside",
                        open: "0x13",
                    },
                    {
                        name: "更改游戏模式",
                        image: "textures/ui/icon_setting",
                        type: "inside",
                        open: "0x14",
                    },
                    {
                        name: "获取隐藏方块",
                        image: "textures/ui/icon_blackfriday",
                        type: "inside",
                        open: "0x15",
                    },
                    {
                        name: "药水GUI",
                        image: "",
                        type: "inside",
                        open: "0x16",
                    },
                    {
                        name: "Ban GUI",
                        image: "textures/ui/ErrorGlyph",
                        type: "inside",
                        open: "0x17",
                    },
                    {
                        name: "命令黑名单",
                        image: "",
                        type: "inside",
                        open: "0x18",
                    },
                ],
            },
            {
                name: "其他功能",
                image: "",
                type: "subform",
                open: [
                    {
                        name: "广播消息",
                        image: "textures/ui/sound_glyph_color_2x",
                        type: "inside",
                        open: "0x19",
                    },
                    {
                        name: "发消息给玩家",
                        image: "textures/ui/message",
                        type: "inside",
                        open: "0x20",
                    },
                    {
                        name: "发送表单",
                        image: "",
                        type: "inside",
                        open: "0x21",
                    },
                ],
            },
        ],
    },
};

export let config = __inits.config;
export let bindcmd: BindCmdData;
export let blackCmd: BlackCmdData;
export let block: BlockData;
export let potion: PotionData;
export let rule: RuleData;
export let ui: UIData;
export let motd: MotdData;

export class dataOperation extends fileOperation {
    static init() {
        try {
            if (!super.hasConfig()) super.setConfig(JSON.stringify(__inits.config));
            if (!super.hasData(pluginFile.bindcmd)) super.setData(pluginFile.bindcmd, JSON.stringify([]));
            if (!super.hasData(pluginFile.blackcmd)) super.setData(pluginFile.blackcmd, JSON.stringify([]));
            if (!super.hasData(pluginFile.block)) super.setData(pluginFile.block, JSON.stringify(__inits.block));
            if (!super.hasData(pluginFile.potion)) super.setData(pluginFile.potion, JSON.stringify(__inits.potion));
            if (!super.hasData(pluginFile.rule)) super.setData(pluginFile.rule, JSON.stringify(__inits.rule));
            if (!super.hasData(pluginFile.ui)) super.setData(pluginFile.ui, JSON.stringify(__inits.ui));
            if (!super.hasData(pluginFile.motd)) super.setData(pluginFile.motd, JSON.stringify([]));
            return true;
        } catch (err) {
            formatPrintError(err);
            return false;
        }
    }

    static load() {
        try {
            this.init();
            config = JSON.parse(super.getConfig());
            bindcmd = JSON.parse(super.getData(pluginFile.bindcmd));
            blackCmd = JSON.parse(super.getData(pluginFile.blackcmd));
            block = JSON.parse(super.getData(pluginFile.block));
            potion = JSON.parse(super.getData(pluginFile.potion));
            rule = JSON.parse(super.getData(pluginFile.rule));
            ui = JSON.parse(super.getData(pluginFile.ui));
            motd = JSON.parse(super.getData(pluginFile.motd));
            return true;
        } catch (err) {
            formatPrintError(err);
            return false;
        }
    }
}
