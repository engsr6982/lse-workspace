import { Config, Gm_Tell, MainUI, Home, PlayerSeting, PLUGIN_INFO, MergeRequest } from "../cache.js";
import { Other } from "../Other.js";

import { Main } from "../form/Mian.js";
import { Money_Mod } from "../Money.js";
import { HomeCore } from "../core/Home.js";
import { SelectAction } from "./SelectAction.js";
import { MergeRequest_Core } from "../core/MergeRequest.js";

export class HomeForm {
    static Panel(pl) {
        if (!Config.Home.Enable) return pl.tell(Gm_Tell + `此功能已被管理员关闭！`);
        const fm = Other.SimpleForm();
        fm.addButton('新建家', 'textures/ui/color_plus');
        fm.addButton('前往家', 'textures/ui/send_icon');
        fm.addButton('编辑家', 'textures/ui/book_edit_default');
        fm.addButton('删除家', 'textures/ui/trash_default');
        fm.addButton('并入公共传送点', 'textures/ui/share_microsoft');
        fm.addButton('返回上一页', 'textures/ui/icon_import');
        pl.sendForm(fm, (pl, id) => {
            switch (id) {
                case 0: HomeForm.CreateHome(pl); break;
                case 1: HomeForm.GoHome(pl); break;
                case 2: HomeForm.Edit_Panel(pl); break;
                case 3: HomeForm.DeleteHome(pl); break;
                case 4: HomeForm.MergeRequest_Panel(pl); break;
                case 5: Main(pl, MainUI); break;
                default: Other.CloseTell(pl); break;
            }
        })
    }

    static CreateHome(pl) {
        const fm = Other.CustomForm();
        fm.addLabel(Money_Mod.getEconomyStr(pl, Config.Home.CreateHome));
        fm.addInput("输入家园名称", "String");
        pl.sendForm(fm, (pl, dt) => {
            if (dt == null) return Other.CloseTell(pl);
            if (dt[1] == '') return pl.tell(Gm_Tell + "输入框为空！");
            HomeCore.CreateHome(pl, dt[1]);
        })
    }

    static GoHome(pl) {
        if (Home.hasOwnProperty(pl.realName) && Home[pl.realName].length !== 0) {
            SelectAction(pl, Home[pl.realName], false, id => {
                // 创建坐标对象
                const Pos = new IntPos(Home[pl.realName][id].x, Home[pl.realName][id].y, Home[pl.realName][id].z, Home[pl.realName][id].dimid);
                if (PlayerSeting[pl.realName].SecondaryConfirmation) {
                    pl.sendModalForm(PLUGIN_INFO.Introduce, `名称： ${Home[pl.realName][id].name}\n坐标： ${Home[pl.realName][id].x},${Home[pl.realName][id].y},${Home[pl.realName][id].z}\n维度： ${Other.DimidToDimension(Home[pl.realName][id].dimid)}\n${Money_Mod.getEconomyStr(pl, Config.Home.GoHome)}`, '确认', '返回上一页', (_, res) => {
                        switch (res) {
                            case true: HomeCore.GoHome(pl, pl.blockPos); break;
                            case false: HomeForm.GoHome(pl); break;
                            default: Other.CloseTell(pl); break;
                        }
                    });
                } else {
                    HomeCore.GoHome(pl, Pos);
                }
            })
        } else {
            NoHome(pl);
        }
    }

    static Edit_Panel(pl) {
        if (Home.hasOwnProperty(pl.realName) && Home[pl.realName].length !== 0) {
            SelectAction(pl, Home[pl.realName], false, id => {
                const fm = Other.SimpleForm();
                fm.addButton('修改名称', 'textures/ui/book_edit_default');
                fm.addButton('更新坐标到当前位置', 'textures/ui/refresh');
                fm.addButton('返回上一页', 'textures/ui/icon_import');
                pl.sendForm(fm, (pl, id1) => {
                    switch (id1) {
                        case 0: HomeForm.Edit_Name(pl, id); break;
                        case 1: HomeCore.UpdatePos(pl, id, pl.blockPos); break;
                        case 2: HomeForm.Panel(pl); break;
                        default: Other.CloseTell(pl); break;
                    }
                })
            })
        } else {
            NoHome(pl);
        }
    }

    static Edit_Name(pl, id) {
        const fm = Other.CustomForm();
        fm.addLabel(`当前正在编辑:\n名称： ${Home[pl.realName][id].name}\n坐标： ${Home[pl.realName][id].x},${Home[pl.realName][id].y},${Home[pl.realName][id].z}\n维度： ${Other.DimidToDimension(Home[pl.realName][id].dimid)}`)
        fm.addInput('输入新名称', 'String', Home[pl.realName][id].name);
        fm.addLabel(Money_Mod.getEconomyStr(pl, Config.Home.EditHome_Pos));
        pl.sendForm(fm, (pl, dt) => {
            if (dt == null) return Other.CloseTell(pl);
            if (dt[1] == '') return pl.tell(Gm_Tell + '输入框为空！');
            HomeCore.UpdateName(pl, id, dt[1]);
        })
    }

