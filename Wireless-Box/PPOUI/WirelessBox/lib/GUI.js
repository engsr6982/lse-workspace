// LiteLoader-AIDS automatic generated
/// <reference path="c:\Users\Administrator\Documents\aids/dts/HelperLib-master/src/index.d.ts"/> 

import { PLUGIN_INFO, gmTell } from "./cache.js";
import { boxCore } from "./core.js";
import { onWirelessAddBox, onWirelessDeleteBox, onWirelessEditBox } from "./event.js";



class MainForm {
    constructor() {

    }
    // 私有方法
    simpleForm() {
        const fm = mc.newSimpleForm();
        fm.setTitle(PLUGIN_INFO.Name);
        fm.setContent(`选择一个操作`);
        return fm;
    }
    customForm() {
        const fm = mc.newCustomForm();
        fm.setTitle(PLUGIN_INFO.Name);
        return fm;
    }
    tell(player, msg = "表单已放弃") {
        return player.tell(`${gmTell}${msg}`);
    }

    // 公共方法

    /**
     * 主入口
     * @param {Player} player 
     */
    index(player) {
        const fm = this.simpleForm();
        fm.addButton(`添加箱子`, "");
        fm.addButton(`打开箱子`, "");
        fm.addButton(`编辑箱子`, "");
        fm.addButton(`删除箱子`, "");
        const thiz = this;
        player.sendForm(fm, (pl, id) => {
            switch (id) {
                case 0:
                    thiz.addBox(pl);
                    break;
                case 1:
                    thiz.openBox(pl);
                    break;
                case 2:
                    thiz.editBox(pl);
                    break;
                case 3:
                    thiz.deleteBox(pl);
                    break;
                default:
                    thiz.tell(pl);
            }
        });
    }

    /**
     * 添加箱子
     * @param {Player} player 
     */
    addBox(player) {
        if (!player.getExtraData("bindBoxPos")) {
            // 玩家还没有选择要绑定的箱子的位置
            if (!player.getExtraData("isAddBox")) {
                // 玩家还没有开始添加箱子
                player.setExtraData("isAddBox", true);
                this.tell(player, "请潜行手持木剑点击目标箱子方块");
                return;
            } else {
                // 玩家已经开始添加箱子但还没有选择要绑定的箱子的位置
                this.tell(player, "请潜行手持木剑点击目标箱子方块");
                return;
            }
        } else {
            // 玩家已经选择了要绑定的箱子位置
            // 后续的代码只需要使用 bindBoxPos
            const BindBoxPos = player.getExtraData("bindBoxPos");
            player.delExtraData("bindBoxPos");// 清除绑定数据
            const fm = this.customForm();
            fm.addLabel(`已选中箱子 坐标 ${BindBoxPos}`);
            fm.addInput("请输入箱子别名", "String");
            const thiz = this;
            player.sendForm(fm, (pl, dt) => {
                if (dt == null) return thiz.tell(pl);
                if (onWirelessAddBox.exec("onWirelessAddBox", {
                    player: pl,
                    box: BindBoxPos,
                    name: dt[1] || "default"
                }) == false) return;// 判断是否拦截事件
                boxCore.addBox(pl.xuid, BindBoxPos, dt[1] || "default") ? form.tell(pl, "添加成功！") : form.tell(pl, "添加失败");
            });
        }
    }

    _dimidToString(num) {
        const dimid = {
            0: "主世界",
            1: "地狱",
            2: "末地"
        };
        return dimid[num];
    }

    _posToString(pos) {
        return `${this._dimidToString(pos.dimid)} (${pos.x},${pos.y},${pos.z})`;
    }

    /**
     * 选择箱子
     * @param {Player} player 
     * @param {Function} callback 
     */
    _selectBox(player, callback) {
        // 列出所有箱子，选中箱子然后进行操作
        const fm = this.simpleForm();
        fm.addButton(`返回上一页`);
        const all = boxCore.getPlayerAllBox(player.xuid);
        all.forEach(i => {
            fm.addButton(`${i.Name}\n${this._posToString(i.Pos)}`);
        });
        const thiz = this;
        player.sendForm(fm, (pl, id) => {
            if (id == null) return thiz.tell(pl);
            if (id == 0) {
                return thiz.index(pl);
            }
            id = id - 1;
            callback(id);
        });
    }

    /**
     * 选择槽位
     * @param {Player} player 
     * @param {Container} container 
     * @param {Function} callback 选中的槽位 容器对象
     * @param {this} thiz
     */
    _selectSlot(player, container, callback, thiz) {
        const all_items = container.getAllItems().length;
        const fm = this.simpleForm();
        fm.setContent(`选择一个槽位，当前箱子共有[${all_items}]个槽位`);
        fm.addButton(`返回上一页`, "");
        for (let i = 0; i < container.size; i++) {
            fm.addButton(`槽位[${i}]: ${container.getItem(i).name || "Null"}`);
        }
        player.sendForm(fm, (pl, id) => {
            if (id == null) return thiz.tell(player);
            if (id == 0) return thiz.openBox(player);
            id = id - 1;
            callback(id, player, container, thiz);
        });
    }

