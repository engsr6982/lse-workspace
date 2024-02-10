import { filePath } from "./cache.js";

class BoxCore {
    constructor(path) {
        this.path = path;
        this.data = file.exists(this.path) ? JSON.parse(file.readFrom(this.path)) : file.writeTo(this.path, JSON.stringify([])) ? JSON.parse(file.readFrom(this.path)) : logger.error(`创建文件[${this.path}]失败!`);
    }
    /**
     * 保存数据
     * @returns bool
     */
    saveData(newData) {
        file.writeTo(this.path, JSON.stringify(newData, null, 2));
        return this.reloadData();
    }

    /**
     * 读取文件(缓存)
     * @returns {Array}
     */
    getData() {
        return this.data;
    }

    /**
     * 重载文件
     * @returns bool
     */
    reloadData() {
        this.data = file.exists(this.path) ? JSON.parse(file.readFrom(this.path)) : file.writeTo(this.path, JSON.stringify([])) ? JSON.parse(file.readFrom(this.path)) : logger.error(`创建文件[${this.path}]失败!`);
        return true;
    }

    // 添加删除箱子
    /**
     * 给指定玩家添加一个箱子信息
     * @param {String} xuid 
     * @param {IntPos} pos 
     * @param {String} name
     * @returns bool
     */
    addBox(xuid, pos, name = "default") {
        if (!xuid || !(pos instanceof IntPos)) return false;
        const tmp = this.getData();
        // 检查玩家是否重复添加箱子
        if (this.getPlayerBox(xuid, pos).length !== 0) return false;
        // 检查是否添加他人箱子
        if (this.isBoxBound(pos)) return false;
        tmp.push({
            XUID: xuid,
            Name: name,
            Pos: {
                x: pos.x,
                y: pos.y,
                z: pos.z,
                dimid: pos.dimid
            }
        });
        return this.saveData(tmp);
    }

    /**
     * 删除指定玩家箱子信息
     * @param {String} xuid 
     * @param {IntPos} pos 
     * @returns bool
     */
    deleteBox(xuid, pos) {
        if (!xuid || !(pos instanceof IntPos)) return false;
        let boxs = this.getData();
        // 对boxs重新赋值，filter过滤匹配的数组
        boxs = boxs.filter(box => !(box.XUID === xuid && box.Pos.x === pos.x && box.Pos.y === pos.y && box.Pos.z === pos.z && box.Pos.dimid === pos.dimid));
        return this.saveData(boxs);
    }

    /**
     * 获取指定玩家所有箱子信息
     * @param {String} xuid 
     * @returns {Array} [object, object, ...]
     */
    getPlayerAllBox(xuid) {
        return this.getData().filter(box => box.XUID === xuid);
    }

    /**
     * 获取指定玩家指定箱子信息
     * @param {String} xuid 
     * @returns {Array}
     */
    getPlayerBox(xuid, pos) {
        if (!xuid || !(pos instanceof IntPos)) return null;
        const boxes = this.getData();
        const box = boxes.filter(box2 => box2.XUID === xuid && box2.Pos.x === pos.x && box2.Pos.y === pos.y && box2.Pos.z === pos.z && box2.Pos.dimid === pos.dimid);
        return box
    }

    /**
     * 通过坐标获取箱子对象
     * @param {IntPos} pos 
     * @param {Array}
     */
    getBoxInPos(pos) {
        if (!(pos instanceof IntPos)) return null;
        const boxes = this.getData();
        const box = boxes.filter(box2 => box2.Pos.x === pos.x && box2.Pos.y === pos.y && box2.Pos.z === pos.z && box2.Pos.dimid === pos.dimid);
        return box
    }

    /**
     * 箱子是否已被绑定
     * @param {IntPos} pos 
     * @returns bool
     */
    isBoxBound(pos) {
        if (!(pos instanceof IntPos)) return false;
        const boxes = this.getData();
        const box = boxes.find(box2 => box2.Pos.x === pos.x && box2.Pos.y === pos.y && box2.Pos.z === pos.z && box2.Pos.dimid === pos.dimid);
        return box ? box : false;
    }
}

export const boxCore = new BoxCore(filePath + "data.json");