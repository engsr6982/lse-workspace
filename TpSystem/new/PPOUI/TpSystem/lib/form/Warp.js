import { Money_Mod } from "../Money.js";
import { Other } from "../Other.js";
import { Gm_Tell, PLUGIN_INFO, PlayerSeting, Warp,Config } from "../cache.js";
import { WarpCore } from "../core/Warp.js";
import { SelectAction } from "./SelectAction.js";

export function WarpForm(pl) {
    if (Warp.length == 0) return pl.tell(Gm_Tell + '无公共传送点！无法继续执行操作！');
    SelectAction(pl, Warp, true, id => {
        const Pos = new IntPos(Warp[id].x, Warp[id].y, Warp[id].z, Warp[id].dimid);
        if (PlayerSeting[pl.realName].SecondaryConfirmation) {
            pl.sendModalForm(PLUGIN_INFO.Introduce, `名称： ${Warp[id].name}\n坐标： ${Warp[id].x},${Warp[id].y},${Warp[id].z}\n维度： ${Other.DimidToDimension(Warp[id].dimid)}\n${Money_Mod.getEconomyStr(pl, Config.Warp.GoWarp)}`, '确认', '返回上一页', (_, res) => {
                switch (res) {
                    case true: WarpCore.GoWarp(pl, Pos); break;
                    case false: WarpForm(pl); break;
                    default: Other.CloseTell(pl); break;
                }
            });
        } else {
            WarpCore.GoWarp(pl, Pos)
        }
    })
}