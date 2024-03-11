import { FPManager } from "../FPManager/Manager.js";
import { instanceCache } from "../FPManager/instanceCache.js";
import { Gm_Tell, pluginInformation } from "../utils/GlobalVars.js";
import { _Perm_Object, perm } from "../Perm/index.js";

// 无权限
export function noPermissions(player) {
    return player.tell(Gm_Tell + `无权限`);
}
// 输入框为空
function input_Null(pl, msg = "输入框为空！") {
    return pl.tell(Gm_Tell + msg);
}
// 表单被关闭
function closeForm(pl) {
    return pl.tell(Gm_Tell + "表单已放弃!");
}

class GUIForm {
    constructor() {}

    // 私有方法

    customform() {
        const fm = mc.newCustomForm();
        fm.setTitle(pluginInformation.name);
        return fm;
    }
    simpleForm() {
        const fm = mc.newSimpleForm();
        fm.setTitle(pluginInformation.name);
        fm.setContent(`选择一个操作`);
        return fm;
    }

    // 公共方法

    /**
     * 入口
     * @param {Player} player
     */
    index(player) {
        const fm = this.simpleForm();
        fm.addButton("假人管理\n");
        fm.addButton("模拟操作\n");
        fm.addButton("假人操作\n");
        file.exists(`.\\plugins\\${pluginInformation.author}\\debug`) ? fm.addButton(`[管理]权限组GUI`) : null;
        const thiz = this;
        player.sendForm(fm, (pl, id) => {
            switch (id) {
                case 0:
                    thiz.dummyManagement(pl);
                    break;
                case 1:
                    thiz.simulatedOperation(pl);
                    break;
                case 2:
                    thiz.manipulatingDummies(pl);
                    break;
                case 3:
                    pl.runcmd("fp mgr");
                    break;
                default:
                    closeForm(pl);
                    break;
            }
        });
    }
    /**
     * 假人管理
     * @param {Player} player
     */
    dummyManagement(player) {
        const fm = this.simpleForm();
        fm.addButton("返回上一页", "textures/ui/icon_import");
        fm.addButton(`创建假人`, "textures/ui/color_plus");
        fm.addButton(`快速上下线`, "textures/ui/move");
        fm.addButton(`上线所有`, "textures/ui/flyingascend_pressed");
        fm.addButton(`下线所有`, "textures/ui/flyingdescend_pressed");
        fm.addButton(`下线假人`, "textures/ui/flyingdescend");
        fm.addButton(`编辑假人`, "textures/ui/icon_setting");
        fm.addButton(`删除假人`, "textures/ui/icon_trash");
        const thiz = this;
        player.sendForm(fm, (pl, id) => {
            switch (id) {
                case 0:
                    thiz.index(pl);
                    break;
                case 1:
                    thiz.creatingDummies(pl);
                    break;
                case 2:
                    thiz.dummyUpAndDownLine(pl);
                    break;
                case 3:
                    pl.runcmd(`fp onlineall`);
                    break;
                case 4:
                    pl.runcmd(`fp offlineall`);
                    break;
                case 5:
                    thiz.offlineDummy(pl);
                    break;
                case 6:
                    thiz.editDummy(pl);
                    break;
                case 7:
                    thiz.deleteDummy(pl);
                    break;
                default:
                    closeForm(pl);
                    break;
            }
        });
    }
    /**
     * 模拟操作
     * @param {Player} player
     */
    simulatedOperation(player) {
        const fm = this.simpleForm();
        fm.addButton("返回上一页", "textures/ui/icon_import");
        fm.addButton(`模拟朝向`, "textures/ui/icon_steve");
        fm.addButton(`模拟破坏`, "textures/ui/anvil_icon");
        fm.addButton(`模拟攻击`, "textures/ui/icon_recipe_equipment");
        fm.addButton(`模拟使用物品`, "textures/ui/icon_book_writable");
        fm.addButton(`关闭模拟操作`);
        const thiz = this;
        player.sendForm(fm, (pl, id) => {
            switch (id) {
                case 0:
                    thiz.index(pl);
                    break;
                case 1:
                    thiz.simulateOrientation(pl);
                    break;
                case 2:
                    thiz.simulatedDamage(pl);
                    break;
                case 3:
                    thiz.simulatedAttack(pl);
                    break;
                case 4:
                    thiz.simulateTheUseOfItems(pl);
                    break;
                case 5:
                    thiz.closeSimulationOperation(pl);
                    break;
                default:
                    closeForm(pl);
                    break;
            }
        });
    }
    /**
     * 操作假人
     * @param {Player} player
     */
    manipulatingDummies(player) {
        const fm = this.simpleForm();
        fm.addButton("返回上一页", "textures/ui/icon_import");
        fm.addButton(`假人传送`, "textures/ui/FriendsIcon");
        fm.addButton("假人背包");
        fm.addButton("假人说话");
        fm.addButton("假人执行命令");
        const thiz = this;
        player.sendForm(fm, (pl, id) => {
            switch (id) {
                case 0:
                    thiz.index(pl);
                    break;
                case 1:
                    thiz.dummyTransmission(pl);
                    break;
                case 2:
                    thiz.dummyBackpack(pl);
                    break;
                case 3:
                    thiz.dummySpeaking(pl);
                    break;
                case 4:
                    thiz.dummyCommand(pl);
                    break;
                default:
                    closeForm(pl);
                    break;
            }
        });
    }

