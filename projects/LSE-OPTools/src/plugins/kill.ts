import { gmTell, pluginInformation } from "../utils/GlobalVars.js";
import { tr } from "../utils/i18n.js";

export function kill_UI(player: Player): void {
    const allPlayers = mc.getOnlinePlayers().filter((pl) => !pl.isSimulatedPlayer());
    const fm = mc.newCustomForm();
    fm.setTitle(tr("plugins.kill_UI.formTitle", { 0: pluginInformation.name }));
    fm.addLabel(tr("plugins.kill_UI.content"));
    allPlayers.forEach((pl) => {
        fm.addSwitch(pl.realName, false);
    });
    player.sendForm(fm, (player2, data: Array<boolean>) => {
        if (data == null) return player2.tell(gmTell + tr("formClose"));
        data.shift();
        for (let i = 0; i < data.length; i++) {
            if (data[i]) {
                allPlayers[i].kill()
                    ? player2.tell(gmTell + tr("plugins.kill_UI.success", { 0: allPlayers[i].realName }))
                    : player2.tell(gmTell + tr("plugins.kill_UI.fail", { 0: allPlayers[i].realName }));
            }
        }
    });
}
