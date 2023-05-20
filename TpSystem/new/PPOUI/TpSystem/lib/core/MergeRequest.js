import { FileOperation, Gm_Tell, Home, Config, MergeRequest } from "../cache.js";
import { Money_Mod } from "../Money.js";
import { Other } from "../Other.js";

export class MergeRequest_Core {
    static CerateRequest(pl, id) {
        if (Money_Mod.DeductEconomy(pl, Config.MergeRequest.sendRequest)) {
            MergeRequest.push({
                player: pl.realName,
                guid: Other.RandomID(),
                time: system.getTimeStr(),
                data: Home[pl.realName][id]
            });
            FileOperation.SaveFile();
            pl.tell(Gm_Tell + '发送成功！');
        }
    }
    static RevokeRequest(pl, id) {
        if (Money_Mod.DeductEconomy(pl, Config.MergeRequest.DeleteRequest)) {
            MergeRequest.splice(id, 1);
            FileOperation.SaveFile();
            pl.tell(Gm_Tell + '撤销成功！');
        }
    }
}