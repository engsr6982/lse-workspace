import { Other } from "../Other.js";
import { Gm_Tell, db } from "../cache.js";


export function PlayerSetingForm(pl) {
    let PlayerSeting = db.get('PlayerSeting');
    const fm = Other.CustomForm();
    fm.addSwitch('接受传送请求', PlayerSeting[pl.realName].AcceptTransmission);
    fm.addSwitch('传送时二次确认', PlayerSeting[pl.realName].SecondaryConfirmation);
    fm.addSwitch('收到传送请求时是否弹窗', PlayerSeting[pl.realName].SendRequestPopup);
    fm.addSwitch('死亡后弹出返回死亡点弹窗', PlayerSeting[pl.realName].DeathPopup);
    pl.sendForm(fm, (pl, dt) => {
        if (dt == null) return Other.CloseTell(pl);
        const data = {
            AcceptTransmission: Boolean(dt[0]).valueOf(),
            SecondaryConfirmation: Boolean(dt[1]).valueOf(),
            SendRequestPopup: Boolean(dt[2]).valueOf(),
            DeathPopup: Boolean(dt[3]).valueOf()
        };
        PlayerSeting[pl.realName] = data;
        // FileOperation.saveFile();
        db.set('PlayerSeting', PlayerSeting);
        pl.tell(Gm_Tell + '操作已保存');
    })
}