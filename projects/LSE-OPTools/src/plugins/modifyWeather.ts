import { gmTell, pluginInformation } from "../utils/GlobalVars.js";
import { tr } from "../utils/i18n.js";

export function modifyWeather(player: Player) {
    const fm = mc.newCustomForm();
    fm.setTitle(tr("plugins.modifyWeather.formTitle", { 0: pluginInformation.name }));
    fm.addLabel(tr("plugins.modifyWeather.content"));

    const sliderItem = Array.of(
        tr("plugins.modifyWeather.sliderItem.0"),
        tr("plugins.modifyWeather.sliderItem.1"),
        tr("plugins.modifyWeather.sliderItem.2"),
    );
    fm.addStepSlider(tr("plugins.modifyWeather.sliderText"), sliderItem, 0);
    player.sendForm(fm, (player2, data: Array<null | number>) => {
        if (data == null) return player2.tell(gmTell + tr("formClose"));
        if (data[1] === 0) {
            mc.setWeather(1);
        }
        mc.setWeather(data[1] as 0 | 1 | 2)
            ? player2.tell(gmTell + tr("plugins.modifyWeather.success", sliderItem[data[1]]))
            : player2.tell(gmTell + tr("plugins.modifyWeather.fail", sliderItem[data[1]]));
    });
}
