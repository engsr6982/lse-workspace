//LiteLoaderScript Dev Helper
/// <reference path="c:\Users\Administrator\Documents\aids/dts/HelperLib-master/src/index.d.ts"/> 

const PLUGINS_NAME = "TpSystem";
const PLUGINS_JS = `TpSystem 传送系统`;
const PLUGINS_VERSION = [0, 0, 1];
const PLUGINS_ZZ = "PPOUI";
const PLUGINS_URL = "";
ll.registerPlugin(
    /* name */ PLUGINS_NAME,
    /* introduction */ PLUGINS_JS,
    /* version */ PLUGINS_VERSION,
    /* otherInformation */ {
        "作者": PLUGINS_ZZ,
        "发布网站": PLUGINS_URL
    }
);
let Gm_Tell = `§e§l[§d${PLUGINS_NAME}§e]§r§a `;
if (File.exists(`.\\plugins\\${PLUGINS_ZZ}\\debug`)) {
    logger.setTitle(PLUGINS_NAME + ' Debug');
    logger.setLogLevel(5);
    logger.warn('你已开启Debug模式，将会输出Debug信息');
    Gm_Tell = `§e§l[§d${PLUGINS_NAME}§c Debug§e]§r§a `;
    mc.listen("onUseItemOn", (pl, it, bl, si) => {
        if (it.type == 'minecraft:stick') {
            pl.runcmd("tps mgr");
        }
    })
}

const _FilePath = `.\\Plugins\\${PLUGINS_ZZ}\\${PLUGINS_NAME}\\`;
const _Config_FilePath = _FilePath + 'Config.json';
const _Home_FilePath = _FilePath + 'Home.json';
const _Warp_FilePath = _FilePath + 'Warp.json';
const _PlayerSeting_FilePath = _FilePath + 'PlayerSeting.json';
const _Death_FilePath = _FilePath + 'Death.json';
const _MergeRequest_FilePath = _FilePath + 'MergeRequest.json';

/**配置文件 */let Config = {};
/**家 */let Home = {};
/**公共传送点 */let Warp = [];
/**玩家配置 */let PlayerSeting = {};
/**死亡信息 */let Death = {};
/**合并请求 */let MergeRequest = [];

/**文件操作 */
class FileOperation {
    /**
     * 读取配置文件
     */
    static ReadFile() {
        /* 检查文件 */
        if (!file.exists(_Home_FilePath)) file.writeTo(_Home_FilePath, '{}');
        if (!file.exists(_Warp_FilePath)) file.writeTo(_Warp_FilePath, '[]');
        if (!file.exists(_PlayerSeting_FilePath)) file.writeTo(_PlayerSeting_FilePath, '{}');
        if (!file.exists(_Config_FilePath)) file.writeTo(_Config_FilePath, JSON.stringify({
            "RandomTransmission": true,
            "RandomTransferSettings": {
                "Min": 1000,
                "Max": 5000
            }
        }, null, '\t'));
        if (!file.exists(_Death_FilePath)) file.writeTo(_Death_FilePath, '{}');
        if (!file.exists(_MergeRequest_FilePath)) file.writeTo(_MergeRequest_FilePath, '[]');
        /* 读取文件 */
        Home = JSON.parse(file.readFrom(_Home_FilePath));
        Warp = JSON.parse(file.readFrom(_Warp_FilePath));
        PlayerSeting = JSON.parse(file.readFrom(_PlayerSeting_FilePath));
        Config = JSON.parse(file.readFrom(_Config_FilePath));
        Death = JSON.parse(file.readFrom(_Death_FilePath));
        MergeRequest = JSON.parse(file.readFrom(_MergeRequest_FilePath));
    }
    /**
     * 保存并重新读取配置文件
     */
    static SaveFile() {
        file.writeTo(_Home_FilePath, JSON.stringify(Home, null, '\t'));
        file.writeTo(_Warp_FilePath, JSON.stringify(Warp, null, '\t'));
        file.writeTo(_PlayerSeting_FilePath, JSON.stringify(PlayerSeting, null, '\t'));
        file.writeTo(_Config_FilePath, JSON.stringify(Config, null, '\t'));
        file.writeTo(_Death_FilePath, JSON.stringify(Death, null, '\t'));
        file.writeTo(_MergeRequest_FilePath, JSON.stringify(MergeRequest, null, '\t'));
        this.ReadFile();
    }
};

FileOperation.ReadFile();


/* 命令注册 */
(() => {
    const Cmd = mc.newCommand('tps', '传送系统GUI', PermType.Any);
    Cmd.setEnum('Option', ['gui', 'mgr', 'reload']);
    Cmd.optional('Selected', ParamType.Enum, 'Option', 1);
    Cmd.overload(['Selected']);
    Cmd.setCallback((_, ori, out, res) => {
        logger.debug(_, ori, out, res);
        switch (res.Selected) {
            case 'mgr':
                if (ori.type !== 0) return out.error('此命令仅限玩家执行');
                if (!ori.player.isOP()) return out.error('仅限管理员使用');
                Seting(ori.player);
                break;
            case 'reload':
                if (ori.type !== 7) return out.error('此命令仅限控制台执行');
                FileOperation.SaveFile();
                out.success('---操作完成---')
                break;
            default:
                if (ori.type !== 0) return out.error('此命令仅限玩家执行');
                Main(ori.player);
                break;
        }
    })
    Cmd.setup();
})()

