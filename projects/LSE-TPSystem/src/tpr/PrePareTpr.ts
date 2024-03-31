import { money_Instance } from "../include/money.js";
import { config } from "../utils/data.js";
import { sendMessage } from "../utils/util.js";
import { tprAwaitChunkLoad } from "./AwaitChunkLoad.js";
import { legacyTprCore } from "./LegacyTprCore.js";
import { tprRandomPos } from "./RandomPos.js";
import { tprZoneCheckCore } from "./ZoneCheckTprCore.js";

function checkDimensions(player: Player) {
    const { Overworld, TheNether, TheEnd } = config.Tpr.Dimension;
    if (player.pos.dimid === 0 && Overworld === false) return false;
    if (player.pos.dimid === 1 && TheNether === false) return false;
    if (player.pos.dimid === 2 && TheEnd === false) return false;
    return true;
}

export function prepareTpr(player: Player) {
    if (!checkDimensions(player)) {
        sendMessage(player, "随机传送在当前维度不可用！");
        return;
    }

    if (!money_Instance.deductPlayerMoney(player, config.Tpr.Money)) return;

    sendMessage(player, "正在准备传送所需的数据，请稍候...");

    const random = tprRandomPos();
    const targetPos = new IntPos(random.x, 500, random.z, player.pos.dimid);

    const forPosInfo = {
        startingValue: 301,
        endValue: -64,
        stopValue: -63,
    };
    if (player.pos.dimid === 1) {
        forPosInfo.startingValue = 100; // neither
        forPosInfo.endValue = 0;
        forPosInfo.stopValue = 10;
    }

    tprAwaitChunkLoad(
        player,
        targetPos,
        forPosInfo,
        config.Tpr.UseZoneCheckV3API && ll.hasExported("ZoneCheckV3", "findPos") ? tprZoneCheckCore : legacyTprCore,
    );
}
