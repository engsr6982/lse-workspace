export const pluginInformation = {
    /**插件名 */
    name: "LSE-TPSystem",
    /**插件描述 */
    introduce: "LSE-TPSystem 传送系统",
    /**版本 */
    version: [1, 2, 0, Version.Release] as readonly [number, number, number, Version],
    /**作者 */
    author: "PPOUI",
    /**MineBBS资源地址 */
    mineBBS: "https://www.minebbs.com/resources/tpsystem.5755/",
};

export enum pluginFloder {
    /** 根路径 */
    "global" = ".\\plugins\\PPOUI\\LSE-TPSystem\\",
    "data" = global + "data\\",
    "leveldb" = global + "leveldb\\",
    "import_" = global + "import\\",
    "export_" = global + "export\\",
}

export const tellTitle = `§e§l[§d${pluginInformation.name}§e]§r§a `;

export const dimidArray = ["主世界", "地狱", "末地"];
