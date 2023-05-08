import { Message } from "../lib/Message.js";

/**
 * 表单类
 */
export class Forms {
    static Team(player, team_4 = false) {
        if (!player) {
            throw new Error('player is ' + player);
        }
        const Team = ['红队', '蓝队', '黄队', '绿队'];
        const fm = mc.newSimpleForm()
        fm.setTitle('§e选择队伍');
        fm.setContent(`选择并加入一个队伍`);
        fm.addButton(`【${Team[0]}】`);
        fm.addButton(`【${Team[1]}】`);
        if (team_4) {
            fm.addButton(`【${Team[2]}】`);
            fm.addButton(`【${Team[3]}】`);
        }
        player.sendForm(fm, (player, id) => {
            if (!player) {
                return Message.sendMessage(player);
            }
            player.addTag(Team[id]);
            Message.sendMessage(player, '你已加入' + Team[id]);
        })
    }
}
