import { gmTell, pluginInformation } from "../utils/GlobalVars.js";
import { tr } from "../utils/i18n.js";

export function playerTalk_UI(player: Player) {
    const allPlayers = mc.getOnlinePlayers().filter((pl) => !pl.isSimulatedPlayer());
    const fm = mc.newCustomForm();
    fm.setTitle(tr("plugins.playerTalk_UI.formTitle", { 0: pluginInformation.name }));
    fm.addInput(tr("plugins.playerTalk_UI.inputBox"), "String");
    fm.addDropdown(
        tr("plugins.playerTalk_UI.dropdownBox"),
        allPlayers.map((pl) => pl.realName),
    );
    player.sendForm(fm, (pl, data) => {
        if (data == null) return pl.tell(gmTell + tr("formClose"));
        allPlayers[data[1]].talkAs(data[0])
            ? pl.tell(gmTell + tr("plugins.playerTalk_UI.success"))
            : pl.tell(gmTell + tr("plugins.playerTalk_UI.fail"));
    });
}
