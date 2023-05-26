// LiteLoader-AIDS automatic generated
/// <reference path="c:\Users\Administrator\Documents\aids/dts/HelperLib-master/src/index.d.ts"/> 
import { _filePath, db } from "./cache.js";

const jsonpath = _filePath + 'json\\';

export default class KVDBTransformation {
    _outpath = jsonpath + 'out\\';

    todb() {
        this.bak();// 备份已有数据，防止误操作
        try {
            const filename = ['Home', 'Warp', 'Death', 'PlayerSeting', 'MergeRequest'];
            filename.forEach(i => {
                if (file.exists(jsonpath + `${i}.json`)) {
                    db.set(i, JSON.parse(file.readFrom(jsonpath + `${i}.json`)));
                } else {
                    logger.warn(`[KVDB数据库] 文件：${jsonpath + `${i}.json`} 不存在！ 已跳过此文件！`);
                }
            });
            return true;
        } catch (e) {
            logger.error(`[KVDB数据库] 捕获错误：\n${e}`);
        }
    }

    tojson() {
        try {
            const key = db.listKey();
            if (key.length == 0) return logger.warn(`[KVDB数据库] 未获取到任何键数据，无法继续执行操作！`);
            key.forEach(i => {
                if (file.writeTo(this._outpath + `${i}.json`, JSON.stringify(db.get(i), null, '\t'))) {
                    logger.info(`保存文件[${this._outpath + i}.json]成功！`);
                } else {
                    logger.error(`保存文件[${this._outpath + i}.json]失败！`);
                }
            });
            logger.info(`保存完成！ 共[${key.length}]个文件`);
            return true;
        } catch (e) {
            logger.error(`[KVDB数据库] 捕获错误：\n${e}`);
        }
    }

    bak() {
        try {
            const key = db.listKey(); // 获取所有键数据
            if (key.length == 0) return logger.warn(`[KVDB数据库] 未获取到任何键数据，无法继续执行操作！`);
            const tmp = {};
            key.forEach(i => {
                tmp[i] = db.get(i);
            });
            logger.debug(tmp);
            file.writeTo(this._outpath + `KVDB_BackUP.bak`, JSON.stringify(tmp, null, '\t'));
        } catch (e) {
            logger.error(`[KVDB数据库] 捕获错误：\n${e}`);
        }
    }

    init() {
        // 初始化键值数据库（防止初次使用null导致报错）
        ['Home', 'Warp', 'Death', 'PlayerSeting', 'MergeRequest'].forEach(i => {
            const KVDB_table = {// 映射每个键对应的类型
                Home: {},
                Death: {},
                PlayerSeting: {},
                Warp: [],
                MergeRequest: []
            }
            const status = db.get(i);
            if (status == null) {
                logger.warn(`[KVDB数据库] 键：${i} 的值为：${status} !  已初始化为空${/* typeof KVDB_table[i] */ Object.prototype.toString.call(KVDB_table[i])}`);
                db.set(i, KVDB_table[i]);
            }
        })
    }
}