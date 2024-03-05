
import { proxyObject } from "../Core/Proxy.js";
import { GUI_Title, perm } from "../index.js";

/**
 * @author engsr6982
 */
export default class PermGroup_Form {
    /**
     *
     * @param {String} path 语言文件夹
     */
    constructor(path) {
        i18n.load(path, "zh_CN");
    }

    tr = i18n.tr;

    simpleForm() {
        const fm = mc.newSimpleForm();
        fm.setTitle(this.tr("title", GUI_Title));
        fm.setContent(this.tr("content"));
        return fm;
    }

    customForm() {
        const fm = mc.newCustomForm();
        fm.setTitle(this.tr("title", GUI_Title));
        return fm;
    }

    /**
     *
     * @param {Player} player
     */
    closeForm(player) {
        player.tell(this.tr("formClose"));
    }

    inputNull(player) {
        player.tell(this.tr("inputNull"));
    }

    // 公共方法

    /**
     * 主入口
     * @param {Player} player
     */
    index(player) {
        if (!perm.isOP(player.xuid)) return player.tell("No permission");
        const fm = this.simpleForm();
        fm.addButton(this.tr("index.0"), "textures/ui/icon_book_writable.png"); /* 0 */
        fm.addButton(this.tr("index.1"), "textures/ui/color_plus.png"); /* 1 */
        fm.addButton(this.tr("index.2"), "textures/ui/icon_book_writable.png"); /* 2 */
        fm.addButton(this.tr("index.3"), "textures/ui/gear.png"); /* 3 */
        fm.addButton(this.tr("index.4"), "textures/ui/FriendsDiversity.png"); /* 4 */
        fm.addButton(this.tr("index.5"), "textures/ui/gear.png"); /* 5 */
        fm.addButton(this.tr("index.6"), "textures/ui/magnifyingGlass.png"); /* 6 */
        fm.addButton(this.tr("index.7"), "textures/ui/realms_red_x.png"); /* 7 */
        perm._default ? fm.addButton(this.tr("index.8"), "") : null;
        player.sendForm(fm, (pl, id) => {
            switch (id) {
                case 0:
                    this.viewPermissionGroups(pl, perm._getUserList());
                    break;
                case 1:
                    this.createPermissionGroups(pl);
                    break;
                case 2:
                    this.selectPermissionGroup(pl, (group) => {
                        const ob = {};
                        ob[group] = perm.getGroup(group);
                        this.viewPermissionGroups(pl, ob);
                    });
                    break;
                case 3:
                    this.editPermissions(pl);
                    break;
                case 4:
                    this.editUser(pl);
                    break;
                case 5:
                    this.renamePermissionGroup(pl);
                    break;
                case 6:
                    this.searchForUsersPermissionGroup(pl);
                    break;
                case 7:
                    this.deletePermissionGroup(pl);
                    break;
                case 8:
                    this.editDefaultGroupPerms(pl);
                    break;
                default:
                    this.closeForm(pl);
            }
        });
    }

    /**
     * 编辑默认组权限
     * @param {Player} player
     */
    editDefaultGroupPerms(player) {
        const all_GroupName = proxyObject.names(); // 获取所有权限名称
        const oldGroupPermStatus = {}; // 存储原始各个权限状态
        const newGroupPermStatus = {}; // 存储修改后的权限
        // 构建表单
        const fm = this.customForm();
        fm.addLabel(`Edit: default public`);
        all_GroupName.forEach((i) => {
            const has = perm.hasDefaultPerm(proxyObject.nameToObject(i).value); // 检查当前权限状态
            oldGroupPermStatus[i] = has; // 进行缓存
            fm.addSwitch(`${i}`, has);
        });
        player.sendForm(fm, (pl, dt) => {
            if (dt == null) return this.closeForm(pl);
            dt.shift(); // 去除第一位的文本
            for (let i = 0; i < dt.length; i++) {
                newGroupPermStatus[all_GroupName[i]] = dt[i]; // 构建新数据
            }
            // 处理数据
            all_GroupName.forEach((name) => {
                if (oldGroupPermStatus[name] === false && newGroupPermStatus[name] === true) {
                    // 如果原始数据false，新数据true，则添加数据
                    perm.addDefaultPerm(proxyObject.nameToObject(name).value);
                } else if (oldGroupPermStatus[name] === true && newGroupPermStatus[name] === false) {
                    // 如果原始数据true，新数据false，则删除数据
                    perm.deleteDefaultPerm(proxyObject.nameToObject(name).value);
                }
                // 剩余情况：
                // 1. 原始false  新false   忽略
                // 2. 原始true   新true    忽略
            });
            this.doYouWantToContinue(pl);
        });
    }

