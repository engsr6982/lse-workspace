import { Other } from "../Other.js";
import { FileOperation, Gm_Tell, db } from "../cache.js";


export function SetingForm(pl) {
    const fm = Other.SimpleForm();
    // fm.addButton('插件设置', 'textures/ui/icon_setting');
    fm.addButton('家园传送点管理', 'textures/ui/village_hero_effect');
    fm.addButton('公共传送点管理', 'textures/ui/icon_best3');
    fm.addButton('合并请求管理', 'textures/ui/book_shiftleft_default');
    fm.addButton('重载配置文件', 'textures/ui/refresh_light');
    pl.sendForm(fm, (pl, id) => {
        switch (id) {
            case 0: HomePanel_Mgr.HomePanel(pl); break;
            case 1: WarpPanel_Mgr.WarpPanel(pl); break;
            case 2: MergeRequest_Mgr.MergeRequest_Panel(pl); break;
            case 3: FileOperation.saveFile(); pl.tell(Gm_Tell + '操作完成！'); break;
            // case 4: break;
            default: Other.CloseTell(pl); break;
        }
    })
}

class HomePanel_Mgr {
    /**
     * 家园编辑总面板
     * @param {Object} pl 玩家对象
     */
    static HomePanel(pl) {
        let Home = db.get('Home');
        const fm = Other.SimpleForm();
        fm.setContent(`· 选择一个玩家以进行管理`);
        let AllPlayerData = [];/* 缓存键 */
        // 创建按钮
        for (let player in Home) {
            fm.addButton(`[玩家]  ${player}\n家园总数: ${Home[player].length}`);
            AllPlayerData.push(player);
        }
        fm.addButton('返回上一页', 'textures/ui/icon_import');
        pl.sendForm(fm, (pl, id) => {
            if (id == null) return Other.CloseTell(pl);
            if (id == AllPlayerData.length) return SetingForm(pl);
            HomePanel_Mgr.Level_1(pl, AllPlayerData[id]);
        })
    }

    /**
     * 子表单1
     * @param {Object} pl 玩家对象
     * @param {String} name 要操作的玩家 玩家名
     */
    static Level_1(pl, name) {
        let Home = db.get('Home');
        const fm = Other.SimpleForm();
        fm.setContent(`· 当前正在编辑玩家 ${name} 的家园传送点`);
        fm.addButton('返回上一页', 'textures/ui/icon_import');
        fm.addButton('新建家', 'textures/ui/color_plus');
        // 创建按钮
        Home[name].forEach(i => {
            fm.addButton(`${i.name}\n${Other.DimidToDimension(i.dimid)}  X: ${i.x} Y: ${i.y} Z: ${i.z}`);
        });
        pl.sendForm(fm, (pl, id) => {
            if (id == null) return Other.CloseTell(pl);
            if (id == 0) return HomePanel_Mgr.HomePanel(pl);
            if (id == 1) {
                // 创建家
                HomePanel_Mgr.CreateHome(pl, name);
            } else {
                // 编辑家园
                id = id - 2;//去除前面两个按钮
                HomePanel_Mgr.Level_2(pl, name, id);
            }
        })
    }

    /**
     * 子表单2
     * @param {Object} pl 玩家对象
     * @param {String} name 要操作的玩家 玩家名
     * @param {Number} index 操作的家 索引
     */
    static Level_2(pl, name, index) {
        let Home = db.get('Home');
        const fm = Other.SimpleForm();
        fm.setContent(`当前正在编辑：${name}\n名称： ${Home[name][index].name}\n坐标： ${Home[name][index].x},${Home[name][index].y},${Home[name][index].z}\n维度： ${Other.DimidToDimension(Home[name][index].dimid)}`);
        fm.addButton('前往家', 'textures/ui/send_icon');
        fm.addButton('编辑家', 'textures/ui/book_edit_default');
        fm.addButton('删除家', 'textures/ui/trash_default');
        fm.addButton('返回上一页', 'textures/ui/icon_import');
        pl.sendForm(fm, (pl, id) => {
            switch (id) {
                case 0:
                    pl.teleport(new IntPos(Home[name][index].x, Home[name][index].y, Home[name][index].z, Home[name][index].dimid));
                    pl.tell(Gm_Tell + '传送成功！');
                    break;
                case 1: HomePanel_Mgr.EditHome(pl, name, index); break;
                case 2:
                    Home[name].splice(index, 1);
                    db.set('Home', Home);
                    pl.tell(Gm_Tell + '删除成功！');
                    break;
                case 3: HomePanel_Mgr.Level_1(pl, name); break;
                default: Other.CloseTell(pl); break;
            }
        })
    }

