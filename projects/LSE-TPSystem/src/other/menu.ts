import { SimpleForms } from "../../../LSE-Modules/src/uform/SimpleForms.js";
import { pluginInformation } from "../utils/GlobalVars.js";
import { sendCloseFormTip } from "../utils/util.js";

export function menu(player: Player, formJSON: Array<formJSON_Structure_Item>) {
    // const fm = mc.newSimpleForm();
    // fm.setTitle(pluginInformation.introduce);
    // fm.setContent("· 选择一个操作");
    // // Build the form
    // formJSON.forEach((i) => {
    //     fm.addButton(i.name || "", i.image || undefined);
    // });
    // // send
    // player.sendForm(fm, (pl, id: number | null | undefined) => {
    //     if (!id) return;
    //     const json = formJSON[id];
    //     switch (json.type) {
    //         case "cmd":
    //             return pl.runcmd(json.open as string);
    //         case "subform":
    //             return menu(pl, json.open as Array<formJSON_Item>);
    //     }
    // });
    const fm = new SimpleForms(pluginInformation.introduce);
    fm.content = "· 选择一个操作";
    formJSON.forEach((i) => {
        fm.addButton(
            i.name || "",
            () => {
                i.type == "cmd" ? player.runcmd(i.open as string) : menu(player, i.open as Array<formJSON_Structure_Item>);
            },
            i.image || undefined,
        );
    });

    fm.close = () => {
        sendCloseFormTip(player);
    };
    fm.send(player);
}