    // 假人管理表单

    /**
     * 创建假人
     * @param {Player} player
     */
    creatingDummies(player) {
        const fm = this.customform();
        fm.addLabel("创建一个模拟玩家实例");
        fm.addInput("输入假人名称", "String"); // 1
        fm.addInput(
            "假人上线坐标(请输入整数，使用英文逗号隔开X,Y,Z)",
            "IntPos",
            `${player.blockPos.x},${player.blockPos.y},${player.blockPos.z}`,
        );
        fm.addDropdown("上线维度", ["主世界", "地狱", "末地"], player.pos.dimid);
        player.sendForm(fm, (pl, dt) => {
            if (dt == null) return closeForm(pl);
            if (!dt[1]) return input_Null(pl);
            const [x, y, z] = dt[2].split(",").map(Number);
            pl.runcmd(`fp create ${dt[1]} ${x} ${y} ${z} ${dt[3]}`);
        });
    }

    /**
     * 假人上下线
     * @param {Player} player
     */
    dummyUpAndDownLine(player) {
        const fm = this.customform();
        const fp = FPManager.getAllDummyInst().filter((p) => p.BindPlayer === player.realName);
        fp.forEach((i) => {
            fm.addSwitch(`假人: ${i.Name}\n状态: ${i._isOnline ? "在线" : "离线"}`, i._isOnline || false);
        });
        player.sendForm(fm, (pl, dt) => {
            if (dt == null) return closeForm(pl);
            for (let i = 0; i < dt.length; i++) {
                pl.runcmd(`fp ${dt[i] ? "online" : "offline"} ${fp[i].Name}`);
            }
        });
    }

    /**
     * 选择假人（复用）
     * @param {Player} player 玩家对象
     * @param {Function} back 上一页的函数
     * @param {Function} callback 回调函数 返回假人对象
     * @param {Boolean} online 过滤离线玩家
     */
    selectDummy(player, back, callback, online = true) {
        const fm = this.simpleForm();
        const fp = online
            ? FPManager.getOnlineDummy().filter((p) => p.BindPlayer == player.realName)
            : FPManager.getAllDummyInst().filter((p) => p.BindPlayer == player.realName);
        fm.addButton("返回上一页", "textures/ui/icon_import");
        fp.forEach((i) => {
            online ? fm.addButton(`假人: ${i.Name}`) : fm.addButton(`假人: ${i.Name}\n状态: ${i._isOnline ? "在线" : "离线"}`);
        });
        player.sendForm(fm, (pl, id) => {
            if (id == null) return closeForm(pl);
            if (id == 0) return back.call(this, pl); // 使用call方法改变back函数中this的指向
            id = id - 1;
            callback(fp[id]);
        });
    }

