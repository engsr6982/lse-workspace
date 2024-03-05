
/**
 * 权限组实例 @author engsr6982
 */
export default class PermissionGroup {
    /**
     * 实例化Permission_Group
     * @param {String} path 权限组保存路径 ./plugins/Perm/data.json
     * @param {Boolean} _default 启用默认组 默认关闭
     */
    constructor(path, _default = false) {
        this._path = path ? path : "./data/default.json";
        this._default = _default;
        this._data = new JsonConfigFile(this._path);
        // init data
        this._data.init("op", []);
        this._data.init("user", {});
        _default
            ? this._data.init("default", {
                  Perm: [],
              })
            : false;
    }

    // =========================== //
    //           私有方法           //
    // =========================== //

    /**
     * 获取OP列表
     * @returns {Array}
     */
    _getOPList() {
        return this._data.get("op");
    }
    /**
     * 获取用户列表
     * @returns {Object}
     */
    _getUserList() {
        return this._data.get("user");
    }
    /**
     * 更新OP列表
     * @param {Array} newArray
     * @returns {Boolean}
     */
    _updateOPList(newArray) {
        return this._data.set("op", newArray);
    }
    /**
     * 更新User列表
     * @param {Object} newObject
     * @returns {Boolean}
     */
    _updateUserList(newObject) {
        return this._data.set("user", newObject);
    }

    // =========================== //
    //           管理方法           //
    // =========================== //

    /**
     * 玩家是否为OP
     * @param {String} xuid  OP xuid
     * @returns {Boolean} 是否为OP
     */
    isOP(xuid) {
        return this._getOPList().indexOf(xuid) !== -1;
    }

    /**
     * 添加OP
     * @param {String} xuid OP xuid
     * @returns {Boolean} 是否添加成功
     */
    addOP(xuid) {
        const tmp = this._getOPList();
        if (!this.isOP(xuid)) {
            tmp.push(xuid);
            this._updateOPList(tmp);
            return true;
        }
        return false;
    }

    /**
     * 移除OP
     * @param {String} xuid OP xuid
     * @returns {Boolean} 是否移除成功
     */
    deOP(xuid) {
        const tmp = this._getOPList();
        const index = tmp.findIndex((op) => op === xuid);
        if (index !== -1) {
            tmp.splice(index, 1);
            this._updateOPList(tmp);
            return true;
        }
        return false;
    }

    // =========================== //
    //           用户方法           //
    // =========================== //

    /**
     * 名称是否合法 (允许1-16字节，允许中文字母数字下划线)
     * @param {String} name
     * @returns 是否合法
     */
    _isTheNameLegal(name) {
        return RegExp(/^[a-zA-Z0-9_\u4e00-\u9fa5]{1,16}$/g).test(name);
    }

    /**
     * 权限组是否存在
     * @param {String} name 权限组名称
     * @returns {Boolean} 权限组是否存在
     */
    _isGroup(name) {
        return this._getUserList().hasOwnProperty(name);
    }

    /**
     * 创建组
     * @param {String} name 权限组名称
     * @returns {Boolean} 是否创建成功  抛出：非法名称
     */
    createGroup(name) {
        if (this._isGroup(name)) return false;
        if (!this._isTheNameLegal(name)) throw new Error("Failed to create group! Invalid name!");
        const tmp = this._getUserList();
        tmp[name] = {
            Perm: [],
            User: [],
        };
        return this._updateUserList(tmp);
    }

    /**
     * 删除组
     * @param {String} name 权限组名称
     * @returns {Boolean} 是否删除成功
     */
    deleteGroup(name) {
        if (!this._isGroup(name)) return false;
        const tmp = this._getUserList();
        delete tmp[name];
        return this._updateUserList(tmp);
    }

    /**
     * 组是否拥有指定权限
     * @param {String} name 权限组名称
     * @param {String} perm 权限
     * @returns {Boolean} 是否拥有
     */
    _isGroupHasPerms(name, perm) {
        if (!this._isGroup(name)) return false;
        const tmp = this._getUserList();
        const perms = tmp[name].Perm;
        return perms.some((p) => p === perm);
    }

    /**
     * 组是否拥有指定用户
     * @param {String} name 权限组名称
     * @param {string} user 用户
     * @returns {Boolean} 是否拥有
     */
    _isGroupHasUsers(name, user) {
        if (!this._isGroup(name)) return false;
        const tmp = this._getUserList();
        const users = tmp[name].User;
        return users.some((u) => u === user);
    }

    /**
     * 添加权限
     * @param {String} name 权限组名称
     * @param {String} perm 权限
     * @param {Boolean} 是否添加成功
     */
    addPerm(name, perm) {
        if (!this._isGroup(name)) return false;
        if (this._isGroupHasPerms(name, perm)) return false;
        const tmp = this._getUserList();
        tmp[name].Perm.push(perm);
        return this._updateUserList(tmp);
    }

