// LiteLoader-AIDS automatic generated
/// <reference path="c:\Users\Administrator\Documents\aids/dts/HelperLib-master/src/index.d.ts"/> 

class Forms {
    
}

class Func {
    /**
     * 批量发送侧边栏
     * @param {Array} player 玩家对象 [pl, pl, pl, ...]
     * @param {String} title 标题
     * @param {Object} data 内容
     * @returns 
     */
    static sendPlayerSidebar(player = [], title = '', data = null) {
        if (player.length == 0) {
            throw new Error('player参数为空！');
        }
        if (data == null) {
            throw new Error('data参数为空！');
        }
        player.forEach(pl => {
            pl.setSidebar(title, data);
        })
        return true;
    }
}