    /**
     * 下线假人
     * @param {Player} player
     */
    offlineDummy(player) {
        this.selectDummy(
            player,
            this.dummyManagement,
            (fp) => {
                player.runcmd(`fp offline ${fp.Name}`);
            },
            true,
        );
    }

    /**
     * 编辑假人
     * @param {Player} player
     */
    editDummy(player) {
        const thiz = this;
        this.selectDummy(player, this.dummyManagement, (fp) => {
            const fm = thiz.customform();
            fm.addSwitch("是否启用假人无敌", fp.isInvincible);
            fm.addSwitch("是否启用自动复活", fp.isAutoResurrection);
            fm.addSwitch("是否启用自动上线", fp.isAutoOnline);
            player.sendForm(fm, (pl, dt) => {
                if (dt == null) return closeForm(pl);
                pl.runcmd(`fp setfunc ${fp.Name} isinvincible ${dt[0]}`);
                pl.runcmd(`fp setfunc ${fp.Name} isautoresurrection ${dt[1]}`);
                pl.runcmd(`fp setfunc ${fp.Name} isautoonline ${dt[2]}`);
            });
        });
    }

    /**
     * 删除假人
     * @param {Player} player
     */
    deleteDummy(player) {
        this.selectDummy(
            player,
            this.dummyManagement,
            (fp) => {
                player.runcmd(`fp delete ${fp.Name}`);
            },
            false,
        );
    }

    // 模拟操作表单

    /**
     * 模拟朝向
     * @param {Player} player
     */
    simulateOrientation(player) {
        const thiz = this;
        this.selectDummy(
            player,
            this.simulatedOperation,
            (fp) => {
                const fm = thiz.customform();
                fm.addInput(
                    `朝向目标坐标(请输入整数，使用英文逗号隔开X,Y,Z)`,
                    "IntPos",
                    `${player.blockPos.x},${player.blockPos.y},${player.blockPos.z}`,
                );
                player.sendForm(fm, (pl, dt) => {
                    if (dt == null) return closeForm(pl);
                    if (!dt[0]) return input_Null(pl);
                    const [x, y, z] = dt[0].split(",").map(Number);
                    pl.runcmd(`fp lookpos ${fp.Name} ${x} ${y} ${z}`);
                });
            },
            true,
        );
    }

    /**
     * 模拟攻击
     * @param {Player} player
     */
    simulatedAttack(player) {
        const thiz = this;
        this.selectDummy(
            player,
            this.simulatedOperation,
            (fp) => {
                const fm = thiz.customform();
                fm.addInput(`[可选]要破坏的目标方块坐标\n(默认为视线上方块, 使用英文逗号隔开X,Y,Z)`, "IntPos");
                fm.addInput(`[可选]执行周期,单位：毫秒\n(多久攻击一次)`, "Number");
                player.sendForm(fm, (pl, dt) => {
                    if (dt == null) return closeForm(pl);
                    if (dt[0] != "") {
                        const [x, y, z] = dt[0].split(",").map(Number);
                        pl.runcmd(`fp lookpos ${fp.Name} ${x} ${y} ${z}`);
                    }
                    pl.runcmd(`fp operation attack ${fp.Name} ${dt[1] || ""}`);
                });
            },
            true,
        );
    }

