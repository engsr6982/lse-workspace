import { viewSelection } from "../form/viewSelection.js";
import { gmTell, pluginInformation } from "../utils/GlobalVars.js";
import { tr } from "../utils/i18n.js";

export function kick_UI(player: Player): void {
    viewSelection(player, (view) => {
        if (view) {
            viewClass.defaultView(player);
        } else {
            viewClass.batchView(player);
        }
    });
}

class viewClass {
    static defaultView(player: Player) {
        // 获取在线玩家，并过滤模拟玩家
        const allPlayers = mc.getOnlinePlayers().filter((pl) => !pl.isSimulatedPlayer());
        const fm = mc.newCustomForm();
        fm.setTitle(tr("plugins.kick_UI.formTitle", { 0: pluginInformation.name }));
        fm.addDropdown(
            tr("plugins.kick_UI.dropdownBox"),
            allPlayers.map((pl) => pl.realName),
        );
        fm.addInput(tr("plugins.kick_UI.inputBox"), "String");
        player.sendForm(fm, (player2: Player, data: Array<number | string>) => {
            if (data == null) return player2.tell(gmTell + tr("formClose"));
            allPlayers[data[0] as number].kick(data[1] as string)
                ? player2.tell(gmTell + tr("kick.succes.ok", allPlayers[data[0] as number].realName))
                : player2.tell(gmTell + tr("kick.succes.err", allPlayers[data[0] as number].realName));
        });
    }
    static batchView(player: Player) {
        const allPlayers = mc.getOnlinePlayers().filter((pl) => !pl.isSimulatedPlayer());
        const fm = mc.newCustomForm();
        fm.setTitle(tr("plugins.kick_UI.formTitle", { 0: pluginInformation.name }));
        fm.addInput(tr("plugins.kick_UI.inputBox"), "String");
        // 遍历添加按钮
        allPlayers.forEach((pl) => {
            fm.addSwitch(pl.realName, false);
        });
        player.sendForm(fm, (player2: Player, data: Array<string | boolean>) => {
            if (data == null) return player2.tell(gmTell + tr("formClose"));
            const input = data[0]; // 缓存输入内容
            data.shift(); // 去除第一位输入框
            for (let i = 0; i < data.length; i++) {
                logger.debug(`for: ${i}  input: ${input}  player: ${allPlayers[i]}`);
                if (data[i]) {
                    allPlayers[i].kick(input as string)
                        ? player2.tell(gmTell + tr("plugins.kick_UI.succes", allPlayers[i].realName))
                        : player2.tell(gmTell + tr("plugins.kick_UI.fail", allPlayers[i].realName));
                }
            }
        });
    }
}