    /**
     * 编辑家
     * @param {Object} pl 玩家对象
     * @param {String} name 要操作的玩家 玩家名
     * @param {Number} index 操作的家 索引
     */
    static EditHome(pl, name, index) {
        let Home = db.get('Home');
        const fm = Other.CustomForm();
        fm.addInput('输入名称', 'String', Home[name][index].name);
        fm.addInput('输入坐标 [使用英文逗号分隔坐标轴]', "String IntPos X,Y,Z", `${Home[name][index].x},${Home[name][index].y},${Home[name][index].z}`);
        fm.addDropdown('选择维度', ['主世界', '地狱', '末地'], Home[name][index].dimid);
        pl.sendForm(fm, (pl, dt) => {
            if (dt == null) return Other.CloseTell(pl);
            if (dt[0] == '') return pl.tell(Gm_Tell + '输入框为空！');
            const input = dt[1].split(',');
            const input_pos = new IntPos(Number(input[0]), Number(input[1]), Number(input[2]), parseInt(dt[2]));
            Home[name][index] = {
                "name": dt[0],
                "x": input_pos.x,
                "y": input_pos.y,
                "z": input_pos.z,
                "dimid": input_pos.dimid
            };
            db.set('Home', Home);
            pl.tell(Gm_Tell + '更新成功！');
        })
    }

    /**
     * 创建家
     * @param {Object} pl 玩家对象
     * @param {String} name 要操作的玩家 玩家名
     */
    static CreateHome(pl, name) {
        const fm = Other.CustomForm();
        fm.addInput('输入名称', 'String');
        fm.addInput('输入坐标 [使用英文逗号分隔坐标轴]', "String IntPos X,Y,Z", `${pl.blockPos.x},${pl.blockPos.y},${pl.blockPos.z}`);
        fm.addDropdown('选择维度', ['主世界', '地狱', '末地'], pl.blockPos.dimid);
        pl.sendForm(fm, (pl, dt) => {
            if (dt == null) return Other.CloseTell(pl);
            if (dt[0] == '') return pl.tell(Gm_Tell + '输入框为空！');
            const input = dt[1].split(',');
            const input_pos = new IntPos(Number(input[0]), Number(input[1]), Number(input[2]), parseInt(dt[2]));
            let Home = db.get('Home');
            if (!Home.hasOwnProperty(name)) {
                Home[name] = [];
            }
            Home[name].push({
                "name": dt[0],
                "x": input_pos.x,
                "y": input_pos.y,
                "z": input_pos.z,
                "dimid": input_pos.dimid
            });
            db.set('Home', Home);
            pl.tell(Gm_Tell + '添加完成！');
        })
    }
}

class WarpPanel_Mgr {
    static WarpPanel(pl) {
        let Warp = db.get('Warp');
        const fm = Other.SimpleForm();
        fm.addButton('返回上一页', 'textures/ui/icon_import');
        fm.addButton('新建公共传送点', 'textures/ui/color_plus');
        Warp.forEach(i => {
            fm.addButton(`${i.name}\n${Other.DimidToDimension(i.dimid)} X: ${i.x} Y: ${i.y} Z: ${i.z}`);
        });
        pl.sendForm(fm, (pl, id) => {
            if (id == null) return Other.CloseTell(pl);
            if (id == 0) return SetingForm(pl);
            if (id == 1) {
                WarpPanel_Mgr.CreateWarp(pl);
            } else {
                // 编辑
                id = id - 2;
                WarpPanel_Mgr.Level_1(pl, id);
            }
        })
    }

    static Level_1(pl, index) {
        let Warp = db.get('Warp');
        const fm = Other.SimpleForm();
        fm.setContent(`当前正在编辑： ${Warp[index].name}\n坐标： ${Warp[index].x},${Warp[index].y},${Warp[index].z}\n维度： ${Other.DimidToDimension(Warp[index].dimid)}`,)
        fm.addButton("前往此传送点", "textures/ui/send_icon");
        fm.addButton("编辑此传送点", "textures/ui/book_edit_default");
        fm.addButton("删除此传送点", "textures/ui/trash_default");
        fm.addButton("返回上一页", 'textures/ui/icon_import');
        pl.sendForm(fm, (pl, id) => {
            switch (id) {
                case 0:
                    pl.teleport(new IntPos(Warp[index].x, Warp[index].y, Warp[index].z, Warp[index].dimid));
                    pl.tell(Gm_Tell + '传送成功！');
                    break;
                case 1: WarpPanel_Mgr.EditWarp(pl, index); break;
                case 2:
                    Warp.splice(index, 1);
                    db.set('Warp', Warp);
                    pl.tell(Gm_Tell + '删除成功！');
                    break;
                case 3: WarpPanel_Mgr.WarpPanel(pl); break;
                default: Other.CloseTell(pl); break;
            }
        })
    }

