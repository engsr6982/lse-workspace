import { Gm_Tell, Config, db } from "../cache.js";
import { Money_Mod } from "../Money.js";
import { Other } from "../Other.js";

export class MergeRequest_Core {
    static CerateRequest(pl, id) {
        let MergeRequest = db.get('MergeRequest');
        let Home = db.get('Home');
        if (Money_Mod.DeductEconomy(pl, Config.MergeRequest.sendRequest)) {
            MergeRequest.push({
                player: pl.realName,
                guid: Other.RandomID(),
                time: system.getTimeStr(),
                data: Home[pl.realName][id]
            });
            // FileOperation.saveFile();
            db.set('MergeRequest', MergeRequest);
            pl.tell(Gm_Tell + '发送成功！');
        }
    }
    static RevokeRequest(pl, id) {
        let MergeRequest = db.get('MergeRequest');
        if (Money_Mod.DeductEconomy(pl, Config.MergeRequest.DeleteRequest)) {
            MergeRequest.splice(id, 1);
            // FileOperation.saveFile();
            db.set('MergeRequest', MergeRequest);
            pl.tell(Gm_Tell + '撤销成功！');
        }
    }
}