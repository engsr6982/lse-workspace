import { ChooseTPAForm } from "./ChooseTPAType.js";
/**
 * 概述：玩家要发出tpa时，插件会向此处传入一个玩家对象
 * 要求马上发起tpa表单
 * @param {Player} player 发起tpa的玩家
 */
export function TPAEntrance(player: Player) {
    //发出一个表单，让玩家选择tpa的种类
    const fm = new ChooseTPAForm(player);
    fm.send();
}
