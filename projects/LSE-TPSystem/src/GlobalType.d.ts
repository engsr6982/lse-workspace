interface formJSON_Structure_Item {
    name: string;
    image: string;
    type: "cmd" | "subform";
    open: string | Array<formJSON_Structure_Item>;
}

interface Config_Structure {
    Command: {
        Command: string; // 要注册的命令
        Describe: string; // 命令描述
    };
    Money: {
        Enable: boolean; // 是否启用经济
        MoneyType: "llmoney" | "score"; // 经济类别  "llmoney" 或 "score"
        ScoreType: string; // 计分板经济 存储经济的计分板
        MoneyName: string; // 经济名称
    };
    Tpa: {
        Enable: boolean;
        Money: number; // tpa消耗的经济
        CacheExpirationTime: number; // 缓存过期时间 单位:毫秒
        CacheCheckFrequency: number; // 缓存检查频率 单位:毫秒（小于等于0 则关闭） 异步
    };
    Home: {
        Enable: boolean;
        CreatHomeMoney: number; // 创建家 经济
        GoHomeMoney: number; // 前往家 经济
        EditNameMoney: number; // 编辑名称 经济
        EditPosMoney: number; // 编辑坐标 经济
        DeleteHomeMoney: number; // 删除家 经济
        MaxHome: number; // 最大家数量
    };
    Warp: {
        Enable: boolean;
        // OpenWarp: boolean; // 是否开放给玩家
        GoWarpMoney: number; // 前往公共传送点 经济
    };
    Death: {
        Enable: boolean;
        sendGoDeathGUI: boolean; // 死亡后立即发送返回死亡点GUI
        GoDeathMoney: number; // 前往死亡点 经济
        MaxDeath: number; // 最大存储死亡信息数量
        // InvincibleTime: {
        //     // 无敌时间配置
        //     unit: "second" | "minute";
        //     time: number;
        // };
    };
    Tpr: {
        Enable: boolean;
        UseZoneCheckV3API: boolean;
        randomRange: {
            // 随机范围
            min: number; // 最小值
            max: number; // 最大值
        };
        Dimension: {
            // 维度配置
            Overworld: boolean; // 主世界
            TheNether: boolean; // 地狱
            TheEnd: boolean; // 末地
        };
        restrictedArea: {
            // 区域限制配置 依赖ZoneCheck API
            Enable: true;
            Type: "Circle" | "Square"; // 圆Circle 方Square
            Pos: {
                // 中心坐标
                x: 0; // 中心X
                z: 0; // 中心 Z
                radius: 10; // 半径
            };
        };
        Money: number; // 消耗经济
    };
    Pr: {
        Enable: boolean;
        SendRequestMoney: number; // 发送请求
        DeleteRequestMoney: number; // 删除请求
    };
    Rule: levelDB_and_Config_Rule_Structure_Item;
    // Debug?: boolean; // 是否开启Debug模式(输出一些debug信息)
    logLevel: 0 | 1 | 2 | 3 | 4 | 5; // 日志等级
}

interface levelDB_and_Config_Rule_Structure_Item {
    deathPopup: boolean; // 死亡后立即发送返回弹窗
    allowTpa: boolean; // 允许对xx发送tpa请求
    tpaPopup: boolean; // tpa弹窗
}

interface Axis {
    x: number;
    y: number;
    z: number;
}

interface Vec3 extends Axis {
    /** 主世界|地狱|末地 */
    dimid: 0 | 1 | 2;
}

// ==================================== LevelDB

interface dataDate {
    /** 创建日期 */
    createdTime: string;
    /** 修改日期 */
    modifiedTime: string;
}

interface levelDB_Death_Structure {
    [realName: string]: Array<
        Vec3 & {
            /** 死亡时间 */
            time: string;
        }
    >;
}

interface levelDB_Pr_Structure_Item {
    guid: string;
    playerRealName: string;
    time: string;
    data: Vec3 & {
        name: string;
    };
}

type levelDB_Pr_Structure = Array<levelDB_Pr_Structure_Item>;

interface levelDB_Rule_Structure {
    [realName: string]: levelDB_and_Config_Rule_Structure_Item;
}

interface levelDB_Structure {
    home: levelDB_Home_Structure; // obj
    warp: levelDB_Warp_Structure; // arr
    death: levelDB_Death_Structure; // obj
    pr: levelDB_Pr_Structure; // arr
    rule: levelDB_Rule_Structure; // obj
}

// home / warp

// interface levelDB_Home_Structure {
//     [realName: string]: {
//         [home_name: string]: Vec3 & dataDate;
//     };
// }

interface levelDB_Home_Structure_Item extends Vec3, dataDate {
    name: string;
}

interface levelDB_Home_Structure {
    [realName: string]: Array<levelDB_Home_Structure_Item>;
}

// interface levelDB_Warp_Structure {
//     [warp_name: string]: Vec3 & dataDate;
// }

interface levelDB_Warp_Structure_Item extends Vec3, dataDate {
    name: string;
}

type levelDB_Warp_Structure = Array<levelDB_Warp_Structure_Item>;