    /**
     * 
     * @param {Item} item 
     */
    itemObjectToString(item) {
        return `
        名称:${item.name} 
        数量:${item.count}
        耐久:${item.damage}/${item.maxDamage}
        `.trim();
    }

    /**
     * 操作槽位
     * @param {Number} id 
     * @param {Player} player 
     * @param {Container} container 
     * @param {this} thiz
     */
    operationSlot(id, player, container, thiz) {
        const fm = thiz.simpleForm();
        const item = container.getItem(id);
        fm.setContent(`当前已选中槽位[${id}], 槽位信息: \n${thiz.itemObjectToString(item)}`);
        fm.addButton("放入物品");
        fm.addButton("取出物品");
        fm.addButton("返回上一页");
        player.sendForm(fm, (pl, id2) => {
            switch (id2) {
                case 0:// 放入
                    pl.sendSimpleForm(PLUGIN_INFO.Name, "请选择从哪放入物品？", ["当前手持物品", "背包", "返回上一页"], ["", "", ""], (pl2, id3) => {
                        switch (id3) {
                            case 0:// hand
                                const hand = pl2.getHand();
                                if (hand.isNull()) return thiz.tell(player, "当前物品对象为空");
                                container.addItem(hand) && hand.setNull() && pl2.refreshItems() ? thiz.tell(pl2, "操作成功") : thiz.tell(pl2, "操作失败");
                                break;
                            case 1:// bag
                                const pl_container = pl2.getInventory();
                                thiz._selectSlot(pl2, pl_container, (id4, pl3, container2, thiz2) => {
                                    const pl_item = pl_container.getItem(id4);
                                    if (pl_item.isNull()) return thiz.tell(player, "当前物品对象为空");
                                    container.addItem(pl_item) && pl_container.getItem(id4).setNull() && pl3.refreshItems() ? thiz.tell(pl2, "操作成功") : thiz.tell(pl2, "操作失败");
                                }, thiz);
                                break;
                            case 2:
                                thiz._selectSlot(pl2, container, thiz.operationSlot, thiz);
                                break;
                            default:
                                thiz.tell(pl2);
                        }
                    });
                    break;
                case 1:// 取出
                    if (item.isNull()) return thiz.tell(player, "当前物品对象为空");
                    player.giveItem(item) && container.removeItem(id, item.count) ? thiz.tell(player, "操作成功") : thiz.tell(player, "操作失败");
                    break;
                case 2:
                    thiz._selectSlot(player, container, thiz.operationSlot, thiz);
                    break;
                default:
                    thiz.tell(pl);
            }
        });
    }

    /**
     * 打开箱子
     * @param {Player} player 
     */
    openBox(player) {
        const thiz = this;
        this._selectBox(player, id => {
            const pos = boxCore.getPlayerAllBox(player.xuid)[id].Pos;
            const blockobj = mc.getBlock(new IntPos(pos.x, pos.y, pos.z, pos.dimid));
            if (blockobj == null || blockobj.isAir || !blockobj.hasContainer()) return thiz.tell(player, "操作箱子失败！箱子所在区块未加载或箱子已被破坏");
            // 选择槽位进行操作
            thiz._selectSlot(player, blockobj.getContainer(), thiz.operationSlot, thiz);
        });
    }

    /**
     * 编辑箱子
     * @param {Player} player 
     */
    editBox(player) {
        // 编辑箱子名称
        const thiz = this;
        this._selectBox(player, id => {
            const fm = thiz.customForm();
            const all = boxCore.getPlayerAllBox(player.xuid);
            fm.addLabel(`已选中箱子 > ${thiz._posToString(all[id].Pos)}`);
            fm.addInput('输入新名称', "String", all[id].Name);
            player.sendForm(fm, (pl, dt) => {
                if (dt == null) return thiz.tell(pl);
                if (onWirelessEditBox.exec("onWirelessEditBox", {
                    player: pl,
                    oldName: all[id].Name,
                    newName: dt[1] || "default",
                    index: id,
                    box: all[id]
                }) == false) return;
                all[id].Name = dt[1] || "default";
                boxCore.saveData(all) ? thiz.tell(pl, "操作成功") : thiz.tell(pl, "操作失败");
            });
        });
    }

    /**
     * 删除箱子
     * @param {Player} player 
     */
    deleteBox(player) {
        const thiz = this;
        this._selectBox(player, id => {
            const tmp = boxCore.getPlayerAllBox(player.xuid);
            player.sendModalForm(
                PLUGIN_INFO.Name,
                `是否确认删除箱子 ${thiz._posToString(tmp[id].Pos)}`,
                "确认", "返回",
                (pl, res) => {
                    switch (res) {
                        case true:
                            if (onWirelessDeleteBox.exec("onWirelessDeleteBox", {
                                player: pl,
                                index: id,
                                box: tmp[id]
                            }) == false) return;
                            tmp.splice(id, 1);
                            boxCore.saveData(tmp) ? thiz.tell(pl, "操作成功") : thiz.tell(pl, "操作失败");
                            break;
                        case false:
                            thiz.index(pl);
                            break;
                        default:
                            thiz.tell(pl);
                    }
                }
            );
        });
    }
}

export const form = new MainForm();