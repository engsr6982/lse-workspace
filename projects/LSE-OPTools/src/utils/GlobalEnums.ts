/**插件文件夹路径 */
export const enum pluginFolderPath {
    "global" = ".\\plugins\\PPOUI\\LSE-OPTools\\",
    "data" = global + "data\\",
    "lang" = global + "lang\\",
    "lib" = global + "lib\\",
    "lib-plugins" = lib + "plugins",
}

/**插件文件 */
export const enum pluginFile {
    "config" = "Config.json",
    "bindcmd" = "BindCmd.json",
    "blackcmd" = "BlackCmd.json",
    "block" = "Block.json",
    "potion" = "Potion.json",
    "rule" = "Rule.json",
    "ui" = "UI.json",
    "motd" = "Motd.json",
}
