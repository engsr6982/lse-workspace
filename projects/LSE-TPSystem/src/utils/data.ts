import { pluginFloder } from "./GlobalVars.js";

export const __config__: Config_Structure = {
    Command: {
        Command: "tps",
        Describe: "TPSystem Command",
    },
    Money: {
        Enable: false,
        MoneyType: "llmoney",
        ScoreType: "",
        MoneyName: "金币",
    },
    Tpa: {
        Enable: true,
        Money: 0,
        CacheExpirationTime: 30000,
        CacheCheckFrequency: 5000,
    },
    Home: {
        Enable: true,
        CreatHomeMoney: 0,
        GoHomeMoney: 0,
        EditNameMoney: 0,
        EditPosMoney: 0,
        DeleteHomeMoney: 0,
        MaxHome: 10,
    },
    Warp: {
        Enable: true,
        // OpenWarp: true,
        GoWarpMoney: 0,
    },
    Death: {
        Enable: true,
        sendGoDeathGUI: true,
        GoDeathMoney: 0,
        MaxDeath: 5,
        // InvincibleTime: {
        //     unit: "second",
        //     time: 0,
        // },
    },
    Tpr: {
        Enable: true,
        randomRange: {
            min: 100,
            max: 1000,
        },
        Dimension: {
            Overworld: true,
            TheNether: true,
            TheEnd: true,
        },
        restrictedArea: {
            Enable: true,
            Type: "Circle",
            Pos: {
                x: 0,
                z: 0,
                radius: 10,
            },
        },
        Money: 0,
    },
    Pr: {
        Enable: true,
        SendRequestMoney: 0,
        DeleteRequestMoney: 0,
    },
    Rule: {
        deathPopup: true,
        allowTpa: true,
        tpaPopup: true,
    },
    logLevel: 4,
};

const __formJson__: Array<formJSON_Structure_Item> = [
    {
        name: "家园传送",
        image: "textures/ui/village_hero_effect",
        type: "cmd",
        open: "tps home",
    },
    {
        name: "公共传送",
        image: "textures/ui/icon_best3",
        type: "cmd",
        open: "tps warp",
    },
    {
        name: "玩家传送",
        image: "textures/ui/icon_multiplayer",
        type: "cmd",
        open: "tps tpa",
    },
    {
        name: "死亡传送",
        image: "textures/ui/friend_glyph_desaturated",
        type: "cmd",
        open: "tps back",
    },
    {
        name: "随机传送",
        image: "textures/ui/mashup_world",
        type: "cmd",
        open: "tps tpr",
    },
    {
        name: "个人设置",
        image: "textures/ui/icon_setting",
        type: "cmd",
        open: "tps rule",
    },
];

export let config: Config_Structure = __config__;

export let formJSON: Array<formJSON_Structure_Item>;

export class dataFile {
    static readFile(filePath: string, defData: string = JSON.stringify({})) {
        if (!file.exists(filePath)) {
            // file.writeTo(filePath, defData);
            this.writeFile(filePath, defData);
        }
        return file.readFrom(filePath);
    }

    static writeFile(filePath: string, writeData: string) {
        return file.writeTo(filePath, writeData);
    }

    static initData() {
        config = JSON.parse(this.readFile(`${pluginFloder.global}Config.json`, JSON.stringify(__config__, null, 4)));
        formJSON = JSON.parse(this.readFile(`${pluginFloder.data}formJSON.json`, JSON.stringify(__formJson__, null, 4)));
        return true;
    }
}
