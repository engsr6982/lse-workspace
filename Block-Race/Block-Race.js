// LiteLoader-AIDS automatic generated
/// <reference path="c:\Users\Administrator\Documents\aids/dts/HelperLib-master/src/index.d.ts"/> 

class Forms {
    
}

class Message {
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
            pl.tell(data, 5);
        })
        return true;
    }
}