    /**
     * 删除权限
     * @param {String} name 权限组名称
     * @param {String} perm 权限
     * @returns {Boolean} 是否删除成功
     */
    deletePerm(name, perm) {
        if (!this._isGroup(name)) return false;
        if (!this._isGroupHasPerms(name, perm)) return false;
        const tmp = this._getUserList();
        tmp[name].Perm.splice(
            tmp[name].Perm.findIndex((i) => i === perm),
            1,
        );
        return this._updateUserList(tmp);
    }

    /**
     * 添加用户
     * @param {String} name 权限组名称
     * @param {String} xuid 用户xuid
     * @returns {Boolean} 是否添加成功
     */
    addUser(name, xuid) {
        if (!this._isGroup(name)) return false;
        if (this._isGroupHasUsers(name, xuid)) return false;
        const tmp = this._getUserList();
        tmp[name].User.push(xuid);
        return this._updateUserList(tmp);
    }

    /**
     * 删除用户
     * @param {String} name 权限组名称
     * @param {String} xuid 用户xuid
     * @returns {Boolean} 是否删除成功
     */
    deleteUser(name, xuid) {
        if (!this._isGroup(name)) return false;
        if (!this._isGroupHasUsers(name, xuid)) return false;
        const tmp = this._getUserList();
        tmp[name].User.splice(
            tmp[name].User.findIndex((i) => i === xuid),
            1,
        );
        return this._updateUserList(tmp);
    }

    /**
     * 用户是否在指定权限组内
     * @param {String} name 权限组名称
     * @param {String} xuid 用户xuid
     * @returns {Boolean} 是否存在
     */
    isUserInGroup(name, xuid) {
        if (!this._isGroup(name)) return false;
        return this._isGroupHasUsers(name, xuid);
    }

    /**
     * 获取用户所在权限组
     * @param {String} xuid 用户xuid
     * @returns {Array|null} 包含指定用户的所有用户组，如果用户不在任何权限组中则返回null
     */
    getUserInGroup(xuid) {
        const tmp = this._getUserList();
        const result = [];
        for (let key in tmp) {
            const userIndex = tmp[key].User.indexOf(xuid);
            if (userIndex !== -1) {
                result.push({ name: key, data: tmp[key] });
            }
        }
        return result.length ? result : null;
    }

    /**
     * 获取所有权限组
     * @returns {Array} 权限组名称 [name, name, ...]
     */
    getAllGroup() {
        return Object.keys(this._getUserList());
    }

    /**
     * 获取指定权限组
     * @param {String} name 权限组名称
     * @returns {Object|Null} 权限组 不存在返回Null
     */
    getGroup(name) {
        return this._getUserList()[name] || null;
    }

    /**
     * 重命名一个权限组
     * @param {String} name 权限组名称
     * @param {String} newName 新的权限组名称
     * @returns {Boolean} 是否成功
     */
    reNameGroup(name, newName) {
        if (!this._isGroup(name)) return false;
        if (!this._isTheNameLegal(newName)) return false;
        const tmp = this._getUserList();
        if (tmp[newName]) return false; // 新的权限组名称已存在
        tmp[newName] = tmp[name];
        delete tmp[name];
        this._updateUserList(tmp);
        return true;
    }

    // =========================== //
    //           默认方法           //
    // =========================== //

    _getDefault() {
        return this._data.get("default");
    }

    _updateDefault(newDefault) {
        return this._data.set("default", newDefault);
    }

    /**
     * 添加一个权限到默认组
     * @param {String} perm 权限值
     */
    addDefaultPerm(perm) {
        // if (!this._default) return false;
        if (this.hasDefaultPerm(perm)) return false;
        const def = this._getDefault();
        def.Perm.push(perm);
        return this._updateDefault(def);
    }

    /**
     * 从默认组删除一个权限
     * @param {String} perm 权限值
     */
    deleteDefaultPerm(perm) {
        if (!this.hasDefaultPerm(perm)) return false;
        const def = this._getDefault();
        def.Perm.splice(
            def.Perm.findIndex((p) => p === perm),
            1,
        );
        return this._updateDefault(def);
    }

    /**
     * 默认组是否拥有指定权限
     * @param {String} perm 权限值
     */
    hasDefaultPerm(perm) {
        const def = this._getDefault();
        return def.Perm.some((p) => p === perm);
    }

    // =========================== //
    //           通用方法           //
    // =========================== //

    /**
     * 用户是否拥有指定权限
     * @param {String} xuid 权限组名称
     * @param {String} perm 权限
     * @param {Boolean} _def 是否启用默认组
     * @returns {Boolean} 是否拥有权限
     */
    hasUserPerm(xuid, perm, _def = true) {
        const tmp = this.getUserInGroup(xuid); // 获取用户所在组
        if (tmp) {
            // 获取成功  检查组内
            for (let i = 0; i < tmp.length; i++) {
                if (tmp[i].data.Perm.indexOf(perm) !== -1) {
                    return true;
                }
            }
        }
        // default
        return _def && this._default ? this.hasDefaultPerm(perm) : false;
    }
}