/* 主表单 */
function Main(pl) {
    const fm = Other.SimpleForm();
    fm.addButton('家园传送', 'textures/ui/village_hero_effect');
    fm.addButton('公共传送', 'textures/ui/icon_best3');
    fm.addButton('玩家传送', 'textures/ui/icon_multiplayer');
    fm.addButton('死亡传送', 'textures/ui/friend_glyph_desaturated');
    fm.addButton('随机传送', 'textures/ui/mashup_world');
    fm.addButton('个人设置', 'textures/ui/icon_setting');
    pl.sendForm(fm, (pl, id) => {
        switch (id) {
            case 0:/* 家园传送 */
                Home_Panel(pl);
                function Home_Panel(pl) {
                    const fm = Other.SimpleForm();
                    fm.addButton('新建家', 'textures/ui/color_plus');
                    fm.addButton('前往家', 'textures/ui/send_icon');
                    fm.addButton('编辑家', 'textures/ui/book_edit_default');
                    fm.addButton('删除家', 'textures/ui/trash_default');
                    fm.addButton('并入公共传送点', 'textures/ui/share_microsoft');
                    fm.addButton('返回上一页', 'textures/ui/icon_import');
                    pl.sendForm(fm, (pl, id) => {
                        switch (id) {
                            case 0:/* 新建家 */
                                ((pl) => {
                                    const fm = Other.CustomForm();
                                    fm.addLabel('');
                                    fm.addInput('输入传送点名称', 'String');
                                    pl.sendForm(fm, (pl, dt) => {
                                        if (dt == null) return Other.CloseTell(pl);
                                        if (dt[1] == '') return pl.tell(Gm_Tell + '输入框为空！')
                                        if (!Home.hasOwnProperty(pl.realName)) {
                                            Home[pl.realName] = [];
                                        }
                                        Home[pl.realName].push({
                                            "name": dt[1],
                                            "x": pl.blockPos.x,
                                            "y": pl.blockPos.y,
                                            "z": pl.blockPos.z,
                                            "dimid": pl.blockPos.dimid
                                        });
                                        FileOperation.SaveFile();
                                        pl.tell(Gm_Tell + '家园已保存');
                                    })
                                })(pl)
                                break;
                            case 1:/* 前往家 */
                                GoHome(pl);
                                function GoHome(pl) {
                                    if (Home.hasOwnProperty(pl.realName)) {
                                        if (Home[pl.realName].length !== 0) {
                                            SelectAction(pl, Home[pl.realName], id => {
                                                const Pos = new IntPos(Home[pl.realName][id].x, Home[pl.realName][id].y, Home[pl.realName][id].z, Home[pl.realName][id].dimid);
                                                if (PlayerSeting[pl.realName].SecondaryConfirmation) {
                                                    pl.sendModalForm(PLUGINS_JS, `名称： ${Home[pl.realName][id].name}\n坐标： ${Home[pl.realName][id].x},${Home[pl.realName][id].y},${Home[pl.realName][id].z}\n维度： ${DimidToDimension(Home[pl.realName][id].dimid)}`, '确认', '返回上一页', (_, res) => {
                                                        switch (res) {
                                                            case true:
                                                                if (pl.teleport(Pos)) {
                                                                    pl.tell(Gm_Tell + '传送成功！');
                                                                } else {
                                                                    pl.tell(Gm_Tell + '传送失败!');
                                                                }
                                                                break;
                                                            case false:
                                                                GoHome(pl);
                                                                break;
                                                            default:
                                                                Other.CloseTell(pl);
                                                                break;
                                                        }
                                                    });
                                                } else {
                                                    if (pl.teleport(Pos)) {
                                                        pl.tell(Gm_Tell + '传送成功！');
                                                    } else {
                                                        pl.tell(Gm_Tell + '传送失败!');
                                                    }
                                                }
                                            })
                                        } else {
                                            NoHome(pl)
                                        }
                                    } else {
                                        NoHome(pl)
                                    }
                                }
                                break;
                            case 2:/* 编辑家 */
                                EditHome(pl);
                                function EditHome(pl) {
                                    if (Home.hasOwnProperty(pl.realName)) {
                                        if (Home[pl.realName].length !== 0) {
                                            SelectAction(pl, Home[pl.realName], (id) => {
                                                const fm = Other.SimpleForm();
                                                fm.addButton('修改名称', 'textures/ui/book_edit_default');
                                                fm.addButton('更新坐标到当前位置', 'textures/ui/refresh');
                                                fm.addButton('返回上一页', 'textures/ui/icon_import');
                                                pl.sendForm(fm, (pl, id1) => {
                                                    switch (id1) {
                                                        case 0:
                                                            EditName(pl);
                                                            function EditName(pl) {
                                                                const fm = Other.CustomForm();
                                                                fm.addLabel(`名称： ${Home[pl.realName][id].name}\n坐标： ${Home[pl.realName][id].x},${Home[pl.realName][id].y},${Home[pl.realName][id].z}\n维度： ${DimidToDimension(Home[pl.realName][id].dimid)}`)
                                                                fm.addInput('修改家名称', 'String', Home[pl.realName][id].name);
                                                                pl.sendForm(fm, (pl, dt) => {
                                                                    if (dt == null) return Other.CloseTell(pl);
                                                                    if (dt[1] == '') return pl.tell(Gm_Tell + '输入框为空！')
                                                                    Home[pl.realName][id].name = dt[1];
                                                                    FileOperation.SaveFile();
                                                                    pl.tell(Gm_Tell + '操作已保存');
                                                                })
                                                            }
                                                            break;
                                                        case 1:
                                                            Home[pl.realName][id].x = pl.blockPos.x;
                                                            Home[pl.realName][id].y = pl.blockPos.y;
                                                            Home[pl.realName][id].z = pl.blockPos.z;
                                                            Home[pl.realName][id].dimid = pl.blockPos.dimid;
                                                            FileOperation.SaveFile();
                                                            pl.tell(Gm_Tell + '更新完成！');
                                                            break;
                                                        case 2:
                                                            EditHome(pl);
                                                            break;
                                                        default:
                                                            Other.CloseTell(pl);
                                                            break;
                                                    }
                                                })
                                            })
                                        } else {
                                            NoHome(pl)
                                        }
                                    } else {
                                        NoHome(pl)
                                    }
                                }
                                break;
                            case 3:/* 删除家 */
                                if (Home.hasOwnProperty(pl.realName)) {
                                    if (Home[pl.realName].length !== 0) {
                                        SelectAction(pl, Home[pl.realName], id => {
                                            pl.sendModalForm(PLUGINS_JS, `名称： ${Home[pl.realName][id].name}\n坐标： ${Home[pl.realName][id].x},${Home[pl.realName][id].y},${Home[pl.realName][id].z}\n维度： ${DimidToDimension(Home[pl.realName][id].dimid)}`, '确认删除', '返回上一页', (_, res) => {
                                                switch (res) {
                                                    case true:
                                                        Home[pl.realName].splice(id, 1);
                                                        FileOperation.SaveFile();
                                                        pl.tell(Gm_Tell + '删除成功！');
                                                        break;
                                                    case false:
                                                        GoHome(pl);
                                                        break;
                                                    default:
                                                        Other.CloseTell(pl);
                                                        break;
                                                }
                                            });
                                        });
                                    } else {
                                        NoHome(pl)
                                    }
                                } else {
                                    NoHome(pl)
                                }
                                break;
                            case 4:/* 并入公共传送点 */
                                MergeRequest_UI(pl);
                                function MergeRequest_UI(pl) {
                                    const fm = Other.SimpleForm();
                                    fm.addButton('发送请求', 'textures/ui/backup_replace');
                                    fm.addButton('撤销请求', 'textures/ui/redX1');
                                    fm.addButton('返回上一页', 'textures/ui/icon_import');
                                    pl.sendForm(fm, (pl, id1) => {
                                        switch (id1) {
                                            case 0:/* 发送请求 */
                                                sendMergeRequest_UI(pl);
                                                function sendMergeRequest_UI(pl) {
                                                    if (Home.hasOwnProperty(pl.realName)) {
                                                        if (Home[pl.realName].length !== 0) {
                                                            SelectAction(pl, Home[pl.realName], (id) => {
                                                                pl.sendModalForm(PLUGINS_JS, `名称： ${Home[pl.realName][id].name}\n坐标： ${Home[pl.realName][id].x},${Home[pl.realName][id].y},${Home[pl.realName][id].z}\n维度： ${DimidToDimension(Home[pl.realName][id].dimid)}\n\n并入成功后不会删除家园传送点且无法自行撤销\n请谨慎操作`, '发送申请', '返回上一页', (_, res) => {
                                                                    switch (res) {
                                                                        case true:
                                                                            MergeRequest.push({
                                                                                player: pl.realName,
                                                                                guid: Other.RandomID(),
                                                                                time: system.getTimeStr(),
                                                                                data: Home[pl.realName][id]
                                                                            });
                                                                            FileOperation.SaveFile();
                                                                            pl.tell(Gm_Tell + '发送成功！');
                                                                            break;
                                                                        case false:
                                                                            sendMergeRequest_UI(pl);
                                                                            break;
                                                                        default:
                                                                            Other.CloseTell(pl);
                                                                            break;
                                                                    }
                                                                });
                                                            })
                                                        } else {
                                                            NoHome(pl)
                                                        }
                                                    } else {
                                                        NoHome(pl)
                                                    }
                                                }
                                                break;
                                            case 1:/* 撤销请求 */
                                                WithdrawalRequest(pl);
                                                function WithdrawalRequest(pl) {
                                                    const fm = Other.SimpleForm();
                                                    let AllButtons = [];
                                                    MergeRequest.forEach(i => {
                                                        if (i.player == pl.realName) {
                                                            fm.addButton(`时间： ${i.time}b`)
                                                            AllButtons.push(i);
                                                        }
                                                    });
                                                    fm.addButton('返回上一页', 'textures/ui/icon_import');
                                                    pl.sendForm(fm, (pl, id) => {
                                                        if (id == null) return Other.CloseTell(pl);
                                                        if (id == AllButtons.length) return MergeRequest_UI(pl);
                                                        const GUID = AllButtons[id].guid;
                                                        const index = MergeRequest.findIndex(i => i.guid === GUID);
                                                        pl.sendModalForm(PLUGINS_JS, `时间: ${MergeRequest[index].time}\nGUID: ${MergeRequest[index].guid}\n\n名称： ${MergeRequest[index].data.name}\n坐标： ${MergeRequest[index].data.x},${MergeRequest[index].data.y},${MergeRequest[index].data.z}\n维度： ${DimidToDimension(MergeRequest[index].data.dimid)}`, '撤销此请求', '返回上一页', (_, res) => {
                                                            switch (res) {
                                                                case true:
                                                                    MergeRequest.splice(index, 1);
                                                                    FileOperation.SaveFile();
                                                                    pl.tell(Gm_Tell + '撤销成功！');
                                                                    break;
                                                                case false:
                                                                    WithdrawalRequest(pl);
                                                                    break;
                                                                default:
                                                                    Other.CloseTell(pl);
                                                                    break;
                                                            }
                                                        });
                                                    })
                                                }
                                                break;
                                            case 2:
                                                Home_Panel(pl);
                                                break;
                                            default:
                                                Other.CloseTell(pl);
                                                break;
                                        }
                                    })
                                }
                                break;
                            case 5:
                                Main(pl);
                                break;
                            default:
                                Other.CloseTell(pl);
                                break;
                        }
                        /**
                         * 无家园传送点
                         * @param {Object} pl 玩家
                         */
                        function NoHome(pl) {
                            pl.tell(Gm_Tell + '你还没有家园传送点,无法继续执行操作！');
                        }
                        /**
                         * 选择传送点
                         * @param {Object} pl 玩家
                         * @param {Array} Array 按钮数组
                         * @param {Number} callback 数组索引ID
                         */
                        function SelectAction(pl, Array, callback) {
                            const fm = Other.SimpleForm();
                            fm.setContent('· 选择一个家');
                            Array.forEach(i => {
                                fm.addButton(`${i.name}\n${DimidToDimension(i.dimid)}  X: ${i.x} Y: ${i.y} Z: ${i.z}`);
                            });
                            fm.addButton('返回上一页', 'textures/ui/icon_import');
                            pl.sendForm(fm, (pl, id) => {
                                if (id == null) return Other.CloseTell(pl);
                                if (id == Array.length) return Home_Panel(pl);
                                callback(id);
                            })
                        }
                    })
                }
                break;
            case 1:/* 公共传送 */
                Warp_Panel(pl);
                function Warp_Panel(pl) {
                    if (Warp.length == 0) return pl.tell(Gm_Tell + '无公共传送点！无法继续执行操作！');
                    SelectAction(pl, Warp, id => {
                        const Pos = new IntPos(Warp[id].x, Warp[id].y, Warp[id].z, Warp[id].dimid);
                        if (PlayerSeting[pl.realName].SecondaryConfirmation) {
                            pl.sendModalForm(PLUGINS_JS, `名称： ${Warp[id].name}\n坐标： ${Warp[id].x},${Warp[id].y},${Warp[id].z}\n维度： ${DimidToDimension(Warp[id].dimid)}`, '确认', '返回上一页', (_, res) => {
                                switch (res) {
                                    case true:
                                        if (pl.teleport(Pos)) {
                                            pl.tell(Gm_Tell + '传送成功！');
                                        } else {
                                            pl.tell(Gm_Tell + '传送失败!');
                                        }
                                        break;
                                    case false:
                                        Warp_Panel(pl);
                                        break;
                                    default:
                                        Other.CloseTell(pl);
                                        break;
                                }
                            });
                        } else {
                            if (pl.teleport(Pos)) {
                                pl.tell(Gm_Tell + '传送成功！');
                            } else {
                                pl.tell(Gm_Tell + '传送失败!');
                            }
                        }
                    });
                    /**
                     * 选择传送点
                     * @param {Object} pl 玩家
                     * @param {Array} Array 按钮数组
                     * @param {Number} callback 数组索引ID
                     */
                    function SelectAction(pl, Array, callback) {
                        const fm = Other.SimpleForm();
                        fm.setContent('· 选择一个公共传送点');
                        Array.forEach(i => {
                            fm.addButton(`${i.name}\n${DimidToDimension(i.dimid)}  X: ${i.x} Y: ${i.y} Z: ${i.z}`);
                        });
                        fm.addButton('返回上一页', 'textures/ui/icon_import');
                        pl.sendForm(fm, (pl, id) => {
                            if (id == null) return Other.CloseTell(pl);
                            if (id == Array.length) return Main(pl);
                            callback(id);
                        })
                    }
                }
                break;
            case 2:/* 玩家传送 */
                TP_Panel(pl);
                function TP_Panel(pl) {
                    const OnlinePlayers = Other.GetOnlinePlayers();
                    let DeliveryType = Array.of('传送至TA', 'TA传送至我');
                    let Hone_List = [];
                    if (Home.hasOwnProperty(pl.realName)) {
                        if (Home[pl.realName].length !== 0) {
                            Home[pl.realName].forEach(i => {
                                Hone_List.push(i.name);
                            });
                            DeliveryType.push('TA传送至家');
                        }
                    }
                    const fm = Other.CustomForm();
                    fm.addDropdown('选择一个玩家', OnlinePlayers, 0);
                    fm.addDropdown('选择一个家', Hone_List);
                    fm.addDropdown('传送类型', DeliveryType, 0);
                    pl.sendForm(fm, (pl, dt) => {
                        if (dt == null) return Other.CloseTell(pl);
                        switch (dt[2]) {
                            case 0:/* ME => TA */
                                if (!PlayerSeting[OnlinePlayers[dt[0]]].AcceptTransmission) return pl.tell(Gm_Tell + '无法传送！对方开启了禁止传送！');
                                Delivery_Core(pl, mc.getPlayer(OnlinePlayers[dt[0]]), 0, '', 'TA传送至我');
                                break;
                            case 1:/* TA => ME */
                                if (!PlayerSeting[OnlinePlayers[dt[0]]].AcceptTransmission) return pl.tell(Gm_Tell + '无法传送！对方开启了禁止传送！');
                                Delivery_Core(mc.getPlayer(OnlinePlayers[dt[0]]), pl, 1, '', '传送至TA');
                                break;
                            case 2:/* TA => Home */
                                if (!PlayerSeting[OnlinePlayers[dt[0]]].AcceptTransmission) return pl.tell(Gm_Tell + '无法传送！对方开启了禁止传送！');
                                Delivery_Core(mc.getPlayer(OnlinePlayers[dt[0]]), pl, 2, { x: Home[pl.realName][dt[1]].x, y: Home[pl.realName][dt[1]].y, z: Home[pl.realName][dt[1]].z, dimid: Home[pl.realName][dt[1]].dimid }, '传送至TA家园');
                                break;
                        }
                    })
                }
                break;
            case 3:/* 死亡传送 */
                ((pl) => {
                    if (Death.hasOwnProperty(pl.realName)) {
                        pl.sendModalForm(PLUGINS_JS, `时间： ${Death[pl.realName].time}\n维度： ${DimidToDimension(Death[pl.realName].dimid)} \nX: ${Death[pl.realName].x}\nY: ${Death[pl.realName].y}\nZ: ${Death[pl.realName].z}`, '确认前往', '返回主页', (pl, res) => {
                            switch (res) {
                                case true:
                                    pl.teleport(new IntPos(Death[pl.realName].x, Death[pl.realName].y, Death[pl.realName].z, Death[pl.realName].dimid));
                                    pl.tell(Gm_Tell + '传送完成！');
                                    break;
                                case false:
                                    Main(pl);
                                    break;
                                default:
                                    Other.CloseTell(pl);
                                    break;
                            }
                        })
                    } else {
                        pl.tell(Gm_Tell + '你还没有死亡信息！');
                    }
                })(pl)
                break;
            case 4:/* 随机传送 */
                ((pl) => {
                    if (!Config.RandomTransmission) return pl.tell(Gm_Tell + '管理员关闭了此功能！');
                    pl.sendModalForm(PLUGINS_JS, `确认执行此操作？`, '确认', '返回', (pl, res) => {
                        switch (res) {
                            case true:
                                const RandomCoordinates = new IntPos(RandomNumber(), 255, RandomNumber(), pl.blockPos.dimid);
                                // if (pl.teleport(RandomCoordinates)) {
                                //     mc.runcmdEx(`effect "${pl.realName}" resistance 30 255 true`);
                                //     pl.tell(Gm_Tell + '传送完成！');
                                // } else {
                                //     pl.tell(Gm_Tell + '传送失败！');
                                // }
                                let count = 5;
                                let Y = 255;
                                const BackUpPos = pl.blockPos;
                                let Pos_Ok = null;
                                (async function (pl) {
                                    // todo mc.getblock方法优化
                                    while (count > 0) {
                                        pl.teleport(RandomCoordinates);

                                        while (Y > 0) {
                                            Pos_Ok = mc.getBlock(RandomCoordinates.x, Y, RandomCoordinates.z, RandomCoordinates.dimid);
                                            if (Pos_Ok == null) {
                                                Pos_Ok = null;
                                                Y = 255;
                                            } else {
                                                Y = Pos_Ok.y;
                                                pl.teleport(RandomCoordinates.x, Y, RandomCoordinates.z, RandomCoordinates.dimid);
                                                pl.tell('传送完成！');
                                            }
                                        }
                                        count--;
                                    }
                                    pl.tell('传送失败！\n获取安全坐标失败!');
                                })(pl)
                                break;
                            case false:
                                Main(pl);
                                break;
                            default:
                                Other.CloseTell(pl);
                                break;
                        }
                    })
                    /**
                     * 正负随机数生成
                     * @returns 
                     */
                    function RandomNumber() {
                        const num = Math.floor(Math.random() * (Config.RandomTransferSettings.Max - Config.RandomTransferSettings.Min + 1)) + Config.RandomTransferSettings.Min;
                        return Math.random() < 0.5 ? -num : num;
                    }
                })(pl);
                break;
            case 5:/* 个人设置 */
                (function (pl) {
                    const fm = Other.CustomForm();
                    fm.addSwitch('接受传送请求', PlayerSeting[pl.realName].AcceptTransmission);
                    fm.addSwitch('传送时二次确认', PlayerSeting[pl.realName].SecondaryConfirmation);
                    pl.sendForm(fm, (pl, dt) => {
                        if (dt == null) return Other.CloseTell(pl);
                        const data = {
                            AcceptTransmission: Boolean(dt[0]).valueOf(),
                            SecondaryConfirmation: Boolean(dt[1]).valueOf()
                        };
                        PlayerSeting[pl.realName] = data;
                        FileOperation.SaveFile();
                        pl.tell(Gm_Tell + '操作已保存');
                    })
                })(pl)
                break;
            default:
                Other.CloseTell(pl);
                break;
        }
    })
}

