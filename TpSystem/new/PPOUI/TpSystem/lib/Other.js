import { PLUGIN_INFO, Gm_Tell } from "../lib/cache.js";

export class Other {
    /**
     * Dimid转中文维度
     * @param {Number} dimension Dimid
     * @returns 
     */
    static DimidToDimension(dimension) {
        switch (dimension) {
            case 0: return '主世界';
            case 1: return '地狱';
            case 2: return '末地';
            default: return '未知';
        }
    }
    /**
     * 位随机ID
     * @returns ID
     */
    static RandomID(num = 16, char = 'QWERTYUIOPASDFGHJKLZXCVBNM') {
        let str = '';
        for (let i = 0; i < num; i++) {
            let index = Math.floor(Math.random() * char.length);
            str += char[index];
        }
        return str;
    }
    /**
     * 获取所有在线玩家名
     * @returns Array[Name, ...]
     */
    static GetOnlinePlayers() {
        let OnlinePlayers = [];
        mc.getOnlinePlayers().forEach(pl => {
            if (pl.isSimulatedPlayer()) return; // 去除模拟玩家
            OnlinePlayers.push(pl.realName);
        })
        return OnlinePlayers;
    }
    /**
     * 按钮表单
     * @returns 
     */
    static SimpleForm() {
        const fm = mc.newSimpleForm(); //懒得构建表达时加标题
        fm.setTitle(PLUGIN_INFO.Introduce);
        fm.setContent(`· 选择一个操作`);
        return fm;
    }
    /**
     * 自定义表单
     * @returns 
     */
    static CustomForm() {
        const fm = mc.newCustomForm();
        fm.setTitle(PLUGIN_INFO.Introduce);
        return fm;
    }
    /**
     * 放弃表单
     * @param {Object} pl 玩家对象
     */
    static CloseTell(pl) {
        pl.tell(Gm_Tell + `表单已放弃`);
    }
}
