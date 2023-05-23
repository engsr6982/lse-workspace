
/**插件信息 */
export const PLUGIN_INFO = {
    Name: 'TpSystem',
    Introduce: 'TpSystem 传送系统',
    Version: [0, 1, 0, Version.Dev],
    Author: 'PPOUI',
    MineBBS: 'https://www.minebbs.com/resources/tpsystem-gui-gui.5755/'
}

export const _filePath = `.\\Plugins\\${PLUGIN_INFO.Author}\\${PLUGIN_INFO.Name}\\`;
export const Gm_Tell = `§e§l[§d${PLUGIN_INFO.Name}§e]§r§a `;

// KVDB数据库
export const db = new KVDatabase(_filePath + 'db');

/**配置文件 */
export let Config = {}/* __init.Config */

// /**家园 */
// export let Home = {}
// /**公共传送点 */
// export let Warp = []
// /**玩家设置 */
// export let PlayerSeting = {}
// /**死亡信息 */
// export let Death = {}
// /**合并请求 */
// export let MergeRequest = []

// 缓存
/**主页UI */
export let MainUI = []
/**TPA缓存 */
export let TPACache = []
/**返回死亡点无敌 */
export let DeathInvincible = [];

// const filePath = _filePath + 'data\\';

export class FileOperation {
    // 配置文路径
    static _Config = _filePath + 'Config.json';
    // static _Home = filePath + 'Home.json';
    // static _Warp = filePath + 'Warp.json';
    // static _Death = filePath + 'Death.json';
    // static _PlayerSeting = filePath + 'PlayerSeting.json';
    // static _MergeRequest = filePath + 'MergeRequest.json';
    static _MainUI = _filePath + 'GUI\\MainUI.json';

    /**检查文件 */
    static async auditFile() {
        if (!file.exists(this._Config)) file.writeTo(this._Config, JSON.stringify(__init.Config, null, '\t'));
        // if (!file.exists(this._Home)) file.writeTo(this._Home, '{}');
        // if (!file.exists(this._Warp)) file.writeTo(this._Warp, '[]');
        // if (!file.exists(this._Death)) file.writeTo(this._Death, '{}');
        // if (!file.exists(this._PlayerSeting)) file.writeTo(this._PlayerSeting, '{}');
        // if (!file.exists(this._MergeRequest)) file.writeTo(this._MergeRequest, '[]');
        if (!file.exists(this._MainUI)) file.writeTo(this._MainUI, JSON.stringify(__init.MainUI, null, '\t'));
    }

    /**读取文件 */
    static async readFile() {
        try {
            this.auditFile();
            Config = JSON.parse(file.readFrom(this._Config));
            // Home = JSON.parse(file.readFrom(this._Home));
            // Warp = JSON.parse(file.readFrom(this._Warp));
            // Death = JSON.parse(file.readFrom(this._Death));
            // PlayerSeting = JSON.parse(file.readFrom(this._PlayerSeting));
            // MergeRequest = JSON.parse(file.readFrom(this._MergeRequest));
            MainUI = JSON.parse(file.readFrom(this._MainUI));
        } catch (e) {
            throw new Error(e);
        }
    }

    /**保存文件 */
    static async saveFile() {
        try {
            file.writeTo(this._Config, JSON.stringify(Config, null, '\t'));
            // file.writeTo(this._Home, JSON.stringify(Home, null, '\t'));
            // file.writeTo(this._Warp, JSON.stringify(Warp, null, '\t'));
            // file.writeTo(this._Death, JSON.stringify(Death, null, '\t'));
            // file.writeTo(this._PlayerSeting, JSON.stringify(PlayerSeting, null, '\t'));
            // file.writeTo(this._MergeRequest, JSON.stringify(MergeRequest, null, '\t'));
            file.writeTo(this._MainUI, JSON.stringify(MainUI, null, '\t'));
            this.readFile();
        } catch (e) {
            throw new Error(e);
        }
    }
}

/**待释放配置文件 */
export const __init = {
    /**配置文件 */
    Config: {
        "Command": {//命令配置
            "name": "tps",//命令名称
            "Describe": "传送系统"//命令描述
        },
        "Money": {//经济配置
            "Enable": true,//开关
            "LLMoney": true,//是否启用LLMoney
            "MoneyName": "money"//经济名称
        },
        "Home": {//家园传送配置
            "Enable": true,
            "CreateHome": 0,//创建家 所需经济
            "GoHome": 0,//前往家 经济
            "EditHome_Name": 0,//编辑家（名称） 经济
            "EditHome_Pos": 0,// 编辑家（坐标） 经济
            "DeleteHome": 0,//删除家 经济
            "MaxHome": 10//最大家园数量
        },
        "Warp": {//公共传送点配置
            "Enable": true,
            "GoWarp": 0//前往传送点 经济
        },
        "TPA": {//玩家传送配置//todo  无实际功能（未开发）
            "Enable": true,//todo
            "Player_Player": 0,//玩家传玩家 经济//todo
            // "Player_Home": 0,//玩家穿家 经济//todo 需砍掉
            "CacheExpirationTime": 30,//缓存过期时间//todo
            "CacheExpirationTimeUnit": "second"//缓存过期时间单位 "second"秒 "minute"分钟//todo
        },
        "Death": {//死亡传送配置
            "Enable": true,
            "GoDelath": 0,//前往死亡点 经济
            "sendBackGUI": true,//发送死亡返回传送点弹窗 总开关
            "InvincibleTime": 30,//无敌时间 
            "InvincibleTimeUnit": "second"//无敌时间单位 "second"秒 "minute"分钟
        },
        "TPR": {//随机传送配置
            "Enable": true,
            "Min": 1000,//随机坐标最小值
            "Max": 5000,//最大值
            "Money": 0,//所需经济
            "MainWorld": true,//主世界
            "Infernal": true,//地狱
            "Terminus": true//末地
        },
        "MergeRequest": {//并入公共传送点配置
            "Enable": true,
            "sendRequest": 0,//发送请求 经济
            "DeleteRequest": 0//删除请求 经济
        },
        "PlayerSeting": {//玩家配置默认
            "AcceptTransmission": true,//接受传送请求
            "SecondaryConfirmation": true,//传送二次确认
            "SendRequestPopup": true,//传送请求弹窗
            "DeathPopup": true//死亡弹出返回死亡点 子开关
        },
        "AutoCompleteAttributes": true//自动补齐属性
    },
    /**主页表单 */
    MainUI: [
        { "name": '家园传送', "image": 'textures/ui/village_hero_effect', "type": "inside", "open": "HomeUi" },
        { "name": '公共传送', "image": 'textures/ui/icon_best3', "type": "inside", "open": "WarpUi" },
        // { "name": '玩家传送', "image": 'textures/ui/icon_multiplayer', "type": "inside", "open": "PlayerUi" },//todo
        { "name": '死亡传送', "image": 'textures/ui/friend_glyph_desaturated', "type": "inside", "open": "DeathUi" },
        { "name": '随机传送', "image": 'textures/ui/mashup_world', "type": "inside", "open": "RandomUi" },
        { "name": '个人设置', "image": 'textures/ui/icon_setting', "type": "inside", "open": "SetingUi" }
    ]
}