/**文件操作 */
export class FileOperation {
    static _Config_FilePath = _FilePath + 'Config.json';
    static _Home_FilePath = _FilePath + 'Home.json';
    static _Warp_FilePath = _FilePath + 'Warp.json';
    static _PlayerSeting_FilePath = _FilePath + 'PlayerSeting.json';
    static _Death_FilePath = _FilePath + 'Death.json';
    static _MergeRequest_FilePath = _FilePath + 'MergeRequest.json';
    static _MainUI = _FilePath + 'GUI\\MainUI.json';

    /**
     * 读取配置文件
     */
    static ReadFile() {
        /* 检查文件 */
        if (!file.exists(this._Home_FilePath)) file.writeTo(this._Home_FilePath, '{}');
        if (!file.exists(this._Warp_FilePath)) file.writeTo(this._Warp_FilePath, '[]');
        if (!file.exists(this._PlayerSeting_FilePath)) file.writeTo(this._PlayerSeting_FilePath, '{}');
        if (!file.exists(this._Config_FilePath)) file.writeTo(this._Config_FilePath, JSON.stringify(
            {
                "Command": {
                    "name": "tps",
                    "Describe": "传送系统"
                },
                "Money": {
                    "Enable": true,
                    "LLMoney": true,
                    "MoneyName": "money"
                },
                "Home": {
                    "Enable": true,
                    "CreateHome": 0,
                    "GoHome": 0,
                    "EditHome": 0,
                    "DeleteHome": 0
                },
                "Warp": {
                    "Enable": true,
                    "GoWarp": 0
                },
                "Player": {
                    "Enable": true,
                    "Player_Player": 0,
                    "Player_Home": 0
                },
                "Delath": {
                    "Enable": true,
                    "GoDelath": 0
                },
                "TPR": {
                    "Enable": true,
                    "Min": 1000,
                    "Max": 5000,
                    "Money": 0
                },
                "MergeRequest": {
                    "Enable": true,
                    "sendRequest": 0,
                    "DeleteRequest": 0
                }
            }
            , null, '\t'));
        if (!file.exists(this._Death_FilePath)) file.writeTo(this._Death_FilePath, '{}');
        if (!file.exists(this._MergeRequest_FilePath)) file.writeTo(this._MergeRequest_FilePath, '[]');
        if (!file.exists(this._MainUI)) file.writeTo(this._MainUI, JSON.stringify(
            [
                { "name": '家园传送', "image": 'textures/ui/village_hero_effect', "type": "inside", "open": "HomeUi" },
                { "name": '公共传送', "image": 'textures/ui/icon_best3', "type": "inside", "open": "WarpUi" },
                { "name": '玩家传送', "image": 'textures/ui/icon_multiplayer', "type": "inside", "open": "PlayerUi" },
                { "name": '死亡传送', "image": 'textures/ui/friend_glyph_desaturated', "type": "inside", "open": "DeathUi" },
                { "name": '随机传送', "image": 'textures/ui/mashup_world', "type": "inside", "open": "RandomUi" },
                { "name": '个人设置', "image": 'textures/ui/icon_setting', "type": "inside", "open": "SetingUi" }
            ]
            , null, '\t'
        ))
        /* 读取文件 */
        Home = JSON.parse(file.readFrom(this._Home_FilePath));
        Warp = JSON.parse(file.readFrom(this._Warp_FilePath));
        PlayerSeting = JSON.parse(file.readFrom(this._PlayerSeting_FilePath));
        Config = JSON.parse(file.readFrom(this._Config_FilePath));
        Death = JSON.parse(file.readFrom(this._Death_FilePath));
        MergeRequest = JSON.parse(file.readFrom(this._MergeRequest_FilePath));
        MainUI = JSON.parse(file.readFrom(this._MainUI));
    }
    /**
     * 保存并重新读取配置文件
     */
    static SaveFile() {
        file.writeTo(this._Home_FilePath, JSON.stringify(Home, null, '\t'));
        file.writeTo(this._Warp_FilePath, JSON.stringify(Warp, null, '\t'));
        file.writeTo(this._PlayerSeting_FilePath, JSON.stringify(PlayerSeting, null, '\t'));
        file.writeTo(this._Config_FilePath, JSON.stringify(Config, null, '\t'));
        file.writeTo(this._Death_FilePath, JSON.stringify(Death, null, '\t'));
        file.writeTo(this._MergeRequest_FilePath, JSON.stringify(MergeRequest, null, '\t'));
        file.writeTo(this._MainUI, JSON.stringify(MainUI, null, '\t'));
        this.ReadFile();
    }
};
