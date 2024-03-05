import { pluginFile, pluginFolderPath } from "./GlobalEnums.js";

/**文件操作 */
export class fileOperation {
    /**
     * 配置文件是否存在
     * @returns 是否存在
     */
    static hasConfig() {
        return file.exists(pluginFolderPath.global + pluginFile.config);
    }
    /**
     * 读取config
     * @returns config内容
     */
    static getConfig(): string | null {
        return file.readFrom(pluginFolderPath.global + pluginFile.config);
    }
    /**
     * 写入config
     * @param newConfig 新配置文件
     * @returns 是否写入成功
     */
    static setConfig(newConfig: string) {
        return file.writeTo(pluginFolderPath.global + pluginFile.config, newConfig);
    }

    /**
     * data中是否存在指定文件
     * @param fileName 文件名 a.json
     * @returns 是否存在
     */
    static hasData(fileName: string) {
        return file.exists(pluginFolderPath.data + fileName);
    }
    /**
     * 读取data指定文件内容
     * @param fileName 文件名 a.json
     * @returns 是否读取成功
     */
    static getData(fileName: string): string | null {
        return file.readFrom(pluginFolderPath.data + fileName);
    }
    /**
     * 写入数据到data指定文件
     * @param fileName 文件名 a.json
     * @param data 数据
     * @returns 是否写入成功
     */
    static setData(fileName: string, data: string) {
        return file.writeTo(pluginFolderPath.data + fileName, data);
    }

    /**
     * 指定语言翻译文件是否存在
     * @param language 语言 如：zh_CN en
     * @returns 是否存在
     */
    static hasLang(language: string) {
        return file.exists(pluginFolderPath.lang + language + ".json");
    }
    /**
     * 写入翻译数据到lang
     * @param language 语言 如：zh_CN en
     * @param data 翻译数据
     * @returns 是否写入成功
     */
    static setLang(language: string, data: string) {
        return file.writeTo(pluginFolderPath.lang + language + ".json", data);
    }
}