/* 设置GUI */
function Seting(pl) {
    const fm = Other.SimpleForm();
    fm.addButton('插件设置', 'textures/ui/icon_setting');
    fm.addButton('家园传送点管理', 'textures/ui/village_hero_effect');
    fm.addButton('公共传送点管理', 'textures/ui/icon_best3');
    fm.addButton('合并请求管理', 'textures/ui/book_shiftleft_default');
    fm.addButton('重载配置文件', 'textures/ui/refresh_light');
    pl.sendForm(fm, (pl, id) => {
        switch (id) {
            case 0:/* 插件设置 */
                ((pl) => {
                    const fm = Other.CustomForm();
                    fm.addSwitch('启用随机传送', Config.RandomTransmission);
                    fm.addInput('随机传送 最小值', 'Number', String(Config.RandomTransferSettings.Min));
                    fm.addInput('随机传送 最大值', 'Number', String(Config.RandomTransferSettings.Max));
                    pl.sendForm(fm, (pl, dt) => {
                        if (dt == null) return Other.CloseTell(pl);
                        const data = {
                            Min: Number(dt[1]),
                            Max: Number(dt[2])
                        }
                        Config.RandomTransferSettings = data;
                        Config.RandomTransmission = Boolean(dt[0]).valueOf();
                        FileOperation.SaveFile();
                        pl.tell(Gm_Tell + '操作完成！');
                    })
                })(pl);
                break;
            case 1:/* 家园传送点管理 */
                HomeManagementPanel(pl);
                function HomeManagementPanel(pl) {
                    const fm = Other.SimpleForm();
                    fm.setContent(`· 选择一个玩家以进行管理`);
                    let AllPlayerData = [];/* 缓存键 */
                    for (let player in Home) {
                        fm.addButton(`[玩家]  ${player}\n家园总数: ${Home[player].length}`);
                        AllPlayerData.push(player);
                    }
                    fm.addButton('返回上一页', 'textures/ui/icon_import');
                    pl.sendForm(fm, (pl, id) => {
                        if (id == null) return Other.CloseTell(pl);
                        if (id == AllPlayerData.length) return Seting(pl);
                        ManageSelection(pl);
                        function ManageSelection(pl) {
                            const fm = Other.SimpleForm();
                            fm.setContent(`· 当前正在编辑玩家 ${AllPlayerData[id]} 的家园传送点`);
                            fm.addButton('返回上一页', 'textures/ui/icon_import');
                            fm.addButton('新建家', 'textures/ui/color_plus');
                            Home[AllPlayerData[id]].forEach(i => {
                                fm.addButton(`${i.name}\n${DimidToDimension(i.dimid)}  X: ${i.x} Y: ${i.y} Z: ${i.z}`);
                            });
                            pl.sendForm(fm, (pl, id1) => {
                                if (id1 == null) return Other.CloseTell(pl);
                                if (id1 == 0) return HomeManagementPanel(pl);
                                if (id1 == 1) {
                                    ((pl) => {
                                        const fm = Other.CustomForm();
                                        fm.addInput('输入名称', 'String');
                                        fm.addInput('输入坐标 [使用英文逗号分隔坐标轴]', "String IntPos X,Y,Z", `${pl.blockPos.x},${pl.blockPos.y},${pl.blockPos.z}`);
                                        fm.addDropdown('选择维度', ['主世界', '地狱', '末地'], pl.blockPos.dimid);
                                        pl.sendForm(fm, (pl, dt) => {
                                            if (dt == null) return Other.CloseTell(pl);
                                            if (dt[0] == '') return pl.tell(Gm_Tell + '输入框为空！');
                                            const input = dt[1].split(',');
                                            const input_pos = new IntPos(Number(input[0]), Number(input[1]), Number(input[2]), parseInt(dt[2]));
                                            Home[AllPlayerData[id]].push({
                                                "name": dt[0],
                                                "x": input_pos.x,
                                                "y": input_pos.y,
                                                "z": input_pos.z,
                                                "dimid": input_pos.dimid
                                            });
                                            FileOperation.SaveFile();
                                            pl.tell(Gm_Tell + '添加完成！');
                                        })
                                    })(pl);
                                } else {
                                    id1 = id1 - 2;/* 去除前面两个按钮 */
                                    pl.sendSimpleForm(
                                        PLUGINS_JS,
                                        `当前正在编辑：${AllPlayerData[id]}\n名称： ${Home[AllPlayerData[id]][id1].name}\n坐标： ${Home[AllPlayerData[id]][id1].x},${Home[AllPlayerData[id]][id1].y},${Home[AllPlayerData[id]][id1].z}\n维度： ${DimidToDimension(Home[AllPlayerData[id]][id1].dimid)}`,
                                        ["前往家", "编辑家", "删除家", '返回上一页'],
                                        ["textures/ui/send_icon", "textures/ui/book_edit_default", "textures/ui/trash_default", 'textures/ui/icon_import'],
                                        (pl, id2) => {
                                            switch (id2) {
                                                case 0:
                                                    pl.teleport(new IntPos(Home[AllPlayerData[id]][id1].x, Home[AllPlayerData[id]][id1].y, Home[AllPlayerData[id]][id1].z, Home[AllPlayerData[id]][id1].dimid));
                                                    pl.tell(Gm_Tell + '传送成功！');
                                                    break;
                                                case 1:
                                                    ((pl) => {
                                                        const fm = Other.CustomForm();
                                                        fm.addInput('输入名称', 'String', Home[AllPlayerData[id]][id1].name);
                                                        fm.addInput('输入坐标 [使用英文逗号分隔坐标轴]', "String IntPos X,Y,Z", `${Home[AllPlayerData[id]][id1].x},${Home[AllPlayerData[id]][id1].y},${Home[AllPlayerData[id]][id1].z}`);
                                                        fm.addDropdown('选择维度', ['主世界', '地狱', '末地'], Home[AllPlayerData[id]][id1].dimid);
                                                        pl.sendForm(fm, (pl, dt) => {
                                                            if (dt == null) return Other.CloseTell(pl);
                                                            if (dt[0] == '') return pl.tell(Gm_Tell + '输入框为空！');
                                                            const input = dt[1].split(',');
                                                            const input_pos = new IntPos(Number(input[0]), Number(input[1]), Number(input[2]), parseInt(dt[2]));
                                                            Home[AllPlayerData[id]][id1] = {
                                                                "name": dt[0],
                                                                "x": input_pos.x,
                                                                "y": input_pos.y,
                                                                "z": input_pos.z,
                                                                "dimid": input_pos.dimid
                                                            };
                                                            FileOperation.SaveFile();
                                                            pl.tell(Gm_Tell + '更新成功！');
                                                        })
                                                    })(pl)
                                                    break;
                                                case 2:
                                                    Home[AllPlayerData[id]].splice(id1, 1);
                                                    FileOperation.SaveFile();
                                                    pl.tell(Gm_Tell + '删除成功！');
                                                    break;
                                                case 3:
                                                    ManageSelection(pl);
                                                    break;
                                                default:
                                                    Other.CloseTell(pl);
                                                    break;
                                            }
                                        }
                                    )
                                }
                            })
                        }
                    })
                }
                break;
            case 2:/* 公共传送点管理 */
                WarpManagementPanel(pl);
                function WarpManagementPanel(pl) {
                    const fm = Other.SimpleForm();
                    fm.addButton('返回上一页', 'textures/ui/icon_import');
                    fm.addButton('新建公共传送点', 'textures/ui/color_plus');
                    Warp.forEach(i => {
                        fm.addButton(`${i.name}\n${DimidToDimension(i.dimid)} X: ${i.x} Y: ${i.y} Z: ${i.z}`);
                    });
                    pl.sendForm(fm, (pl, id) => {
                        if (id == null) return Other.CloseTell(pl);
                        if (id == 0) return Seting(pl);
                        if (id == 1) {
                            ((pl) => {
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
                                    FileOperation.SaveFile();
                                    pl.tell(Gm_Tell + '添加完成！');
                                })
                            })(pl);
                        } else {
                            id = id - 2;/* 去除前面两个按钮 */
                            pl.sendSimpleForm(
                                PLUGINS_JS,
                                `当前正在编辑： ${Warp[id].name}\n坐标： ${Warp[id].x},${Warp[id].y},${Warp[id].z}\n维度： ${DimidToDimension(Warp[id].dimid)}`,
                                ["前往此传送点", "编辑此传送点", "删除此传送点", '返回上一页'],
                                ["textures/ui/send_icon", "textures/ui/book_edit_default", "textures/ui/trash_default", 'textures/ui/icon_import'],
                                (pl, id1) => {
                                    switch (id1) {
                                        case 0:
                                            pl.teleport(new IntPos(Warp[id].x, Warp[id].y, Warp[id].z, Warp[id].dimid));
                                            pl.tell(Gm_Tell + '传送成功！');
                                            break;
                                        case 1:
                                            ((pl) => {
                                                const fm = Other.CustomForm();
                                                fm.addInput('输入名称', 'String', Warp[id].name);
                                                fm.addInput('输入坐标 [使用英文逗号分隔坐标轴]', "String IntPos X,Y,Z", `${Warp[id].x},${Warp[id].y},${Warp[id].z}`);
                                                fm.addDropdown('选择维度', ['主世界', '地狱', '末地'], Warp[id].dimid);
                                                pl.sendForm(fm, (pl, dt) => {
                                                    if (dt == null) return Other.CloseTell(pl);
                                                    if (dt[0] == '') return pl.tell(Gm_Tell + '输入框为空！');
                                                    const input = dt[1].split(',');
                                                    const input_pos = new IntPos(Number(input[0]), Number(input[1]), Number(input[2]), parseInt(dt[2]));
                                                    Warp[id] = {
                                                        "name": dt[0],
                                                        "x": input_pos.x,
                                                        "y": input_pos.y,
                                                        "z": input_pos.z,
                                                        "dimid": input_pos.dimid
                                                    };
                                                    FileOperation.SaveFile();
                                                    pl.tell(Gm_Tell + '更新成功！');
                                                })
                                            })(pl)
                                            break;
                                        case 2:
                                            Warp.splice(id, 1);
                                            FileOperation.SaveFile();
                                            pl.tell(Gm_Tell + '删除成功！');
                                            break;
                                        case 3:
                                            WarpManagementPanel(pl);
                                            break;
                                        default:
                                            Other.CloseTell(pl);
                                            break;
                                    }
                                });
                        }
                    })
                }
                break;
            case 3:/* 合并请求管理 */
                MergeRequestPanel(pl);
                function MergeRequestPanel(pl) {
                    const fm = Other.SimpleForm();
                    MergeRequest.forEach(i => {
                        fm.addButton(`[玩家]  ${i.player}\n${i.data.name}  ${DimidToDimension(i.data.dimid)} ${i.data.x},${i.data.y},${i.data.z}`)
                    });
                    fm.addButton('返回上一页', 'textures/ui/icon_import');
                    pl.sendForm(fm, (pl, id) => {
                        if (id == null) return Other.CloseTell(pl);
                        if (id == MergeRequest.length) return Seting(pl);
                        pl.sendSimpleForm(PLUGINS_JS,
                            `[玩家]: ${MergeRequest[id].player}\n[时间]: ${MergeRequest[id].time}\n[GUID]: ${MergeRequest[id].guid}\n[坐标]: ${MergeRequest[id].data.name}  ${DimidToDimension(MergeRequest[id].data.dimid)} ${MergeRequest[id].data.x},${MergeRequest[id].data.y},${MergeRequest[id].data.z}`,
                            ['同意并加入公共传送点', '拒绝并删除', '前往此传送点', '返回上一页'],
                            ['textures/ui/realms_green_check', 'textures/ui/realms_red_x', 'textures/ui/send_icon', 'textures/ui/icon_import'],
                            (pl, id1) => {
                                switch (id1) {
                                    case 0:
                                        Warp.push(MergeRequest[id].data);
                                        MergeRequest.splice(id, 1);
                                        FileOperation.SaveFile();
                                        pl.tell(Gm_Tell + '并入完成！');
                                        break;
                                    case 1:
                                        MergeRequest.splice(id, 1);
                                        FileOperation.SaveFile();
                                        pl.tell(Gm_Tell + '已拒绝并删除！');
                                        break;
                                    case 2:
                                        pl.teleport(new IntPos(MergeRequest[id].data.x, MergeRequest[id].data.y, MergeRequest[id].data.z, MergeRequest[id].data.dimid));
                                        pl.tell(Gm_Tell + '传送成功！');
                                        break;
                                    case 3:
                                        MergeRequestPanel(pl);
                                        break;
                                    default:
                                        Other.CloseTell(pl);
                                        break;
                                }
                            })
                    })
                }
                break;
            case 4:/* 重载配置文件 */
                ((pl) => {
                    FileOperation.SaveFile();
                    FileOperation.ReadFile();
                    pl.tell(Gm_Tell + '操作完成！');
                })(pl)
                break;
            default:
                Other.CloseTell(pl);
                break;
        }
    })
}

