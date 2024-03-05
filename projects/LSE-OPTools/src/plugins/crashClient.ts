import { gmTell, pluginInformation } from "../utils/GlobalVars.js";
import { tr } from "../utils/i18n.js";

export function crashClient_UI(player: Player) {
    const allPlayers = mc.getOnlinePlayers().filter((pl) => !pl.isSimulatedPlayer());
    const fm = mc.newCustomForm();
    fm.setTitle(tr("plugins.crashClient_UI.formTitle", { 0: pluginInformation.name }));
    fm.addLabel(tr("plugins.crashClient_UI.content"));
    allPlayers.forEach((pl) => {
        pl.isSimulatedPlayer() ? null : fm.addSwitch(pl.realName, false);
    });
    player.sendForm(fm, (player2, data: Array<boolean>) => {
        if (data == null) return player2.tell(gmTell + tr("formClose"));
        data.shift();
        for (let i = 0; i < data.length; i++) {
            data[i] ? allPlayers[i].crash() : null;
        }
        player2.tell(gmTell + tr("plugins.crashClient_UI.success"));
    });
}
