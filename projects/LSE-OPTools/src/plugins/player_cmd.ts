import { gmTell, pluginInformation } from "../utils/GlobalVars.js";
import { tr } from "../utils/i18n.js";

export function playerCmd_UI(player: Player) {
    const allPlayers = mc.getOnlinePlayers().filter((pl) => !pl.isSimulatedPlayer());
    const fm = mc.newCustomForm();
    fm.setTitle(tr("plugins.playerCmd_UI.formTitle", { 0: pluginInformation.name }));
    fm.addInput(tr("plugins.playerCmd_UI.inputBox"), "String");
    fm.addDropdown(
        tr("plugins.playerCmd_UI.dropdownBox"),
        allPlayers.map((pl) => pl.realName),
    );
    player.sendForm(fm, (player2, data) => {
        if (data == null) return player2.tell(gmTell + tr("formClose"));
        allPlayers[data[1]].runcmd(data[0])
            ? player2.tell(gmTell + tr("plugins.playerCmd_UI.success"))
            : player2.tell(gmTell + tr("plugins.playerCmd_UI.fail"));
    });
}