/**
 * Dimid转中文维度
 * @param {Number} dimension Dimid
 * @returns 
 */
function DimidToDimension(dimension) {
    switch (dimension) {
        case 0:
            return '主世界';
        case 1:
            return '地狱';
        case 2:
            return '末地';
        default:
            return '未知';
    }
}


/**
 * 传送核心 
 * @param {PlayerEntity} from 发送方玩家 
 * @param {PlayerEntity} to 接收方玩家 
 * @param {Number} type 传送类型 0：收方接收表单  1：发方接受表单
 * @param {Object} pos 目标坐标 {x: 1, y: 1, z: 1, dimid: 0}
 * @param {String} txt 类型描述 
 */
function Delivery_Core(from, to, type, pos, txt) {
    let targetPos;
    if (pos && pos !== '') {
        targetPos = new IntPos(pos.x, pos.y, pos.z, pos.dimid);
    }
    let requestData;
    if (type == 0) {
        requestData = `\n      来自 ${from.realName} 的传送请求\n      类型: ${txt}\n    `;
    } else {
        requestData = `\n      来自 ${to.realName} 的传送请求\n      类型: ${txt}\n    `;
    }
    const options = [
        '接受请求',
        '拒绝请求'
    ];
    const images = [
        'textures/ui/realms_green_check',
        'textures/ui/realms_red_x'
    ]
    const onReceiveRequest = (_pl, id) => {
        switch (id) {
            case 0:/* 接受请求 */
                if (targetPos) {
                    from.teleport(targetPos);
                } else {
                    from.teleport(to.blockPos);
                }
                if (type == 0) {
                    from.tell(`${Gm_Tell}${to.realName}已接受您的传送请求，开始传送...`);
                } else {
                    to.tell(`${Gm_Tell}${from.realName}已接受您的传送请求，开始传送...`);
                }
                break;
            case 1:/* 拒绝请求 */
                if (type == 0) {
                    from.tell(`${Gm_Tell}${to.realName}已拒绝您的传送请求`);
                } else {
                    to.tell(`${Gm_Tell}${from.realName}已拒绝您的传送请求`);
                }
                break;
            default:
                Other.CloseTell(_pl);
                break;
        }
    };
    if (type == 0) {
        /* 发送给目标玩家 */
        to.sendSimpleForm(
            PLUGINS_JS,
            requestData,
            options,
            images,
            onReceiveRequest
        );
    } else {
        /* 发送给发送方玩家 */
        from.sendSimpleForm(
            PLUGINS_JS,
            requestData,
            options,
            images,
            onReceiveRequest
        );
    }
}


