import { gmTell, pluginInformation } from "../utils/GlobalVars.js";
import { tr } from "../utils/i18n.js";

export function changeTime(player: Player) {
    const sliderItem = Array.of(
        tr("plugins.changeTime.sliderItem.0"),
        tr("plugins.changeTime.sliderItem.1"),
        tr("plugins.changeTime.sliderItem.2"),
        tr("plugins.changeTime.sliderItem.3"),
        tr("plugins.changeTime.sliderItem.4"),
        tr("plugins.changeTime.sliderItem.5"),
    );
    const fm = mc.newCustomForm();
    fm.setTitle(tr("plugins.changeTime.formTitle", { 0: pluginInformation.name }));
    fm.addLabel(tr("plugins.changeTime.content"));
    fm.addStepSlider(tr("plugins.changeTime.sliderText"), sliderItem);
    player.sendForm(fm, (player2, data) => {
        if (data == null) return player2.tell(gmTell + tr("formClose"));
        const timeMap = {
            0: "day",
            1: "noon",
            2: "sunset",
            3: "night",
            4: "midnight",
            5: "sunrise",
        };
        // @ts-ignore
        mc.runcmd(`time set ${timeMap[data[1]]}`)
            ? player2.tell(gmTell + tr("plugins.changeTime.success", sliderItem[data[1]]))
            : player2.tell(gmTell + tr("plugins.changeTime.fail", sliderItem[data[0]]));
    });
}