    static DeleteHome(pl) {
        if (Home.hasOwnProperty(pl.realName) && Home[pl.realName].length !== 0) {
            SelectAction(pl, Home[pl.realName], false, id => {
                pl.sendModalForm(PLUGIN_INFO.Introduce, `名称： ${Home[pl.realName][id].name}\n坐标： ${Home[pl.realName][id].x},${Home[pl.realName][id].y},${Home[pl.realName][id].z}\n维度： ${Other.DimidToDimension(Home[pl.realName][id].dimid)}\n${Money_Mod.getEconomyStr(pl, Config.Home.DeleteHome)}`, '确认删除', '返回上一页', (_, res) => {
                    switch (res) {
                        case true: HomeCore.DeleteHome(pl, id); break;
                        case false: HomeForm.GoHome(pl); break;
                        default: Other.CloseTell(pl); break;
                    }
                });
            })
        } else {
            NoHome(pl);
        }
    }

    static MergeRequest_Panel(pl) {
        if (!Config.MergeRequest.Enable) return pl.tell(Gm_Tell + `此功能已被管理员关闭！`);
        const fm = Other.SimpleForm();
        fm.addButton('发送请求', 'textures/ui/backup_replace');
        fm.addButton('撤销请求', 'textures/ui/redX1');
        fm.addButton('返回上一页', 'textures/ui/icon_import');
        pl.sendForm(fm, (pl, id) => {
            switch (id) {
                case 0: HomeForm.SendRequest(pl); break;
                case 1: HomeForm.RevokeRequest(pl); break;
                case 2: HomeForm.Panel(pl); break;
                default: Other.CloseTell(pl); break;
            }
        })
    }

    static SendRequest(pl) {
        if (Home.hasOwnProperty(pl.realName) && Home[pl.realName].length !== 0) {
            SelectAction(pl, Home[pl.realName], false, id => {
                pl.sendModalForm(PLUGIN_INFO.Introduce, `名称： ${Home[pl.realName][id].name}\n坐标： ${Home[pl.realName][id].x},${Home[pl.realName][id].y},${Home[pl.realName][id].z}\n维度： ${Other.DimidToDimension(Home[pl.realName][id].dimid)}\n${Money_Mod.getEconomyStr(pl, Config.MergeRequest.sendRequest)}\n\n并入成功后不会删除家园传送点且无法自行撤销\n请谨慎操作`, '发送申请', '返回上一页', (_, res) => {
                    switch (res) {
                        case true: MergeRequest_Core.CerateRequest(pl, id); break;
                        case false: HomeForm.MergeRequest_Panel(pl); break;
                        default: Other.CloseTell(pl); break;
                    }
                });
            })
        } else {
            NoHome(pl);
        }
    }

    static RevokeRequest(pl) {
        const fm = Other.SimpleForm();
        let AllButtons = [];

        // 创建按钮
        MergeRequest.forEach(i => {
            if (i.player == pl.realName) {
                fm.addButton(`时间： ${i.time}b`)
                AllButtons.push(i);
            }
        });

        fm.addButton('返回上一页', 'textures/ui/icon_import');
        pl.sendForm(fm, (pl, id) => {
            if (id == null) return Other.CloseTell(pl);
            if (id == AllButtons.length) return HomeForm.MergeRequest_Panel(pl);
            // 获取索引
            const GUID = AllButtons[id].guid;
            const index = MergeRequest.findIndex(i => i.guid === GUID);
            // 发送确认表单
            pl.sendModalForm(PLUGIN_INFO.Introduce, `时间: ${MergeRequest[index].time}\nGUID: ${MergeRequest[index].guid}\n\n名称： ${MergeRequest[index].data.name}\n坐标： ${MergeRequest[index].data.x},${MergeRequest[index].data.y},${MergeRequest[index].data.z}\n维度： ${Other.DimidToDimension(MergeRequest[index].data.dimid)}\n${Money_Mod.getEconomyStr(pl, Config.MergeRequest.DeleteRequest)}`, '撤销此请求', '返回上一页', (_, res) => {
                switch (res) {
                    case true: MergeRequest_Core.RevokeRequest(pl, index); break;
                    case false: HomeForm.MergeRequest_Panel(pl); break;
                    default: Other.CloseTell(pl); break;
                }
            });
        })
    }
}


function NoHome(pl) {
    return pl.tell(Gm_Tell + '你还没有家园传送点,无法继续执行操作！');
}