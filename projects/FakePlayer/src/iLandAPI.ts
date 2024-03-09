
// 对iLand API的二次封装，方便调用
class iLand_ {
    constructor() {
        this.iLAPI = {
            /**通过坐标查询领地 */
            ILAPI_PosGetLand: null,
            /**检查领地某权限开启状态 */
            ILAPI_CheckPerm: null,
            /**玩家是否是领地主人 */
            ILAPI_IsLandOwner: null,
        };
        this.init();
    }

    init() {
        Object.keys(this.iLAPI).forEach((key) => {
            if (ll.hasExported(key)) {
                this.iLAPI[key] = ll.imports(key);
            }
        });
    }

    hasAPI(key) {
        return this.iLAPI.hasOwnProperty(key) ? this.iLAPI[key] !== null : false;
    }

    /**
     * 获取API的函数(API未导出将抛出错误)
     * @param {String} key ILAPI
     * @returns {Function}
     */
    getAPI(key) {
        if (!this.hasAPI(key)) throw new Error(`iLand API [namespace: ${key}] not exported`);
        return this.iLAPI[key];
    }

    /**
     * 通过坐标查询领地
     * @param {IntPos | FloatPos} pos 任意坐标
     * @param {Boolean} cache （可选参数）不访问缓存
     * @returns {String | -1} 领地ID / -1
     */
    posGetLand(pos, cache = false) {
        const func = this.getAPI("ILAPI_PosGetLand");
        return func(pos, cache);
    }

    /**
     * 检查领地某权限开启状态
     * @param {String} id 领地ID
     * @param {String} perm 权限名
     * @returns {Boolean} 权限控制项状态
     */
    checkPerm(id, perm) {
        const func = this.getAPI("ILAPI_CheckPerm");
        return func(id, perm);
    }

    /**
     * 玩家是否是领地主人
     * @param {String} id 领地ID
     * @param {String} xuid 玩家XUID
     * @returns {Boolean} 是否是领地主人
     */
    isLandOwner(id, xuid) {
        const func = this.getAPI("ILAPI_IsLandOwner");
        return func(id, xuid);
    }
}

export const iLand = new iLand_();