    /**
     * 模拟破坏
     * @param {Player} player
     */
    simulatedDamage(player) {
        const thiz = this;
        this.selectDummy(
            player,
            this.simulatedOperation,
            (fp) => {
                const fm = thiz.customform();
                fm.addInput(`[可选]要破坏的目标方块坐标\n(默认为视线上方块, 使用英文逗号隔开X,Y,Z)`, "IntPos");
                fm.addInput(`[可选]执行周期,单位：毫秒\n(多久破坏一次)`, "Number");
                player.sendForm(fm, (pl, dt) => {
                    if (dt == null) return closeForm(pl);
                    if (dt[0] != "") {
                        const [x, y, z] = dt[0].split(",").map(Number);
                        pl.runcmd(`fp lookpos ${fp.Name} ${x} ${y} ${z}`);
                    }
                    pl.runcmd(`fp operation destroy ${fp.Name} ${dt[1] || ""}`);
                });
            },
            true,
        );
    }

    /**
     * 模拟使用物品
     * @param {Player} player
     */
    simulateTheUseOfItems(player) {
        const thiz = this;
        this.selectDummy(
            player,
            this.simulatedOperation,
            (fp) => {
                const fm = thiz.customform();
                const container = mc.getPlayer(fp.Name).getInventory();
                fm.addDropdown(
                    `[可选]使用的物品栏物品\n(默认为当前手持物品)`,
                    Array.from(
                        { length: 9 },
                        (_, i) => `槽位[${i}]: ` + (container.getItem(i).name != "" ? container.getItem(i).name : "Null"),
                    ),
                );
                fm.addInput(`[可选]要破坏的目标方块坐标\n(默认为视线上方块, 使用英文逗号隔开X,Y,Z)`, "IntPos");
                fm.addInput(`[可选]执行周期,单位：毫秒\n(多久右键一次)`, "Number");
                player.sendForm(fm, (pl, dt) => {
                    if (dt == null) return closeForm(pl);
                    if (dt[1] != "") {
                        const [x, y, z] = dt[1].split(",").map(Number);
                        pl.runcmd(`fp lookpos ${fp.Name} ${x} ${y} ${z}`);
                    }
                    pl.runcmd(`fp operation item ${fp.Name} ${dt[2] == "" ? fp._CycleTime : dt[2]} ${dt[0]}`);
                });
            },
            true,
        );
    }

    /**
     * 关闭模拟操作(批量)
     * @param {Player} player
     */
    closeSimulationOperation(player) {
        const fm = this.simpleForm();
        const fp = FPManager.getOnlineDummy().filter((p) => p.BindPlayer == player.realName && p.TimeID != null);
        fp.forEach((p) => {
            fm.addButton(
                `假人: ${p.Name}\n操作类型: ${
                    p._OperationType == "attack"
                        ? "模拟攻击"
                        : p._OperationType == "destroy"
                          ? "模拟破坏"
                          : p._OperationType == "item"
                            ? "模拟使用物品"
                            : "错误！(未知类别)"
                }`,
            );
        });
        player.sendForm(fm, (pl, id) => {
            if (id == null) return closeForm(pl);
            pl.runcmd(`fp offoperation ${fp[id].Name}`);
        });
    }

    // 操作假人表单