    /**
     * 是否继续
     * @param {Player} player
     */
    doYouWantToContinue(player) {
        player.sendModalForm(
            this.tr("title", GUI_Title),
            this.tr("doYouWantToContinue.content"),
            this.tr("doYouWantToContinue.button1"),
            this.tr("doYouWantToContinue.button2"),
            (pl, id) => {
                switch (id) {
                    case true:
                        this.index(pl);
                        break;
                    default:
                        this.closeForm(pl);
                }
            },
        );
    }

    /**
     * 查看权限组
     * @param {Player} player
     */
    viewPermissionGroups(player, group = {}) {
        const fm = this.customForm();
        if (Object.keys(group).length !== 0) {
            for (let i in group) {
                fm.addLabel(
                    this.tr("listPermissionGroups", {
                        name: i,
                        // perm: group[i].Perm.join(),
                        perm: group[i].Perm.map((perm) => {
                            const tmp = proxyObject.valueToObject(perm);
                            return tmp ? tmp.name : perm;
                        })
                            .join()
                            .replace(/,/g, `§r §l§e| §r`),
                        user: group[i].User.map((user) => {
                            return data.xuid2name(user) || user;
                        })
                            .join()
                            .replace(/,/g, `§r §l§e| §r`),
                    }),
                );
            }
        }
        player.sendForm(fm, (pl, dt) => {
            this.doYouWantToContinue(pl);
        });
    }

    /**
     * 创建权限组
     * @param {Player} player
     */
    createPermissionGroups(player) {
        const fm = this.customForm();
        fm.addInput(this.tr("createPermissionGroups"));
        player.sendForm(fm, (pl, dt) => {
            if (dt == null) return this.closeForm(pl);
            if (dt[0] == "") return this.inputNull(pl);
            perm.createGroup(dt[0]) ? this.doYouWantToContinue(pl) : this.createPermissionGroups(pl);
        });
    }

    /**
     * 选择权限组
     * @param {Player} player
     * @param {Function} callback 权限组名称
     */
    selectPermissionGroup(player, callback) {
        const fm = this.simpleForm();
        const group = perm._getUserList();
        fm.setContent(this.tr("selectPermissionGroup.content"));
        for (let i in group) {
            fm.addButton(
                this.tr("selectPermissionGroup.button", {
                    0: i,
                    1: group[i].Perm.length,
                    2: group[i].User.length,
                }),
            );
        }
        player.sendForm(fm, (pl, id) => {
            if (id == null) return this.closeForm(pl);
            callback(Object.keys(group)[id]);
        });
    }

    /**
     * 操作类别
     * @param {Player} player
     * @param {Function} callback
     */
    operationCategory(player, callback) {
        player.sendModalForm(
            this.tr("title", GUI_Title),
            this.tr("content"),
            this.tr("operationCategory.button1"),
            this.tr("operationCategory.button2"),
            (pl, res) => {
                if (res == null) return this.closeForm(pl);
                callback(Boolean(res).valueOf());
            },
        );
    }

