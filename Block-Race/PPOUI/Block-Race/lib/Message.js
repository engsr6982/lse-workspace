import {PLUGIN_INFO} from "../lib/Cache.js";

/**
 * 消息类
 */
export class Message {
    
    /**
     * 广播任务完成消息
     * @param {String} team 队伍
     * @param {String} playername 玩家名
     * @param {String} difficulty 难度
     * @param {String} taskname 任务名
     */
    static BroadcastTaskMessage(team, playername, difficulty, taskname) {
        mc.broadcast(`[√] ${team}队员 [${playername}] 完成了目标 [${difficulty} | ${taskname}]`);
    }
    /**
     * 发送消息
     * @param {Object} player 玩家
     * @param {String} message [消息]
     */
    static sendMessage(player, message = `表单已放弃！`) {
        let header = `[${PLUGIN_INFO.name}]`;
        if (PLUGIN_INFO.debugger) {
            header = `[${PLUGIN_INFO.name} Debug]`;
        }
        player.tell(`${header} ${message}`);
    }
    /**
     * 批量发送侧边栏
     * @param {Array} player 玩家对象 [pl, pl, pl, ...]
     * @param {String} title 标题
     * @param {Object} data 内容
     * @returns 
     */
    static sendPlayerSidebar(player = [], title = '', data = null) {
        if (player.length == 0) {
            throw new Error(`Player parameter is empty! The length of player is ${player.length}.`);
        }
        if (data == null) {
            throw new Error('Data is null.');
        }
        player.forEach(pl => {
            pl.setSidebar(title, data);
        })
        return true;
    }
    /**
     * 批量发送物品栏上方消息
     * @param {Array} player 玩家对象 [pl, pl, ...]
     * @param {String} message 消息
     * @returns 
     */
    static sendItemMessage(player = [], message) {
        if (player.length == 0) {
            throw new Error(`Player parameter is empty! The length of player is ${player.length}.`);
        }
        if (message == null) {
            throw new Error(`message is null`);
        }
        player.forEach(pl => {
            pl.tell(message, 5);
        })
        return true;
    }
}
