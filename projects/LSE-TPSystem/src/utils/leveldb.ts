import { time } from "../../../LSE-Modules/src/Time.js";
import { convertData } from "../convertData/convertData.js";
import { homeMap } from "../home/Mapping.js";
import { warpMap } from "../warp/Mapping.js";
import { pluginFloder } from "./GlobalVars.js";

const leveldb_Inst = new KVDatabase(pluginFloder.leveldb);

export class leveldb {
    // home
    static getHome(): levelDB_Home_Structure {
        return leveldb_Inst.get("home");
    }
    static setHome(newData: levelDB_Home_Structure): boolean {
        // return leveldb_Inst.set("home", newData);
        const s = leveldb_Inst.set("home", newData);
        homeMap.initHomeMapping(); // 更新映射
        return s;
    }

    // warp
    static getWarp(): levelDB_Warp_Structure {
        return leveldb_Inst.get("warp");
    }
    static setWarp(newData: levelDB_Warp_Structure): boolean {
        // return leveldb_Inst.set("warp", newData);
        const s = leveldb_Inst.set("warp", newData);
        warpMap.initWarpMapping(); // 更新映射
        return s;
    }

    // death
    static getDeath(): levelDB_Death_Structure {
        return leveldb_Inst.get("death");
    }
    static setDeath(newData: levelDB_Death_Structure): boolean {
        return leveldb_Inst.set("death", newData);
    }

    // pr
    static getPr(): levelDB_Pr_Structure {
        return leveldb_Inst.get("pr");
    }
    static setPr(newData: levelDB_Pr_Structure): boolean {
        return leveldb_Inst.set("pr", newData);
    }

    // rule
    static getRule(): levelDB_Rule_Structure {
        return leveldb_Inst.get("rule");
    }
    static setRule(newData: levelDB_Rule_Structure): boolean {
        return leveldb_Inst.set("rule", newData);
    }

    // other
    static getLevelDB() {
        return leveldb_Inst;
    }

    static initLevelDB() {
        const leveldbKey = ["home", "warp", "death", "pr", "rule"];
        let index = 0;
        while (index < leveldbKey.length) {
            const k = leveldbKey[index++];
            if (leveldb_Inst.get(k) == null) {
                if (k === leveldbKey[1] || k === leveldbKey[3]) {
                    leveldb_Inst.set(k, []);
                } else {
                    leveldb_Inst.set(k, {});
                }
                logger.warn(`[LevelDB] init: ${k} > ${Object.prototype.toString.call(leveldb_Inst.get(k))} | Success!`);
            }
        }
        return true;
    }

    // command
    static importDataType(isOld: boolean = false): boolean {
        logger.debug(isOld);
        return isOld ? this.importOldData() : this.importNewData();
    }

    private static importOldData() {
        const generationConversionData = {}; // 待转换数据
        const oldFileName = ["Home", "Warp", "Death", "PlayerSeting", "MergeRequest"]; // 旧文件名

        let i = 0;
        while (i < oldFileName.length) {
            try {
                const arrValue = oldFileName[i++],
                    fileName = arrValue + ".json",
                    readPath = pluginFloder.import_ + fileName;

                if (!file.exists(readPath)) {
                    logger.warn(`旧数据文件 ${fileName} 不存在, 将跳过 ${fileName} 文件导入`);
                    continue;
                }

                // @ts-ignore
                generationConversionData[arrValue] = JSON.parse(file.readFrom(readPath));
                logger.info(`[旧数据转换] 读取解析文件 ${fileName} 成功. ${i}/${oldFileName.length}`);
            } catch (e) {
                continue;
            }
        }
        // @ts-ignore
        const convertCompletedData = convertData(generationConversionData); // 调用转换函数
        const saveFileName = `convertCompletedData_${new Date().getTime()}.json`; // 确认要保存的文件名
        logger.info("保存转换完成的数据为 => " + saveFileName);
        file.writeTo(pluginFloder.import_ + saveFileName, JSON.stringify(convertCompletedData)); // 保存转换完成数据
        return this.importNewData(saveFileName); // 调用新数据导入函数
    }

    private static importNewData(fileName?: string) {
        !fileName ? (fileName = "LevelDB.bak") : null; // 确定文件名
        const filePath = pluginFloder.import_ + fileName; // 确定文件路径
        // 检查文件
        if (!file.exists(filePath)) {
            logger.warn(`找不到导入文件<${fileName}> 请将要导入的文件重命名为 ${fileName} 并放到 import 文件夹下`);
            logger.error(`无法导入不存在的文件：${filePath}`);
            return false;
        }
        // 解析文件
        const obj = JSON.parse(file.readFrom(filePath));
        const k = Object.keys(obj); // 获取key
        // 备份数据库
        logger.warn("为了操作安全，备份数据库...");
        this.exportLevelDB();
        // 遍历key 写入数据库
        k.forEach((i) => {
            leveldb_Inst.set(i, obj[i]);
        });

        homeMap.initHomeMapping();
        warpMap.initWarpMapping();

        return true;
    }

    static exportLevelDB(): boolean {
        const key = leveldb_Inst.listKey();
        const cache: any = {};
        key.forEach((i) => {
            cache[i] = leveldb_Inst.get(i);
        });
        const filePath = pluginFloder.export_ + `LevelDB ${time.formatDateToString(new Date()).replace(/:/g, "-")}.bak`;
        file.writeTo(filePath, JSON.stringify(cache, null, 2));
        logger.info(`输出文件到：${filePath}`);
        return true;
    }
}
