import { tprNotSecurityPos, tprSuccess } from "./ProcessingResults.js";
import { tprFail } from "./ProcessingResults.js";

let ZoneCheck_FindPos: (
    pos: Arg1,
    whi: Arg2,
    bl: string[],
    offset: Arg4,
) => { status: 0 | 1; x: number; y: number; z: number; dimid: number };

export function tprZoneCheckCore(player: Player, forPosInfo: Arg2, targetPos: IntPos, BackUpPos: IntPos) {
    try {
        if (ll.hasExported("ZoneCheckV3", "findPos") && ZoneCheck_FindPos == null) {
            ZoneCheck_FindPos = ll.imports("ZoneCheckV3", "findPos");
        }

        // 调用ZoneCheckV3的findPos方法，并解构返回值
        const { status, x, y, z, dimid } = ZoneCheck_FindPos(
            { x: targetPos.x, z: targetPos.z, dimid: targetPos.dimid },
            forPosInfo,
            ["minecraft:lava", "minecraft:flowing_lava"],
            {
                offset1: 1, // please don't change this
                offset2: 2,
            },
        );

        // 检查ZoneChekcV3的findPos方法是否返回了预期的值
        if (status === 1) {
            tprSuccess(player, new IntPos(x, y, z, dimid));
        } else if (status === 0) {
            // throw new Error("Fail in ZoneCheckV3.findPos, beacuse function return status is 0");
            tprNotSecurityPos(player, BackUpPos);
        } else {
            throw new Error("Fail in ZoneCheckV3.findPos, unknown error");
        }
    } catch (error) {
        tprFail(player, error, BackUpPos);
    }
}
