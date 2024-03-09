
import { _filePath } from "./cache.js";
import { posToObject } from "./conversion.js";

// 创建文件夹
!file.exists(_filePath + "data") ? file.mkdir(_filePath + "data") : null;

// eslint-disable-next-line no-undef
export const session = new DBSession("sqlite3", {
    path: `${_filePath}data\\data.sqlite`,
});

// 创建表
session.exec(`
    CREATE TABLE IF NOT EXISTS "tab" (
        BindPlayer TEXT NOT NULL,
        Name TEXT NOT NULL,
        isInvincible BOOLEAN NOT NULL,
        isAutoResurrection BOOLEAN NOT NULL,
        isAutoOnline BOOLEAN NOT NULL,
        OnlinePos TEXT NOT NULL,
        Bag TEXT,
        PRIMARY KEY(BindPlayer, Name)
    );
`);

/**
 * 更新/创建 假人数据
 * @param {T_FP_INFO} fp
 * @returns
 */
export function insertFP(fp) {
    try {
        // 准备SQL语句
        const stmt = session.prepare(`
        INSERT OR REPLACE INTO "tab" (
            BindPlayer, 
            Name, 
            isInvincible, 
            isAutoResurrection, 
            isAutoOnline, 
            OnlinePos, 
            Bag
        ) VALUES (
            $BindPlayer, 
            $Name, 
            $isInvincible, 
            $isAutoResurrection, 
            $isAutoOnline, 
            $OnlinePos, 
            $Bag
        )
        `);

        const toNumber = (bool) => {
            return bool ? 1 : 0;
        };
        fp.isInvincible = toNumber(fp.isInvincible);
        fp.isAutoResurrection = toNumber(fp.isAutoResurrection);
        fp.isAutoOnline = toNumber(fp.isAutoOnline);

        // 由于背包保存未完成，所以bag留空
        // fp.Bag = "";

        // 绑定参数
        stmt.bind({
            BindPlayer: fp.BindPlayer,
            Name: fp.Name,
            isInvincible: fp.isInvincible,
            isAutoResurrection: fp.isAutoResurrection,
            isAutoOnline: fp.isAutoOnline,
            OnlinePos: JSON.stringify(posToObject(fp.OnlinePos)), // 假设OnlinePos是一个对象，我们将其转换为字符串存储
            Bag: /* JSON.stringify(fp.Bag) */ fp.Bag,
        });

        // 执行语句
        stmt.execute();
        return true;
    } catch (e) {
        logger.error(`操作数据库失败\n${e}\n${e.stack}`);
        return false;
    }
}

export function findDataByBindPlayerAndName(bindPlayer, name) {
    const stmt = session.prepare(`
        SELECT * FROM "tab" WHERE BindPlayer = $BindPlayer AND Name = $Name
    `);
    stmt.bind({
        BindPlayer: bindPlayer,
        Name: name,
    });
    const result = stmt.fetch();
    if (result) {
        return result;
    } else {
        return null;
    }
}

// colorLog("green", findDataByBindPlayerAndName("PPOUI6982", "aa"));

export function findDataByName(name) {
    const stmt = session.prepare(`
        SELECT * FROM "tab" WHERE Name = $Name
    `);
    stmt.bind({
        Name: name,
    });
    const result = stmt.fetch();
    if (result) {
        return result;
    } else {
        return null;
    }
}

// colorLog("green", findDataByName("bb"));

function parseFP(data = []) {
    return data.map((row) => {
        return {
            Name: row[1],
            isInvincible: Boolean(row[2]).valueOf(),
            isAutoResurrection: Boolean(row[3]).valueOf(),
            BindPlayer: row[0],
            isAutoOnline: Boolean(row[4]).valueOf(),
            OnlinePos: JSON.parse(row[5]),
            Bag: row[6],
        };
    });
}

export function findAllDataByBindPlayer(bindPlayer) {
    const stmt = session.prepare(`
        SELECT * FROM "tab" WHERE BindPlayer = $BindPlayer
    `);
    stmt.bind({
        BindPlayer: bindPlayer,
    });
    const result = stmt.fetchAll();
    if (result != null) {
        result.shift();
        return parseFP(result);
    } else {
        return null;
    }
}

// colorLog("green", findAllDataByBindPlayer("PPOUI6982"));

/**
 * 获取所有AutoOnline=true的假人数据
 * @returns
 */
export function findAllDataWithAutoOnlineTrue() {
    const stmt = session.prepare(`
        SELECT * FROM "tab" WHERE isAutoOnline = 1
    `);
    const result = stmt.fetchAll();
    if (result != null) {
        result.shift();
        return parseFP(result);
    } else {
        return null;
    }
}

// colorLog("green", findAllDataWithAutoOnlineTrue());

export function deleteDataByBindPlayerAndName(bindPlayer, name) {
    const stmt = session.prepare(`
        DELETE FROM "tab" WHERE BindPlayer = $BindPlayer AND Name = $Name
    `);
    stmt.bind({
        BindPlayer: bindPlayer,
        Name: name,
    });
    const result = stmt.execute();
    return result !== null;
}

// const success = deleteDataByBindPlayerAndName("PPOUI6982", "aa");
// colorLog("green", success);

export function getAllData() {
    const stmt = session.prepare(`
        SELECT * FROM "tab"
    `);
    const result = stmt.fetchAll();
    if (result != null) {
        result.shift();
        return parseFP(result);
    } else {
        return null;
    }
}

// colorLog("green", getAllData());
