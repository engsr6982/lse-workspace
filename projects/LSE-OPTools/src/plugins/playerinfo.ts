import { gmTell, pluginInformation } from "../utils/GlobalVars.js";
import { tr } from "../utils/i18n.js";

export function playerInfo_UI(player: Player) {
    const allPlayers = mc.getOnlinePlayers().filter((pl) => !pl.isSimulatedPlayer());
    const fm = mc.newCustomForm();
    fm.setTitle(tr("plugins.playerInfo_UI.formTitle", { 0: pluginInformation.name }));
    fm.addDropdown(
        tr("plugins.playerInfo_UI.dropdownBox"),
        allPlayers.map((pl) => pl.realName),
    );
    player.sendForm(fm, (pl, dt) => {
        if (dt == null) return pl.tell(gmTell + tr("formClose"));
        level_1(pl, allPlayers[dt[0]]);
    });
}

function level_1(player: Player, targetPlayer: Player) {
    const dv = targetPlayer.getDevice();
    const fm = mc.newCustomForm();
    fm.setTitle(tr("plugins.playerInfo_UI.formTitle", { 0: pluginInformation.name }));
    fm.addLabel(
        tr("plugins.playerInfo_UI.information", {
            name: targetPlayer.name,
            realname: targetPlayer.realName,
            xuid: targetPlayer.xuid,
            uuid: targetPlayer.uuid,
            pos: targetPlayer.pos,
            deathpos: targetPlayer.lastDeathPos,
            ip: dv.ip,
            ping: dv.lastPing,
            loss: dv.lastPacketLoss,
            os: dv.os,
            avgping: dv.avgPing,
            avgloss: dv.avgPacketLoss,
            id: dv.clientId,
        }),
    );
    player.sendForm(fm, (pl /* dt */) => {
        pl.tell(gmTell + tr("formClose"));
    });
}
