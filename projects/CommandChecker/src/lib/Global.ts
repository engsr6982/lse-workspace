/**插件信息 */
export const PLUGIN_INFO = {
    /**插件名 */
    Name: "CommandChecker",
    /**插件描述 */
    Introduce: "CommandChecker",
    /**版本 */
    Version: [0, 2, 0, Version.Beta],
    /**作者 */
    Author: "PPOUI",
    /**MineBBS资源地址 */
    MineBBS: "https://www.minebbs.com/resources/commandchecker.5939/",
    /**Debug监听器防抖 */
    DebugAntiShake: false, //
};

// 缓存  存储data.json内容  以下默认内容会覆盖
export let datas: Array<{
    cmd: string;
    whiteList: string[];
    type: "Circle" | "Square" | "SCenter";
    Radius?: number;
    CenterCoordinates?: {
        x: number;
        y: number;
        z: number;
        dimid: number;
    };
    blacklistWithinRegion: boolean;
    TopLeft?: {
        x: number;
        y: number;
        z: number;
        dimid: number;
    };
    BottomRight?: {
        x: number;
        y: number;
        z: number;
        dimid: number;
    };
    HalfLength?: number;
    CentralCoordinate?: {
        x: number;
        y: null | number;
        z: number;
        dimid: number;
    };
}> = [
    {
        // 2D/3D 圆
        cmd: "", // 命令
        whiteList: [], //白名单
        type: "Circle", // 计算方式  Circle圆  Square方
        Radius: 5, // 圆半径
        CenterCoordinates: {
            // 圆心坐标
            x: 0,
            y: 0, // 当计算方式为2D 时  此项为null
            z: 0,
            dimid: 0,
        },
        blacklistWithinRegion: false, // 设定区域内黑名单  设置为false代表区域外不可用（黑名单
    },
    {
        // 2D/3D 方
        cmd: "", // 命令
        whiteList: [], //白名单
        type: "Square", // 计算方式  Circle圆  Square方
        TopLeft: {
            // 左上角坐标
            x: 0,
            y: 0, // 当计算方式为2D 时  此项为null
            z: 0,
            dimid: 0,
        },
        BottomRight: {
            // 右下角坐标
            x: 0,
            y: 0,
            z: 0,
            dimid: 0,
        },
        blacklistWithinRegion: false, // 设定区域内黑名单  设置为false代表区域外不可用（黑名单
    },
    {
        cmd: "",
        whiteList: [], //白名单
        type: "SCenter", // 计算方式  Circle圆  Square方  SCenter方(中心)
        HalfLength: 5, // 半边长
        CentralCoordinate: {
            x: 0,
            y: null, // 当计算方式为2D 时  此项为null
            z: 0,
            dimid: 0,
        },
        blacklistWithinRegion: false, // 设定区域内黑名单  设置为false代表区域外不可用（黑名单
    },
];

// 文件路径   用于读取文件的路径
export const _filePath = `.\\plugins\\${PLUGIN_INFO.Author}\\${PLUGIN_INFO.Name}\\`;

/**data.json 操作类 */
class dataOperation_C {
    // data.json 文件路径
    datapath = _filePath + "data.json";

    // 检查文件身份存在
    check() {
        if (!file.exists(this.datapath)) {
            // 写入默认内容，空数组
            file.writeTo(this.datapath, "[]");
            logger.warn(`创建文件 ${this.datapath}`);
        }
    }

    // 读取文件
    read() {
        try {
            // 先检查一遍，防止保报错
            this.check();
            // 对默认内容重新 赋值
            datas = JSON.parse(file.readFrom(this.datapath));
            logger.debug(datas);
        } catch (e) {
            logger.error(e.stack);
        }
    }

    // 保存文件
    save() {
        try {
            file.writeTo(this.datapath, JSON.stringify(datas));
        } catch (e) {
            logger.error(e.stack);
        }
    }
}

// 导出实例化后的类（懒得再次实例化）
export const dataOperation = new dataOperation_C();