const Other = {
    /**
     * 位随机ID
     * @returns ID
     */
    RandomID(num = 16) {
        let str = '';
        const char = 'QWERTYUIOPASDFGHJKLZXCVBNM';
        for (let i = 0; i < num; i++) {
            let index = Math.floor(Math.random() * char.length);
            str += char[index];
        }
        return str;
    },
    /**
     * 获取所有在线玩家名
     * @returns Array[Name, ...]
     */
    GetOnlinePlayers() {
        let OnlinePlayers = [];
        mc.getOnlinePlayers().forEach(pl => {
            if (pl.isSimulatedPlayer()) return;
            OnlinePlayers.push(pl.realName);
        })
        return OnlinePlayers;
    },
    /**
     * 按钮表单
     * @returns 
     */
    SimpleForm() {
        const fm = mc.newSimpleForm();
        fm.setTitle(PLUGINS_JS);
        fm.setContent(`· 选择一个操作`);
        return fm;
    },
    /**
     * 自定义表单
     * @returns 
     */
    CustomForm() {
        const fm = mc.newCustomForm();
        fm.setTitle(PLUGINS_JS);
        return fm;
    },
    /**
     * 放弃表单
     * @param {Object} pl 玩家对象
     */
    CloseTell(pl) {
        pl.tell(Gm_Tell + `表单已放弃`);
    }
}

{
    /* 监听进服事件 */
    mc.listen('onJoin', (pl) => {
        if (pl.isSimulatedPlayer()) return;
        if (!PlayerSeting.hasOwnProperty(pl.realName)) {
            logger.warn(`玩家${pl.realName}的配置不存在，正在新建配置...`);
            PlayerSeting[pl.realName] = {
                AcceptTransmission: true,
                SecondaryConfirmation: true
            }
            FileOperation.SaveFile();
        }
    })
    /* 监听死亡事件 */
    mc.listen('onPlayerDie', (pl, sou) => {
        if (pl.isSimulatedPlayer()) return;
        const data = {
            time: system.getTimeStr(),
            x: pl.blockPos.x,
            y: pl.blockPos.y,
            z: pl.blockPos.z,
            dimid: pl.blockPos.dimid
        }
        Death[pl.realName] = data;
        FileOperation.SaveFile();
    })
}
