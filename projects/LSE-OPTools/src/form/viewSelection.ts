import { gmTell, pluginInformation } from "../utils/GlobalVars.js";
import { tr } from "../utils/i18n.js";

/**
 * 视图选择
 * @param player 玩家对象
 * @param callback 选择的视图 true默认视图 false批量视图
 */
export function viewSelection(player: Player, callback: (view: boolean) => void): void {
    // player.sendModalForm(tr("form.viewSelection.formTitle", { 0: pluginInformation.name }), tr("form.viewSelection.content"), tr("form.viewSelection.button1"), tr("form.viewSelection.button2"), (player2: Player, result: boolean | null) => {
    //     logger.debug(`viewSelection: ${result}`);
    //     if (result === null) return player2.tell(gmTell + tr("formClose"));
    //     callback(result);
    // });
    const fm = mc.newSimpleForm();
    fm.setTitle(tr("form.viewSelection.formTitle", { 0: pluginInformation.name }));
    fm.setContent(tr("form.viewSelection.content"));
    fm.addButton(tr("form.viewSelection.button1"));
    fm.addButton(tr("form.viewSelection.button2"));
    fm.addButton(tr("form.viewSelection.button3"));
    player.sendForm(fm, (player2: Player, id: number) => {
        if (id == null || id == 2) return player2.tell(gmTell + tr("formClose"));
        callback(id == 0 ? true : false);
    });
}