    /**
     * 假人传送
     * @param {Player} player
     */
    dummyTransmission(player) {
        this.selectDummy(
            player,
            this.manipulatingDummies,
            (fp) => {
                player.runcmd(`fp tp ${fp.Name} ${player.blockPos.x} ${player.blockPos.y} ${player.blockPos.z} ${player.blockPos.dimid}`);
            },
            true,
        );
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////

    /**
     * 假人背包
     * @param {Player} player
     */
    dummyBackpack(player) {
        if (!perm.hasUserPerm(player.xuid, _Perm_Object.DummyBackpack.value)) return noPermissions(player);
        this.selectDummy(
            player,
            this.manipulatingDummies,
            (fp) => {
                this._selectAction(player, fp);
            },
            true,
        );
    }
    /**
     * @param {Player} player
     * @param {import("../FPManager/tab.js").T_FP_INFO} fp
     */
    _selectAction(player, fp) {
        const fm = this.simpleForm();
        fm.setContent(`当前正在操作假人: ${fp.Name}`);
        fm.addButton(`放入物品`);
        fm.addButton(`取出物品`);
        fm.addButton(`返回上一页`);
        player.sendForm(fm, (pl, id) => {
            switch (id) {
                case 0:
                    this.insert(player, fp);
                    break;
                case 1:
                    this._selectSlot(
                        player,
                        instanceCache.get(fp.Name).getPlayer().getInventory(),
                        (item) => {
                            pl.giveItem(item.item);
                            instanceCache.get(fp.Name).getPlayer().refreshItems();
                        },
                        fp,
                        this._selectAction,
                    );
                    break;
                case 2:
                    this.dummyBackpack(player);
                    break;
                default:
                    closeForm(pl);
            }
        });
    }
    /**
     * @param {Player} player
     * @param {import("../FPManager/tab.js").T_FP_INFO} fp
     */
    insert(player, fp) {
        const fm = this.simpleForm();
        fm.setContent(`当前正在操作假人: ${fp.Name}\n 请选择从哪放入物品到假人背包\n  `);
        fm.addButton(`放入当前手持物品`);
        fm.addButton(`从背包选择物品`);
        fm.addButton(`返回上一页`);
        player.sendForm(fm, (pl, id) => {
            switch (id) {
                case 0:
                    if (pl.getHand().isNull()) return pl.tell(Gm_Tell + `当前未手持任何物品！`);
                    if (instanceCache.get(fp.Name).getPlayer().giveItem(pl.getHand())) {
                        pl.getHand().setNull();
                        pl.refreshItems();
                    }
                    break;
                case 1:
                    this._selectSlot(
                        pl,
                        pl.getInventory(),
                        (item) => {
                            instanceCache.get(fp.Name).getPlayer().giveItem(item.item);
                            pl.refreshItems();
                        },
                        fp,
                        this.insert,
                    );
                    break;
                case 2:
                    this._selectAction(pl, fp);
                    break;
                default:
                    closeForm(player);
            }
        });
    }

    /**
     * 选择槽位
     * @param {Player} player
     * @param {Container} container
     * @param {Function} item 选中的槽位和对应物品对象
     */
    _selectSlot(player, container, item, fp, back) {
        const fm = this.simpleForm();
        fm.setContent(`选择一个槽位，共[${container.size}]个槽位`);
        fm.addButton(`返回上一页`, "");
        let count = -1;
        const all_item = container
            .getAllItems()
            .map((it) => {
                return { item: it.isNull() ? null : it, index: (count += 1) };
            })
            .filter((it) => it.item);
        all_item.forEach((i) => {
            fm.addButton(`[${i.index}]: ${i.item.name}\n数量: ${i.item.count}`);
        });
        player.sendForm(fm, (pl, id) => {
            if (id == null) return closeForm(player);
            if (id == 0) return back.call(this, player, fp);
            id = id - 1;
            item(all_item[id]);
        });
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////

    /**
     * 假人说话
     * @param {Player} player
     */
    dummySpeaking(player) {
        const thiz = this;
        this.selectDummy(
            player,
            this.manipulatingDummies,
            (fp) => {
                const fm = thiz.customform();
                fm.addInput("输入要说的内容", "String");
                player.sendForm(fm, (pl, dt) => {
                    if (dt == null) return closeForm(pl);
                    if (!dt[0]) return input_Null(pl);
                    pl.runcmd(`fp talk ${fp.Name} "${dt[0]}"`);
                });
            },
            true,
        );
    }

    /**
     * 假人执行命令
     * @param {Player} player
     */
    dummyCommand(player) {
        const thiz = this;
        this.selectDummy(
            player,
            this.manipulatingDummies,
            (fp) => {
                const fm = thiz.customform();
                fm.addInput("输入要执行的命令", "String");
                player.sendForm(fm, (pl, dt) => {
                    if (dt == null) return closeForm(pl);
                    if (!dt[0]) return input_Null(pl);
                    pl.runcmd(`fp cmd ${fp.Name} "${dt[0]}"`);
                });
            },
            true,
        );
    }
}

// 实例化后导出表单组件
export const form = new GUIForm();