    static EditWarp(pl, index) {
        let Warp = db.get('Warp');
        const fm = Other.CustomForm();
        fm.addInput('输入名称', 'String', Warp[index].name);
        fm.addInput('输入坐标 [使用英文逗号分隔坐标轴]', "String IntPos X,Y,Z", `${Warp[index].x},${Warp[index].y},${Warp[index].z}`);
        fm.addDropdown('选择维度', ['主世界', '地狱', '末地'], Warp[index].dimid);
        pl.sendForm(fm, (pl, dt) => {
            if (dt == null) return Other.CloseTell(pl);
            if (dt[0] == '') return pl.tell(Gm_Tell + '输入框为空！');
            const input = dt[1].split(',');
            const input_pos = new IntPos(Number(input[0]), Number(input[1]), Number(input[2]), parseInt(dt[2]));
            Warp[index] = {
                "name": dt[0],
                "x": input_pos.x,
                "y": input_pos.y,
                "z": input_pos.z,
                "dimid": input_pos.dimid
            };
            db.set('Warp', Warp);
            pl.tell(Gm_Tell + '更新成功！');
        })
    }

    static CreateWarp(pl) {
        let Warp = db.get('Warp');
        const fm = Other.CustomForm();
        fm.addInput('输入名称', 'String');
        fm.addInput('输入坐标 [使用英文逗号分隔坐标轴]', "String IntPos X,Y,Z", `${pl.blockPos.x},${pl.blockPos.y},${pl.blockPos.z}`);
        fm.addDropdown('选择维度', ['主世界', '地狱', '末地'], pl.blockPos.dimid);
        pl.sendForm(fm, (pl, dt) => {
            if (dt == null) return Other.CloseTell(pl);
            if (dt[0] == '') return pl.tell(Gm_Tell + '输入框为空！');
            const input = dt[1].split(',');
            const input_pos = new IntPos(Number(input[0]), Number(input[1]), Number(input[2]), parseInt(dt[2]));
            Warp.push({
                "name": dt[0],
                "x": input_pos.x,
                "y": input_pos.y,
                "z": input_pos.z,
                "dimid": input_pos.dimid
            });
            db.set('Warp', Warp);
            pl.tell(Gm_Tell + '添加完成！');
        })
    }
}

class MergeRequest_Mgr {
    static MergeRequest_Panel(pl) {
        let MergeRequest = db.get('MergeRequest');
        const fm = Other.SimpleForm();
        MergeRequest.forEach(i => {
            fm.addButton(`[玩家]  ${i.player}\n${i.data.name}  ${Other.DimidToDimension(i.data.dimid)} ${i.data.x},${i.data.y},${i.data.z}`)
        });
        fm.addButton('返回上一页', 'textures/ui/icon_import');
        pl.sendForm(fm, (pl, id) => {
            if (id == null) return Other.CloseTell(pl);
            if (id == MergeRequest.length) return SetingForm(pl);
            MergeRequest_Mgr.Level_1(pl, id);
        })
    }

    static Level_1(pl, index) {
        let Warp = db.get('Warp');
        let MergeRequest = db.get('MergeRequest');
        const fm = Other.SimpleForm();
        fm.setContent(`[玩家]: ${MergeRequest[index].player}\n[时间]: ${MergeRequest[index].time}\n[GUID]: ${MergeRequest[index].guid}\n[坐标]: ${MergeRequest[index].data.name}  ${Other.DimidToDimension(MergeRequest[index].data.dimid)} ${MergeRequest[index].data.x},${MergeRequest[index].data.y},${MergeRequest[index].data.z}`,);
        fm.addButton("同意并加入公共传送点", 'textures/ui/realms_green_check');
        fm.addButton('拒绝并删除', 'textures/ui/realms_red_x');
        fm.addButton('前往此传送点', 'textures/ui/send_icon');
        fm.addButton('返回上一页', 'textures/ui/icon_import');
        pl.sendForm(fm, (pl, id) => {
            switch (id) {
                case 0:
                    Warp.push(MergeRequest[index].data);
                    MergeRequest.splice(index, 1);
                    db.set('MergeRequest', MergeRequest);
                    db.set('Warp', Warp);
                    pl.tell(Gm_Tell + '并入完成！');
                    break;
                case 1:
                    MergeRequest.splice(index, 1);
                    db.set('MergeRequest', MergeRequest);
                    pl.tell(Gm_Tell + '已拒绝并删除！');
                    break;
                case 2:
                    pl.teleport(new IntPos(MergeRequest[index].data.x, MergeRequest[index].data.y, MergeRequest[index].data.z, MergeRequest[index].data.dimid));
                    pl.tell(Gm_Tell + '传送成功！');
                    break;
                case 3: MergeRequest_Mgr.MergeRequest_Panel(pl); break;
                default: Other.CloseTell(pl); break;
            }
        })
    }
}