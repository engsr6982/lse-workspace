import { time } from "../../../LSE-Modules/src/Time.js";
import { leveldb } from "../utils/leveldb.js";
import { warpCore_Instance } from "../warp/WarpCore.js";

class PrCore {
    constructor() {}

    _addPR(pr: levelDB_Pr_Structure_Item) {
        const p = leveldb.getPr();
        p.unshift(pr);
        return leveldb.setPr(p);
    }
    _deletePr(guid: string) {
        const p = leveldb.getPr();
        const index = p.findIndex((i) => i.guid === guid);
        if (index === -1) return false;
        p.splice(index, 1);
        return leveldb.setPr(p);
    }
    _acceptPr(guid: string) {
        const allPr = leveldb.getPr();
        const index = allPr.findIndex((i) => i.guid === guid);
        if (index === -1) return false;
        const element = allPr[index];
        warpCore_Instance._addWarp(element.data.name, element.data); // add warp
        allPr.splice(index, 1);
        return leveldb.setPr(allPr);
    }

    createPr(realName: string, dt: Vec3 & { name: string }) {
        const p: levelDB_Pr_Structure_Item = {
            data: dt,
            playerRealName: realName,
            time: time.formatDateToString(new Date()),
            guid: system.randomGuid(),
        };
        return this._addPR(p);
    }
}

export const prCore_Instance = new PrCore();