    /**
     * 编辑权限
     * @param {Player} player
     */
    editPermissions(player) {
        // this.operationCategory(player, type => {
        //     switch (type) {
        //         case true:
        //             this.addPermission(player);
        //             break;
        //         case false:
        //             this.deletePermissions(player);
        //             break;
        //     }
        // });
        this.selectPermissionGroup(player, (groupName) => {
            const all_GroupName = proxyObject.names(); // 获取所有权限名称
            const oldGroupPermStatus = {}; // 存储原始各个权限状态
            const newGroupPermStatus = {}; // 存储修改后的权限
            // 构建表单
            const fm = this.customForm();
            fm.addLabel(`Edit: ${groupName}`);
            all_GroupName.forEach((i) => {
                const has = perm._isGroupHasPerms(groupName, proxyObject.nameToObject(i).value); // 检查当前权限状态
                oldGroupPermStatus[i] = has; // 进行缓存
                fm.addSwitch(`${i}`, has);
            });
            player.sendForm(fm, (pl, dt) => {
                if (dt == null) return this.closeForm(pl);
                dt.shift(); // 去除第一位的文本
                for (let i = 0; i < dt.length; i++) {
                    newGroupPermStatus[all_GroupName[i]] = dt[i]; // 构建新数据
                }
                // 处理数据
                all_GroupName.forEach((name) => {
                    if (oldGroupPermStatus[name] === false && newGroupPermStatus[name] === true) {
                        // 如果原始数据false，新数据true，则添加数据
                        perm.addPerm(groupName, proxyObject.nameToObject(name).value);
                    } else if (oldGroupPermStatus[name] === true && newGroupPermStatus[name] === false) {
                        // 如果原始数据true，新数据false，则删除数据
                        perm.deletePerm(groupName, proxyObject.nameToObject(name).value);
                    }
                    // 剩余情况：
                    // 1. 原始false  新false   忽略
                    // 2. 原始true   新true    忽略
                });
                this.doYouWantToContinue(pl);
            });
        });
    }

    // /**
    //  * 添加权限
    //  * @param {Player} player
    //  */
    // addPermission(player) {
    //     const all = proxyObject.keys();
    //     this.selectPermissionGroup(player, group => {
    //         const fm = this.customForm();
    //         fm.addLabel(`Edit: ${group}`);
    //         fm.addDropdown(this.tr("addPermission"), all.map(i => { const tmp = proxyObject.keyToObject(i); return tmp ? tmp.name : i; }));
    //         player.sendForm(fm, (pl, dt) => {
    //             if (dt == null) return this.closeForm(pl);
    //             const value = proxyObject.keyToObject(all[dt[1]]).value;
    //             perm.addPerm(group, value);
    //             this.doYouWantToContinue(pl);
    //         });
    //     });
    // }

    // /**
    //  * 删除权限
    //  * @param {Player} player
    //  */
    // deletePermissions(player) {
    //     this.selectPermissionGroup(player, group => {
    //         const groupInfo = perm.getGroup(group).Perm;// value
    //         const fm = this.customForm();
    //         fm.addLabel(`Edit: ${group}`);
    //         fm.addDropdown(this.tr("deletePermissions"), groupInfo.map(perm => { const tmp = proxyObject.valueToObject(perm); return tmp ? tmp.name : perm; }));
    //         player.sendForm(fm, (pl, dt) => {
    //             if (dt == null) return this.closeForm(pl);
    //             perm.deletePerm(group, groupInfo[dt[1]]);
    //             this.doYouWantToContinue(pl);
    //         });
    //     });
    // }

    /**
     * 编辑用户
     * @param {Player} player
     */
    editUser(player) {
        this.operationCategory(player, (type) => {
            switch (type) {
                case true:
                    this.addUser(player);
                    break;
                case false:
                    this.deleteUser(player);
                    break;
            }
        });
    }

    /**
     * 添加用户
     * @param {Player} player
     */
    addUser(player) {
        this.selectPermissionGroup(player, (group) => {
            const allPlayer = mc.getOnlinePlayers();
            const fm = this.customForm();
            fm.addLabel(`Edit: ${group}`);
            fm.addDropdown(
                this.tr("addUser.selectPlayer"),
                allPlayer.map((pl) => {
                    return pl.realName;
                }),
            ); // 1
            fm.addInput(this.tr("addUser.inputPlayer"), "String"); // 2
            fm.addSwitch(this.tr("addUser.switch")); // 3
            player.sendForm(fm, (pl, dt) => {
                if (dt == null) return this.closeForm(pl);
                let xuid;
                if (dt[3] == 0) {
                    // 在线
                    xuid = allPlayer[dt[1]].xuid;
                } else {
                    // 离线
                    if (dt[2] == "") return this.inputNull(pl);
                    xuid = data.name2xuid(dt[2]);
                }
                // 检查一遍XUID
                if (xuid == null) return pl.tell(this.tr("addUser.xuidNull", dt[3] == 1 ? dt[2] : allPlayer[dt[1]].realName));
                perm.addUser(group, xuid);
                this.doYouWantToContinue(pl);
            });
        });
    }
    /**
     * 删除用户
     * @param {Player} player
     */
    deleteUser(player) {
        this.selectPermissionGroup(player, (group) => {
            const groupInfo = perm.getGroup(group).User;
            const fm = this.customForm();
            fm.addLabel(`Edit: ${group}`);
            fm.addDropdown(
                this.tr("deleteUser"),
                groupInfo.map((u) => {
                    const tmp = data.xuid2name(u);
                    return tmp ? tmp : u;
                }),
            );
            player.sendForm(fm, (pl, dt) => {
                if (dt == null) return this.closeForm(pl);
                perm.deleteUser(group, groupInfo[dt[1]]);
                this.doYouWantToContinue(pl);
            });
        });
    }

    /**
     * 重命名权限组
     * @param {Player} player
     */
    renamePermissionGroup(player) {
        this.selectPermissionGroup(player, (group) => {
            const fm = this.customForm();
            fm.addLabel(`Edit: ${group}`);
            fm.addInput(this.tr("renamePermissionGroup"), "String");
            player.sendForm(fm, (pl, dt) => {
                if (dt == null) return this.closeForm(pl);
                if (dt[1] == null) return this.inputNull(pl);
                perm.reNameGroup(group, dt[1]);
                this.doYouWantToContinue(pl);
            });
        });
    }

    /**
     * 搜索用户所在权限组
     * @param {Player} player
     */
    searchForUsersPermissionGroup(player) {
        const allPlayer = mc.getOnlinePlayers();
        const fm = this.customForm();
        fm.addDropdown(
            this.tr("addUser.selectPlayer"),
            allPlayer.map((pl) => {
                return pl.realName;
            }),
        ); // 1
        fm.addInput(this.tr("addUser.inputPlayer"), "String"); // 2
        fm.addSwitch(this.tr("addUser.switch")); // 3
        player.sendForm(fm, (pl, dt) => {
            if (dt == null) return this.closeForm(pl);
            let xuid;
            if (dt[2] == 0) {
                // 在线
                xuid = allPlayer[dt[0]].xuid;
            } else {
                // 离线
                if (dt[1] == "") return this.inputNull(pl);
                xuid = data.name2xuid(dt[1]);
            }
            // 检查一遍XUID
            if (xuid == null) return pl.tell(this.tr("addUser.xuidNull", dt[2] == 1 ? dt[1] : allPlayer[dt[0]].realName));
            this.viewPermissionGroups(pl, convertGroups(perm.getUserInGroup(xuid)));
            // 辅助数据格式转换函数
            function convertGroups(groups) {
                const result = {};
                groups.forEach((group) => {
                    result[group.name] = {
                        Perm: group.data.Perm,
                        User: group.data.User,
                    };
                });
                return result;
            }
        });
    }

    /**
     * 删除权限组
     * @param {Player} player
     */
    deletePermissionGroup(player) {
        this.selectPermissionGroup(player, (group) => {
            player.sendModalForm(
                this.tr("title"),
                `§eAre you sure you want to delete the permission group <${group}>?`,
                "§cYes",
                "§aNo",
                (pl, res) => {
                    if (res == null || res == false) return this.closeForm(pl);
                    if (res == true) {
                        perm.deleteGroup(group);
                        this.doYouWantToContinue(pl);
                    }
                },
            );
        });
    }
}
