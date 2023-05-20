//LiteLoaderScript Dev Helper
/// <reference path="c:\Users\Administrator\Documents\aids/dts/HelperLib-master/src/index.d.ts"/> 

// const PLUGINS_NAME = "TpSystem";
// const PLUGINS_JS = `TpSystem 传送系统`;
// const PLUGINS_VERSION = [0, 0, 8, Version.Dev];
// const PLUGINS_ZZ = "PPOUI";
// const PLUGINS_URL = "";
// ll.registerPlugin(
//         /* name */ PLUGINS_NAME,
//         /* introduction */ PLUGINS_JS,
//         /* version */ PLUGINS_VERSION,
//         /* otherInformation */ {
//         "作者": PLUGINS_ZZ,
//         "发布网站": PLUGINS_URL
//     }
// );
let Gm_Tell = `§e§l[§d${PLUGINS_NAME}§e]§r§a `;
// if (File.exists(`.\\plugins\\${PLUGINS_ZZ}\\debug`)) {
//     logger.setTitle(PLUGINS_NAME + ' Debug');
//     logger.setLogLevel(5);
//     logger.warn('你已开启Debug模式，将会输出Debug信息');
//     Gm_Tell = `§e§l[§d${PLUGINS_NAME}§c Debug§e]§r§a `;
//     mc.listen("onUseItemOn", (pl, it, bl, si) => {
//         if (it.type == 'minecraft:stick') {
//             pl.runcmd("tps ");
//         }
//     })
// }


// const _FilePath = `.\\Plugins\\${PLUGINS_ZZ}\\${PLUGINS_NAME}\\`;

// /**配置文件 */let Config = {
//     "Command": {//命令配置
//         "name": "tps",//命令名称
//         "Describe": "传送系统"//命令描述
//     },
//     "Money": {//经济配置
//         "Enable": true,//开关
//         "LLMoney": true,//是否启用LLMoney
//         "MoneyName": "money"//经济名称
//     },
//     "Home": {//家园传送配置
//         "Enable": true,
//         "CreateHome": 0,//创建家 所需经济
//         "GoHome": 0,//前往家 经济
//         "EditHome": 0,//编辑家 经济
//         "DeleteHome": 0,//删除家 经济
//         "MaxHome": 10//最大家园数量
//     },
//     "Warp": {//公共传送点配置
//         "Enable": true,
//         "GoWarp": 0//前往传送点 经济
//     },
//     "TPA": {//玩家传送配置
//         "Enable": true,
//         "Player_Player": 0,//玩家传玩家 经济
//         "Player_Home": 0,//玩家穿家 经济
//         "CacheExpirationTime": 30,//缓存过期时间
//         "CacheExpirationTimeUnit": "second",//缓存过期时间单位 "second"秒 "minute"分钟
//         "RegularlyCheckExpirationTime": 30//定期检查过期时间 单位： 毫秒
//     },
//     "Death": {//死亡传送配置
//         "Enable": true,
//         "GoDelath": 0,//前往死亡点 经济
//         "sendBackGUI": true//发送死亡返回传送点弹窗 总开关
//     },
//     "TPR": {//随机传送配置
//         "Enable": true,
//         "Min": 1000,//随机坐标最小值
//         "Max": 5000,//最大值
//         "Money": 0,//所需经济
//         "MainWorld": true,//主世界
//         "Infernal": true,//地狱
//         "Terminus": true//末地
//     },
//     "MergeRequest": {//并入公共传送点配置
//         "Enable": true,
//         "sendRequest": 0,//发送请求 经济
//         "DeleteRequest": 0//删除请求 经济
//     },
//     "PlayerSeting": {//玩家配置默认
//         "AcceptTransmission": true,//接受传送请求
//         "SecondaryConfirmation": true,//传送二次确认
//         "SendRequestPopup": true,//传送请求弹窗
//         "DeathPopup": true//死亡弹出返回死亡点 子开关
//     },
//     "AutoCompleteAttributes": true//自动补齐属性
// };
// /**家 */let Home = {};
// /**公共传送点 */let Warp = [];
// /**玩家配置 */let PlayerSeting = {};
// /**死亡信息 */let Death = {};
// /**合并请求 */let MergeRequest = [];
// /**表单UI */let MainUI = {};
// /**传送缓存 */let TPACache = [];

/**文件操作 */
// class FileOperation {
// static _Config_FilePath = _FilePath + 'Config.json';
// static _Home_FilePath = _FilePath + 'Home.json';
// static _Warp_FilePath = _FilePath + 'Warp.json';
// static _PlayerSeting_FilePath = _FilePath + 'PlayerSeting.json';
// static _Death_FilePath = _FilePath + 'Death.json';
// static _MergeRequest_FilePath = _FilePath + 'MergeRequest.json';
// static _MainUI = _FilePath + 'GUI\\MainUI.json';

//     /**
//      * 读取配置文件
//      */
//     static async ReadFile() {
//         /* 检查文件 */
//         try {
//             if (!file.exists(this._Home_FilePath)) file.writeTo(this._Home_FilePath, '{}');
//             if (!file.exists(this._Warp_FilePath)) file.writeTo(this._Warp_FilePath, '[]');
//             if (!file.exists(this._PlayerSeting_FilePath)) file.writeTo(this._PlayerSeting_FilePath, '{}');
//             if (!file.exists(this._Config_FilePath)) file.writeTo(this._Config_FilePath, JSON.stringify(
//                 {
//                     "Command": {//命令配置
//                         "name": "tps",//命令名称
//                         "Describe": "传送系统"//命令描述
//                     },
//                     "Money": {//经济配置
//                         "Enable": true,//开关
//                         "LLMoney": true,//是否启用LLMoney
//                         "MoneyName": "money"//经济名称
//                     },
//                     "Home": {//家园传送配置
//                         "Enable": true,//todo
//                         "CreateHome": 0,//创建家 所需经济
//                         "GoHome": 0,//前往家 经济
//                         "EditHome": 0,//编辑家 经济
//                         "DeleteHome": 0,//删除家 经济
//                         "MaxHome": 10//最大家园数量
//                     },
//                     "Warp": {//公共传送点配置
//                         "Enable": true,
//                         "GoWarp": 0//前往传送点 经济
//                     },
//                     "TPA": {//玩家传送配置
//                         "Enable": true,
//                         "Player_Player": 0,//玩家传玩家 经济
//                         "Player_Home": 0,//玩家穿家 经济
//                         "CacheExpirationTime": 30,//缓存过期时间//todo
//                         "CacheExpirationTimeUnit": "second",//缓存过期时间单位 "second"秒 "minute"分钟//todo
//                         "RegularlyCheckExpirationTime": 30//定期检查过期时间 单位： 毫秒//todo
//                     },
//                     "Death": {//死亡传送配置
//                         "Enable": true,
//                         "GoDelath": 0,//前往死亡点 经济
//                         "sendBackGUI": false//发送死亡返回传送点弹窗 总开关
//                     },
//                     "TPR": {//随机传送配置
//                         "Enable": true,
//                         "Min": 1000,//随机坐标最小值
//                         "Max": 5000,//最大值
//                         "Money": 0,//所需经济
//                         "MainWorld": true,//主世界
//                         "Infernal": true,//地狱
//                         "Terminus": true//末地
//                     },
//                     "MergeRequest": {//并入公共传送点配置
//                         "Enable": true,
//                         "sendRequest": 0,//发送请求 经济
//                         "DeleteRequest": 0//删除请求 经济
//                     },
//                     "PlayerSeting": {//玩家配置默认
//                         "AcceptTransmission": true,//接受传送请求
//                         "SecondaryConfirmation": true,//传送二次确认
//                         "SendRequestPopup": true,//传送请求弹窗
//                         "DeathPopup": true//死亡弹出返回死亡点 子开关
//                     },
//                     "AutoCompleteAttributes": true//自动补齐属性
//                 }
//                 , null, '\t'));
//             if (!file.exists(this._Death_FilePath)) file.writeTo(this._Death_FilePath, '{}');
//             if (!file.exists(this._MergeRequest_FilePath)) file.writeTo(this._MergeRequest_FilePath, '[]');
//             if (!file.exists(this._MainUI)) file.writeTo(this._MainUI, JSON.stringify(
//                 [
//                     { "name": '家园传送', "image": 'textures/ui/village_hero_effect', "type": "inside", "open": "HomeUi" },
//                     { "name": '公共传送', "image": 'textures/ui/icon_best3', "type": "inside", "open": "WarpUi" },
//                     { "name": '玩家传送', "image": 'textures/ui/icon_multiplayer', "type": "inside", "open": "PlayerUi" },
//                     { "name": '死亡传送', "image": 'textures/ui/friend_glyph_desaturated', "type": "inside", "open": "DeathUi" },
//                     { "name": '随机传送', "image": 'textures/ui/mashup_world', "type": "inside", "open": "RandomUi" },
//                     { "name": '个人设置', "image": 'textures/ui/icon_setting', "type": "inside", "open": "SetingUi" }
//                 ]
//                 , null, '\t'
//             ))
//             /* 读取文件 */
//             Home = JSON.parse(file.readFrom(this._Home_FilePath));
//             Warp = JSON.parse(file.readFrom(this._Warp_FilePath));
//             PlayerSeting = JSON.parse(file.readFrom(this._PlayerSeting_FilePath));
//             Config = JSON.parse(file.readFrom(this._Config_FilePath));
//             Death = JSON.parse(file.readFrom(this._Death_FilePath));
//             MergeRequest = JSON.parse(file.readFrom(this._MergeRequest_FilePath));
//             MainUI = JSON.parse(file.readFrom(this._MainUI));
//         } catch (e) {
//             throw new Error(e);
//         }
//     }
//     /**
//      * 保存并重新读取配置文件
//      */
//     static async SaveFile() {
//         try {
//             file.writeTo(this._Home_FilePath, JSON.stringify(Home, null, '\t'));
//             file.writeTo(this._Warp_FilePath, JSON.stringify(Warp, null, '\t'));
//             file.writeTo(this._PlayerSeting_FilePath, JSON.stringify(PlayerSeting, null, '\t'));
//             file.writeTo(this._Config_FilePath, JSON.stringify(Config, null, '\t'));
//             file.writeTo(this._Death_FilePath, JSON.stringify(Death, null, '\t'));
//             file.writeTo(this._MergeRequest_FilePath, JSON.stringify(MergeRequest, null, '\t'));
//             file.writeTo(this._MainUI, JSON.stringify(MainUI, null, '\t'));
//             this.ReadFile();
//         } catch (e) {
//             throw new Error(e);
//         }
//     }
// };
/**经济模块 */
// class Money_Mod {
//     static getEconomyStr(pl, dmoney) {
//         let mons;
//         if (Config.Money.LLMoney) {
//             mons = money.get(pl.xuid);
//         } else {
//             mons = pl.getScore(Config.Money.MoneyName);
//         }
//         if (!Config.Money.Enable) dmoney = 0;//关闭经济，无需扣费
//         return `此次操作需消耗[${dmoney}]${Config.Money.MoneyName}, 当前${Config.Money.MoneyName}: ${mons}`;
//     }
//     /**
//      * 获取玩家经济
//      * @param {Object} pl 玩家对象
//      * @returns 
//      */
//     static getEconomy(pl) {
//         if (Config.Money.LLMoney) {
//             return money.get(pl.xuid);
//         } else {
//             return pl.getScore(Config.Money.MoneyName);
//         }
//     }
//     /**
//      * 扣除经济
//      * @param {Object} pl 
//      * @param {Number} Money 
//      * @returns 
//      */
//     static DeductEconomy(pl, delMoney) {
//         if (Config.Money.Enable) {
//             // 启用经济
//             if (Config.Money.LLMoney) {
//                 // LL
//                 if (money.get(pl.xuid) >= delMoney) {
//                     // 经济充足
//                     return money.reduce(pl.xuid, Number(delMoney));
//                 } else {
//                     pl.tell(Gm_Tell + `${Config.Money.MoneyName}不足！ 无法继续操作!`);
//                     return false;
//                 }
//             } else {
//                 // Socre
//                 if (pl.getScore(Config.Money.MoneyName) >= delMoney) {
//                     return pl.reduceScore(Config.Money.MoneyName, Number(delMoney));
//                 } else {
//                     pl.tell(Gm_Tell + `${Config.Money.MoneyName}不足！ 无法继续操作!`);
//                     return false
//                 }
//             }
//         } else {
//             //关闭经济
//             return true;
//         }
//     }
// }
/**时间模块 */
// class Time_Mod {
//     /**
//      *  根据传入日期时间判断
//      * @param {String} time 日期  2023-01-01 10:30:20
//      * @returns true/1 解 | false/0 封
//      */
//     static CheckTime(time) {
//         if (new Date(time).getTime() <= new Date().getTime()) {
//             return true;
//         }
//         else {
//             return false;
//         }
//     }
//     /**
//      * 获取结束时间
//      * @param {number} time 时间（单位：秒或分钟）
//      * @param {string} [unit='minute'] 时间单位，可选值为 'second' 或 'minute'，默认为 'minute'
//      * @returns {string} 格式化后的结束时间字符串
//      */
//     static getEndTimes(time, unit = 'minute') {
//         const date = new Date(Date.now() + time * (unit === 'second' ? 1000 : 60000));
//         const y = date.getFullYear();
//         const m = (date.getMonth() + 1).toString().padStart(2, '0');
//         const d = date.getDate().toString().padStart(2, '0');
//         const h = date.getHours().toString().padStart(2, '0');
//         const i = date.getMinutes().toString().padStart(2, '0');
//         const s = date.getSeconds().toString().padStart(2, '0');
//         return `${y}-${m}-${d} ${h}:${i}:${s}`;
//     }
// }
/**其他模块 */
// class Other {
//     /**
//      * Dimid转中文维度
//      * @param {Number} dimension Dimid
//      * @returns 
//      */
//     static DimidToDimension(dimension) {
//         switch (dimension) {
//             case 0: return '主世界';
//             case 1: return '地狱';
//             case 2: return '末地';
//             default: return '未知';
//         }
//     }
//     /**
//      * 位随机ID
//      * @returns ID
//      */
//     static RandomID(num = 16, char = 'QWERTYUIOPASDFGHJKLZXCVBNM') {
//         let str = '';
//         for (let i = 0; i < num; i++) {
//             let index = Math.floor(Math.random() * char.length);
//             str += char[index];
//         }
//         return str;
//     }
//     /**
//      * 获取所有在线玩家名
//      * @returns Array[Name, ...]
//      */
//     static GetOnlinePlayers() {
//         let OnlinePlayers = [];
//         mc.getOnlinePlayers().forEach(pl => {
//             if (pl.isSimulatedPlayer()) return;
//             OnlinePlayers.push(pl.realName);
//         })
//         return OnlinePlayers;
//     }
//     /**
//      * 按钮表单
//      * @returns 
//      */
//     static SimpleForm() {
//         const fm = mc.newSimpleForm();
//         fm.setTitle(PLUGINS_JS);
//         fm.setContent(`· 选择一个操作`);
//         return fm;
//     }
//     /**
//      * 自定义表单
//      * @returns 
//      */
//     static CustomForm() {
//         const fm = mc.newCustomForm();
//         fm.setTitle(PLUGINS_JS);
//         return fm;
//     }
//     /**
//      * 放弃表单
//      * @param {Object} pl 玩家对象
//      */
//     static CloseTell(pl) {
//         pl.tell(Gm_Tell + `表单已放弃`);
//     }
// }
/**家园传送表单 */
class HomeForms {
    static Home_Panel(pl) {
        const fm = Other.SimpleForm();
        fm.addButton('新建家', 'textures/ui/color_plus');
        fm.addButton('前往家', 'textures/ui/send_icon');
        fm.addButton('编辑家', 'textures/ui/book_edit_default');
        fm.addButton('删除家', 'textures/ui/trash_default');
        fm.addButton('并入公共传送点', 'textures/ui/share_microsoft');
        fm.addButton('返回上一页', 'textures/ui/icon_import');
        pl.sendForm(fm, (pl, id) => {
            switch (id) {
                case 0:
                    HomeForms.CreateHome(pl);
                    break;
                case 1:/* 前往家 */
                    HomeForms.GoHome(pl);
                    break;
                case 2:/* 编辑家 */
                    HomeForms.EditHome(pl);
                    break;
                case 3:/* 删除家 */
                    HomeForms.DeleteHome(pl);
                    break;
                case 4:/* 并入公共传送点 */
                    HomeForms.MergeRequest_UI(pl);
                    break;
                case 5:
                    Main(pl, MainUI);
                    break;
                default:
                    Other.CloseTell(pl);
                    break;
            }
        })
    }
    static CreateHome(pl) {
        const fm = Other.CustomForm();
        fm.addLabel(Money_Mod.getEconomyStr(pl, Config.Home.CreateHome));
        fm.addInput('输入传送点名称', 'String');
        pl.sendForm(fm, (pl, dt) => {
            if (dt == null) return Other.CloseTell(pl);
            if (dt[1] == '') return pl.tell(Gm_Tell + '输入框为空！');
            // if (!Home.hasOwnProperty(pl.realName)) {
            //     Home[pl.realName] = [];
            // }
            // if (Money_Mod.DeductEconomy(pl, Config.Home.CreateHome)) {
            //     if (Home[pl.realName].length <= Config.Home.MaxHome) {
            //         Home[pl.realName].push({
            //             "name": dt[1],
            //             "x": pl.blockPos.x,
            //             "y": pl.blockPos.y,
            //             "z": pl.blockPos.z,
            //             "dimid": pl.blockPos.dimid
            //         });
            //         FileOperation.SaveFile();
            //         pl.tell(Gm_Tell + '家园已保存');
            //     } else {
            //         pl.tell(Gm_Tell + `创建家园传送点[${dt[1]}失败！\n最大家园数量：${Config.Home.MaxHome}]`);
            //     }
            // }
        })
    }
    static GoHome(pl) {
        if (Home.hasOwnProperty(pl.realName)) {
            if (Home[pl.realName].length !== 0) {
                HomeForms.SelectAction(pl, Home[pl.realName], id => {
                    const Pos = new IntPos(Home[pl.realName][id].x, Home[pl.realName][id].y, Home[pl.realName][id].z, Home[pl.realName][id].dimid);
                    if (PlayerSeting[pl.realName].SecondaryConfirmation) {
                        pl.sendModalForm(PLUGINS_JS, `名称： ${Home[pl.realName][id].name}\n坐标： ${Home[pl.realName][id].x},${Home[pl.realName][id].y},${Home[pl.realName][id].z}\n维度： ${Other.DimidToDimension(Home[pl.realName][id].dimid)}\n${Money_Mod.getEconomyStr(pl, Config.Home.GoHome)}`, '确认', '返回上一页', (_, res) => {
                            switch (res) {
                                case true:
                                    // if (Money_Mod.DeductEconomy(pl, Config.Home.GoHome)) {
                                    //     if (pl.teleport(Pos)) {
                                    //         pl.tell(Gm_Tell + '传送成功！');
                                    //     } else {
                                    //         pl.tell(Gm_Tell + '传送失败!');
                                    //     }
                                    // }
                                    break;
                                case false:
                                    HomeForms.GoHome(pl);
                                    break;
                                default:
                                    Other.CloseTell(pl);
                                    break;
                            }
                        });
                    } else {
                        if (Money_Mod.DeductEconomy(pl, Config.Home.GoHome)) {
                            if (pl.teleport(Pos)) {
                                pl.tell(Gm_Tell + '传送成功！');
                            } else {
                                pl.tell(Gm_Tell + '传送失败!');
                            }
                        }
                    }
                })
            } else {
                HomeForms.NoHome(pl)
            }
        } else {
            HomeForms.NoHome(pl)
        }
    }
    static EditHome(pl) {
        if (Home.hasOwnProperty(pl.realName)) {
            if (Home[pl.realName].length !== 0) {
                HomeForms.SelectAction(pl, Home[pl.realName], (id) => {
                    const fm = Other.SimpleForm();
                    fm.setContent(Money_Mod.getEconomyStr(pl, Config.Home.EditHome));
                    fm.addButton('修改名称', 'textures/ui/book_edit_default');
                    fm.addButton('更新坐标到当前位置', 'textures/ui/refresh');
                    fm.addButton('返回上一页', 'textures/ui/icon_import');
                    pl.sendForm(fm, (pl, id1) => {
                        switch (id1) {
                            case 0:
                                if (Money_Mod.DeductEconomy(pl, Config.Home.EditHome)) { EditHomeName(pl); }
                                function EditHomeName(pl) {
                                    const fm = Other.CustomForm();
                                    fm.addLabel(`名称： ${Home[pl.realName][id].name}\n坐标： ${Home[pl.realName][id].x},${Home[pl.realName][id].y},${Home[pl.realName][id].z}\n维度： ${Other.DimidToDimension(Home[pl.realName][id].dimid)}`)
                                    fm.addInput('修改家名称', 'String', Home[pl.realName][id].name);
                                    pl.sendForm(fm, (pl, dt) => {
                                        if (dt == null) return Other.CloseTell(pl);
                                        if (dt[1] == '') return pl.tell(Gm_Tell + '输入框为空！')
                                        // Home[pl.realName][id].name = dt[1];
                                        // FileOperation.SaveFile();
                                        // pl.tell(Gm_Tell + '操作已保存');
                                    })
                                }
                                break;
                            case 1:
                                // if (Money_Mod.DeductEconomy(pl, Config.Home.EditHome)) {
                                //     Home[pl.realName][id].x = pl.blockPos.x;
                                //     Home[pl.realName][id].y = pl.blockPos.y;
                                //     Home[pl.realName][id].z = pl.blockPos.z;
                                //     Home[pl.realName][id].dimid = pl.blockPos.dimid;
                                //     FileOperation.SaveFile();
                                //     pl.tell(Gm_Tell + '更新完成！');
                                // }
                                break;
                            case 2:
                                HomeForms.EditHome(pl);
                                break;
                            default:
                                Other.CloseTell(pl);
                                break;
                        }
                    })
                })
            } else {
                HomeForms.NoHome(pl)
            }
        } else {
            HomeForms.NoHome(pl)
        }
    }
    static DeleteHome(pl) {
        if (Home.hasOwnProperty(pl.realName)) {
            if (Home[pl.realName].length !== 0) {
                HomeForms.SelectAction(pl, Home[pl.realName], id => {
                    pl.sendModalForm(PLUGINS_JS, `名称： ${Home[pl.realName][id].name}\n坐标： ${Home[pl.realName][id].x},${Home[pl.realName][id].y},${Home[pl.realName][id].z}\n维度： ${Other.DimidToDimension(Home[pl.realName][id].dimid)}\n${Money_Mod.getEconomyStr(pl, Config.Home.DeleteHome)}`, '确认删除', '返回上一页', (_, res) => {
                        switch (res) {
                            case true:
                                // if (Money_Mod.DeductEconomy(pl, Config.Home.DeleteHome)) {
                                //     Home[pl.realName].splice(id, 1);
                                //     FileOperation.SaveFile();
                                //     pl.tell(Gm_Tell + '删除成功！');
                                // }
                                break;
                            case false:
                                HomeForms.GoHome(pl);
                                break;
                            default:
                                Other.CloseTell(pl);
                                break;
                        }
                    });
                });
            } else {
                HomeForms.NoHome(pl)
            }
        } else {
            HomeForms.NoHome(pl)
        }
    }
    static MergeRequest_UI(pl) {
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
                                HomeForms.SelectAction(pl, Home[pl.realName], (id) => {
                                    pl.sendModalForm(PLUGINS_JS, `名称： ${Home[pl.realName][id].name}\n坐标： ${Home[pl.realName][id].x},${Home[pl.realName][id].y},${Home[pl.realName][id].z}\n维度： ${Other.DimidToDimension(Home[pl.realName][id].dimid)}\n${Money_Mod.getEconomyStr(pl, Config.MergeRequest.sendRequest)}\n\n并入成功后不会删除家园传送点且无法自行撤销\n请谨慎操作`, '发送申请', '返回上一页', (_, res) => {
                                        switch (res) {
                                            case true:
                                                if (Money_Mod.DeductEconomy(pl, Config.MergeRequest.sendRequest)) {
                                                    MergeRequest.push({
                                                        player: pl.realName,
                                                        guid: Other.RandomID(),
                                                        time: system.getTimeStr(),
                                                        data: Home[pl.realName][id]
                                                    });
                                                    FileOperation.SaveFile();
                                                    pl.tell(Gm_Tell + '发送成功！');
                                                }
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
                                HomeForms.NoHome(pl)
                            }
                        } else {
                            HomeForms.NoHome(pl)
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
                            pl.sendModalForm(PLUGINS_JS, `时间: ${MergeRequest[index].time}\nGUID: ${MergeRequest[index].guid}\n\n名称： ${MergeRequest[index].data.name}\n坐标： ${MergeRequest[index].data.x},${MergeRequest[index].data.y},${MergeRequest[index].data.z}\n维度： ${Other.DimidToDimension(MergeRequest[index].data.dimid)}\n${Money_Mod.getEconomyStr(pl, Config.MergeRequest.DeleteRequest)}`, '撤销此请求', '返回上一页', (_, res) => {
                                switch (res) {
                                    case true:
                                        if (Money_Mod.DeductEconomy(pl, Config.MergeRequest.DeleteRequest)) {
                                            MergeRequest.splice(index, 1);
                                            FileOperation.SaveFile();
                                            pl.tell(Gm_Tell + '撤销成功！');
                                        }
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
                    HomeForms.Home_Panel(pl);
                    break;
                default:
                    Other.CloseTell(pl);
                    break;
            }
        })
    }
    /**
     * 无家园传送点
     * @param {Object} pl 玩家
     */
    static NoHome(pl) {
        pl.tell(Gm_Tell + '你还没有家园传送点,无法继续执行操作！');
    }
    /**
     * 选择传送点
     * @param {Object} pl 玩家
     * @param {Array} Array 按钮数组
     * @param {Number} callback 数组索引ID
     */
    static SelectAction(pl, Array, callback) {
        const fm = Other.SimpleForm();
        fm.setContent('· 选择一个家');
        Array.forEach(i => {
            fm.addButton(`${i.name}\n${Other.DimidToDimension(i.dimid)}  X: ${i.x} Y: ${i.y} Z: ${i.z}`);
        });
        fm.addButton('返回上一页', 'textures/ui/icon_import');
        pl.sendForm(fm, (pl, id) => {
            if (id == null) return Other.CloseTell(pl);
            if (id == Array.length) return HomeForms.Home_Panel(pl);
            callback(id);
        })
    }
}
/**其他表单 */
class Forms {
    static PublicTransportation(pl) {
        if (Warp.length == 0) return pl.tell(Gm_Tell + '无公共传送点！无法继续执行操作！');
        SelectAction(pl, Warp, id => {
            const Pos = new IntPos(Warp[id].x, Warp[id].y, Warp[id].z, Warp[id].dimid);
            if (PlayerSeting[pl.realName].SecondaryConfirmation) {
                pl.sendModalForm(PLUGINS_JS, `名称： ${Warp[id].name}\n坐标： ${Warp[id].x},${Warp[id].y},${Warp[id].z}\n维度： ${Other.DimidToDimension(Warp[id].dimid)}\n${Money_Mod.getEconomyStr(pl, Config.Warp.GoWarp)}`, '确认', '返回上一页', (_, res) => {
                    switch (res) {
                        case true:
                            // if (Money_Mod.DeductEconomy(pl, Config.Warp.GoWarp)) {
                            //     if (pl.teleport(Pos)) {
                            //         pl.tell(Gm_Tell + '传送成功！');
                            //     } else {
                            //         pl.tell(Gm_Tell + '传送失败!');
                            //     }
                            // }
                            break;
                        case false:
                            Forms.PublicTransportation(pl);
                            break;
                        default:
                            Other.CloseTell(pl);
                            break;
                    }
                });
            } else {
                if (Money_Mod.DeductEconomy(pl, Config.Warp.GoWarp)) {
                    if (pl.teleport(Pos)) {
                        pl.tell(Gm_Tell + '传送成功！');
                    } else {
                        pl.tell(Gm_Tell + '传送失败!');
                    }
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
                fm.addButton(`${i.name}\n${Other.DimidToDimension(i.dimid)}  X: ${i.x} Y: ${i.y} Z: ${i.z}`);
            });
            fm.addButton('返回上一页', 'textures/ui/icon_import');
            pl.sendForm(fm, (pl, id) => {
                if (id == null) return Other.CloseTell(pl);
                if (id == Array.length) return Main(pl, MainUI);
                callback(id);
            })
        }
    }
    static PlayerTransportation(pl) {
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
        fm.addLabel(`当前${Config.Money.MoneyName}: ${Money_Mod.getEconomy(pl)}    玩家传玩家消耗：${Config.TPA.Player_Player}  玩家传家消耗：${Config.TPA.Player_Home}`);
        pl.sendForm(fm, (pl, dt) => {
            if (dt == null) return Other.CloseTell(pl);
            switch (dt[2]) {
                case 0:/* ME => TA */
                    if (!PlayerSeting[OnlinePlayers[dt[0]]].AcceptTransmission) return pl.tell(Gm_Tell + '无法传送！对方开启了禁止传送！');
                    if (Money_Mod.DeductEconomy(pl, Config.TPA.Player_Player)) {
                        Delivery_Core(pl, mc.getPlayer(OnlinePlayers[dt[0]]), 0, '', 'TA传送至我');
                    } break;
                case 1:/* TA => ME */
                    if (!PlayerSeting[OnlinePlayers[dt[0]]].AcceptTransmission) return pl.tell(Gm_Tell + '无法传送！对方开启了禁止传送！');
                    if (Money_Mod.DeductEconomy(pl, Config.TPA.Player_Player)) {
                        Delivery_Core(mc.getPlayer(OnlinePlayers[dt[0]]), pl, 1, '', '传送至TA');
                    } break;
                case 2:/* TA => Home */
                    if (!PlayerSeting[OnlinePlayers[dt[0]]].AcceptTransmission) return pl.tell(Gm_Tell + '无法传送！对方开启了禁止传送！');
                    if (Money_Mod.DeductEconomy(pl, Config.TPA.Player_Home)) {
                        Delivery_Core(mc.getPlayer(OnlinePlayers[dt[0]]), pl, 2, { x: Home[pl.realName][dt[1]].x, y: Home[pl.realName][dt[1]].y, z: Home[pl.realName][dt[1]].z, dimid: Home[pl.realName][dt[1]].dimid }, '传送至TA家园');
                    } break;
            }
        })
    }
    static DeathTransportation(pl) {
        if (Death.hasOwnProperty(pl.realName)) {
            pl.sendModalForm(PLUGINS_JS, `时间： ${Death[pl.realName].time}\n维度： ${Other.DimidToDimension(Death[pl.realName].dimid)} \nX: ${Death[pl.realName].x}\nY: ${Death[pl.realName].y}\nZ: ${Death[pl.realName].z}\n${Money_Mod.getEconomyStr(pl, Config.Death.GoDelath)}`, '确认前往', '返回主页', (pl, res) => {
                switch (res) {
                    case true:
                        if (Money_Mod.DeductEconomy(pl, Config.Death.GoDelath)) {
                            pl.teleport(new IntPos(Death[pl.realName].x, Death[pl.realName].y, Death[pl.realName].z, Death[pl.realName].dimid));
                            pl.tell(Gm_Tell + '传送完成！');
                        }
                        break;
                    case false:
                        Main(pl, MainUI);
                        break;
                    default:
                        Other.CloseTell(pl);
                        break;
                }
            })
        } else {
            pl.tell(Gm_Tell + '你还没有死亡信息！');
        }
    }
    static RandomTransportation(pl) {
        if (!Config.TPR.Enable) return pl.tell(Gm_Tell + '管理员关闭了此功能！');
        pl.sendModalForm(PLUGINS_JS, `确认执行此操作？\n${Money_Mod.getEconomyStr(pl, Config.TPR.Money)}`, '确认', '返回', (pl, res) => {
            switch (res) {
                case true:
                    Forms.RandomTeleportCore(pl);
                    break;
                case false:
                    Main(pl, MainUI);
                    break;
                default:
                    Other.CloseTell(pl);
                    break;
            }
        })
    }
    static PersonalSettings(pl) {
        const fm = Other.CustomForm();
        fm.addSwitch('接受传送请求', PlayerSeting[pl.realName].AcceptTransmission);
        fm.addSwitch('传送时二次确认', PlayerSeting[pl.realName].SecondaryConfirmation);
        fm.addSwitch('收到传送请求时是否弹窗', PlayerSeting[pl.realName].SendRequestPopup);
        fm.addSwitch('死亡后弹出返回死亡点弹窗', PlayerSeting[pl.realName].DeathPopup);
        pl.sendForm(fm, (pl, dt) => {
            if (dt == null) return Other.CloseTell(pl);
            const data = {
                AcceptTransmission: Boolean(dt[0]).valueOf(),
                SecondaryConfirmation: Boolean(dt[1]).valueOf(),
                SendRequestPopup: Boolean(dt[2]).valueOf(),
                DeathPopup: Boolean(dt[3]).valueOf()
            };
            PlayerSeting[pl.realName] = data;
            FileOperation.SaveFile();
            pl.tell(Gm_Tell + '操作已保存');
        })
    }
    // static async RandomTeleportCore(pl) {
    //     if (Money_Mod.DeductEconomy(pl, Config.TPR.Money)) {
    //         if (pl.blockPos.dimid == 0 && Config.TPR.MainWorld == false) return pl.tell(Gm_Tell + `随机传送在当前维度不可用！`);//主世界关闭
    //         if (pl.blockPos.dimid == 1 && Config.TPR.Infernal == false) return pl.tell(Gm_Tell + `随机传送在当前维度不可用！`);//地狱关闭
    //         if (pl.blockPos.dimid == 2 && Config.TPR.Terminus == false) return pl.tell(Gm_Tell + `随机传送在当前维度不可用！`);//末地关闭
    //         pl.tell(Gm_Tell + `准备传送...`);
    //         let Pos_Y = 500;
    //         let to_Pos = new IntPos(RandomCoordinates(), Pos_Y, RandomCoordinates(), pl.blockPos.dimid);
    //         let Block_Obj = mc.getBlock(to_Pos);
    //         const BackUpPos = pl.blockPos;

    //         pl.teleport(to_Pos);
    //         pl.tell(Gm_Tell + `等待区块加载...`);
    //         const ID = setInterval(() => {
    //             if (pl.blockPos.y != Pos_Y) {
    //                 _run();
    //                 logger.debug('Start _run')
    //                 clearInterval(ID);
    //                 return;
    //             }
    //             logger.debug('等待...');
    //         }, 200)

    //         async function _run() {
    //             Pos_Y = 301;
    //             pl.tell(Gm_Tell + `寻找安全坐标...`)
    //             for (Pos_Y = Pos_Y; Pos_Y > 0; Pos_Y--) {
    //                 if (Block_Obj == null || Block_Obj.type == 'minecraft:air') {
    //                     UpdatePos_Y(Pos_Y);
    //                     Block_Obj = mc.getBlock(to_Pos);
    //                     logger.debug(Pos_Y, Block_Obj);
    //                 } else {
    //                     if (Pos_Y < -60 || ["minecraft:lava", "minecraft:flowing_lava"].indexOf(Block_Obj.type) != -1) {
    //                         // 如果 Block_Obj type 属性等于 "minecraft:lava" 或 "minecraft:flowing_lava"，则执行以下代码块
    //                         pl.teleport(BackUpPos);
    //                         pl.tell(Gm_Tell + `查询安全坐标失败！`);
    //                         break;
    //                     } else if (Block_Obj.type != "minecraft:air") {
    //                         UpdatePos_Y(Pos_Y + 2);
    //                         pl.teleport(to_Pos);
    //                         pl.tell(Gm_Tell + `传送完成！`);
    //                         logger.debug(to_Pos);
    //                         break;
    //                     }
    //                 }
    //             }
    //         }
    //         function UpdatePos_Y(Y) {
    //             const Back = to_Pos;
    //             to_Pos = new IntPos(Back.x, Y, Back.z, Back.dimid);
    //         }
    //         function RandomCoordinates() {
    //             const num = Math.floor(Math.random() * (Config.TPR.Max - Config.TPR.Min + 1)) + Config.TPR.Min;
    //             return Math.random() < 0.5 ? -num : num;
    //         }
    //     }
    // }
}
class TPA_Cache {//todo 缓存传送
    static async DeleteCache(pl) {
        for (let i = 0; i < TPACache.length; i++) {
            if (i.from == pl.realName || i.to == pl.realName) {
                let capl = mc.getPlayer(i.from); let name = i.to;
                if (i.type == 1) {
                    capl = mc.getPlayer(i.to);
                    name = i.from;
                }
                if (capl) {
                    capl.tell(Gm_Tell + `传送失败！玩家[${name}]已离线!`);
                }
                TPACache.splice(i, 1);
            }
        }
    }
    // static async getRequest(pl) {
    //     let tmp = [];
    //     for (let i = 0; i < TPACache.length; i++) {
    //         if ()
    //     }
    // }
}


// FileOperation.ReadFile();

const MAPPING_TABLE = {
    HomeUi: HomeForms.Home_Panel,
    WarpUi: Forms.PublicTransportation,
    PlayerUi: Forms.PlayerTransportation,
    DeathUi: Forms.DeathTransportation,
    RandomUi: Forms.RandomTransportation,
    SetingUi: Forms.PersonalSettings
}

/* 命令注册 */
//todo 23/5/10 重新注册命令  命令接受/拒绝请求
{
    const Cmd = mc.newCommand(Config.Command.name, Config.Command.Describe, PermType.Any);
    //tps mgr
    Cmd.setEnum('mgr', ['mgr']);
    Cmd.mandatory('action', ParamType.Enum, 'mgr', 1);
    Cmd.overload(['mgr']);
    //tps random
    Cmd.setEnum('random', ['random']);
    Cmd.mandatory('action', ParamType.Enum, 'random', 1);
    Cmd.overload(['random']);
    //tps reload
    Cmd.setEnum('reload', ['reload']);
    Cmd.mandatory('action', ParamType.Enum, 'reload', 1);
    Cmd.overload(['reload']);
    //tps accept
    Cmd.setEnum('accept', ['accept']);
    Cmd.mandatory('action', ParamType.Enum, 'accept', 1);
    Cmd.overload(['accept']);
    //tps deny
    Cmd.setEnum('deny', ['deny']);
    Cmd.mandatory('action', ParamType.Enum, 'deny', 1);
    Cmd.overload(['deny']);
    //tps back
    Cmd.setEnum('back', ['back']);
    Cmd.mandatory('action', ParamType.Enum, 'back', 1);
    Cmd.overload(['back']);
    //tps refresh
    Cmd.setEnum('refresh', ['refresh']);
    Cmd.mandatory('action', ParamType.Enum, 'refresh', 1);
    Cmd.overload(['refresh']);
    // tps [gui] [home|warp|player|death|random|seting]
    Cmd.setEnum("gui", ['gui']);
    Cmd.optional('action', ParamType.Enum, 'gui', 1);
    Cmd.setEnum('gui_enum', ['home', 'warp', 'player', 'death', 'random', 'seting']);
    Cmd.optional('gui_name', ParamType.Enum, 'gui_enum', 'gui_enum', 1);
    Cmd.overload(['gui', 'gui_enum']);
    //回调
    Cmd.setCallback((_, ori, out, res) => {
        logger.debug('\n', JSON.stringify(res, null, '\t'));
        switch (res.action) {
            case 'mgr':
                if (ori.type !== 0) return out.error('此命令仅限玩家执行');
                if (!ori.player.isOP()) return out.error('仅限管理员使用');
                Seting(ori.player);
                break;
            case 'reload':
                if (ori.type !== 7) return out.error('此命令仅限控制台执行');
                FileOperation.SaveFile();
                out.success('---操作完成---');
                break;
            case 'gui':
                if (ori.type !== 0) return out.error('此命令仅限玩家执行');
                const Table = {
                    home: HomeForms.Home_Panel,
                    warp: Forms.PublicTransportation,
                    player: Forms.PlayerTransportation,
                    death: Forms.DeathTransportation,
                    random: Forms.RandomTransportation,
                    seting: Forms.PersonalSettings
                }
                if (res.gui_name) {
                    Table[res.gui_name](ori.player);
                } else {
                    Main(ori.player, MainUI);
                }
                break;
            case 'accept':
                break;
            case "deny":
                break;
            case 'random':
                if (ori.type !== 0) return out.error('此命令仅限玩家执行');
                Forms.RandomTeleportCore(ori.player);
                break;
            case 'refresh':
                if (ori.type !== 7) return out.error('此命令仅限控制台执行');
                FileOperation.ReadFile();
                out.success('---操作完成---');
                break;
            case 'back':
                if (ori.type !== 0) return out.error('此命令仅限玩家执行');
                MAPPING_TABLE['DeathUi'](ori.player);
                break;
            default:
                if (ori.type !== 0) return out.error('此命令仅限玩家执行');
                Main(ori.player, MainUI);
                break;
        }
    })
    Cmd.setup();
}


/**
 * GUI主页
 * @param {Object} pl 玩家对象
 * @param {Array} Array 菜单数组
 */
function Main(pl, Array = []) {
    const fm = Other.SimpleForm();
    fm.setContent(`· 选择一个操作`);
    Array.forEach((i) => {
        fm.addButton(i.name, i.image);
    });
    if (Array.length == 0) return pl.tell(`数组为空！ 无法发送表单！`);
    pl.sendForm(fm, (pl, id) => {
        if (id == null) return Other.CloseTell(pl);
        const sw = Array[id];
        switch (sw.type) {
            case "inside": return MAPPING_TABLE[sw.open](pl);
            case "command": return pl.runcmd(sw.open);
            case "form":
                if (!File.exists(_FilePath + `GUI\\${sw.open}.json`)) {
                    File.writeTo(_FilePath + `GUI\\${sw.open}.json`, '[]');
                    return pl.tell(`§c§l文件<${sw.open}.json>不存在！`, 5);
                };
                try {
                    let Menu_Arry = JSON.parse(File.readFrom(_FilePath + `GUI\\${sw.open}.json`));
                    logger.debug(Menu_Arry);
                    Main(pl, Menu_Arry);
                } catch (e) {
                    if (e instanceof SyntaxError) {
                        pl.tell(`§c§l文件<${sw.open}.json>语法错误！`, 5);
                        throw new SyntaxError(e);
                    }
                };
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
                    fm.addSwitch('启用随机传送', Config.TPR.Enable);
                    fm.addInput('随机传送 最小值', 'Number', String(Config.TPR.Min));
                    fm.addInput('随机传送 最大值', 'Number', String(Config.TPR.Max));
                    pl.sendForm(fm, (pl, dt) => {
                        if (dt == null) return Other.CloseTell(pl);
                        const data = {
                            Min: Number(dt[1]),
                            Max: Number(dt[2])
                        }
                        Config.TPR = data;
                        Config.TPR.Enable = Boolean(dt[0]).valueOf();
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
                                fm.addButton(`${i.name}\n${Other.DimidToDimension(i.dimid)}  X: ${i.x} Y: ${i.y} Z: ${i.z}`);
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
                                        `当前正在编辑：${AllPlayerData[id]}\n名称： ${Home[AllPlayerData[id]][id1].name}\n坐标： ${Home[AllPlayerData[id]][id1].x},${Home[AllPlayerData[id]][id1].y},${Home[AllPlayerData[id]][id1].z}\n维度： ${Other.DimidToDimension(Home[AllPlayerData[id]][id1].dimid)}`,
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
                        fm.addButton(`${i.name}\n${Other.DimidToDimension(i.dimid)} X: ${i.x} Y: ${i.y} Z: ${i.z}`);
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
                                `当前正在编辑： ${Warp[id].name}\n坐标： ${Warp[id].x},${Warp[id].y},${Warp[id].z}\n维度： ${Other.DimidToDimension(Warp[id].dimid)}`,
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
                        fm.addButton(`[玩家]  ${i.player}\n${i.data.name}  ${Other.DimidToDimension(i.data.dimid)} ${i.data.x},${i.data.y},${i.data.z}`)
                    });
                    fm.addButton('返回上一页', 'textures/ui/icon_import');
                    pl.sendForm(fm, (pl, id) => {
                        if (id == null) return Other.CloseTell(pl);
                        if (id == MergeRequest.length) return Seting(pl);
                        pl.sendSimpleForm(PLUGINS_JS,
                            `[玩家]: ${MergeRequest[id].player}\n[时间]: ${MergeRequest[id].time}\n[GUID]: ${MergeRequest[id].guid}\n[坐标]: ${MergeRequest[id].data.name}  ${Other.DimidToDimension(MergeRequest[id].data.dimid)} ${MergeRequest[id].data.x},${MergeRequest[id].data.y},${MergeRequest[id].data.z}`,
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
 * 传送核心函数 
 * @param {Object} from 发送方玩家 
 * @param {Object} to 接收方玩家 
 * @param {Number} type 传送类型 0：收方接收表单  1：发方接受表单
 * @param {Object} pos 目标坐标 {x: 1, y: 1, z: 1, dimid: 0}
 * @param {String} txt 类型描述 
 */
function Delivery_Core(from, to, type, pos, txt) {
    let targetPos; let requestData;
    if (pos && pos !== '') {
        // 根据传入的目标坐标构建一个IntPos对象
        targetPos = new IntPos(pos.x, pos.y, pos.z, pos.dimid);
    }
    // 根据传入的类型确定是发起方还是接收方发送表单
    if (type == 0) {
        from.tell(Gm_Tell + `已向[${to.realName}]发送请求，等待对方接受...`);
        requestData = `\n      来自 ${from.realName} 的传送请求\n      类型: ${txt}\n    `;
    } else {
        to.tell(Gm_Tell + `已向[${from.realName}]发送请求，等待对方接受...`);
        requestData = `\n      来自 ${to.realName} 的传送请求\n      类型: ${txt}\n    `;
    }
    // 构建表单
    const fm = Other.SimpleForm();
    fm.setContent(requestData);
    fm.addButton("接受请求", "textures/ui/realms_green_check");
    fm.addButton("拒绝请求", "textures/ui/realms_red_x");
    if (type == 0) {// 根据类型发送表单给对应的玩家
        if (to.sendForm(fm, onReceiveRequest) == null || PlayerSeting[to.realName].SendRequestPopup == false) { sendFormError(to) }/* 发送给目标玩家 */
    } else {
        if (from.sendForm(fm, onReceiveRequest) == null || PlayerSeting[from.realName].SendRequestPopup == false) { sendFormError(from) }/* 发送给发送方玩家 */
    }
    // 定义表单回调函数
    function onReceiveRequest(_pl, id) {
        switch (id) {
            case 0:/* 接受请求 */
                // 如果有目标坐标就使用目标坐标传送，否则使用接收方玩家的坐标传送
                if (targetPos) {
                    from.teleport(targetPos);
                } else {
                    from.teleport(to.blockPos);
                }
                // 根据类型告诉玩家传送已开始
                if (type == 0) {
                    from.tell(`${Gm_Tell}${to.realName}已接受您的传送请求，开始传送...`);
                } else {
                    to.tell(`${Gm_Tell}${from.realName}已接受您的传送请求，开始传送...`);
                }
                break;
            case 1:/* 拒绝请求 */
                // 告诉玩家传送请求已被拒绝
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
    // 发送表单失败 进行缓存
    function sendFormError(pl) {
        const cache = {
            from: from.realName,
            to: to.realName,
            type: type,
            pos: pos,
            txt: txt,
            end: Time_Mod.getEndTimes(Config.TPA.CacheExpirationTime, Config.TPA.CacheExpirationTimeUnit)
        }
        TPACache.push(cache);
    }
}

// 注册监听器
{
    /* 监听进服事件 */
    mc.listen('onJoin', (pl) => {
        if (pl.isSimulatedPlayer()) return;
        if (!PlayerSeting.hasOwnProperty(pl.realName)) {
            logger.warn(`玩家${pl.realName} 的配置不存在，正在新建配置...`);
            PlayerSeting[pl.realName] = Config.PlayerSeting;
            FileOperation.SaveFile();
        } else if (Config.AutoCompleteAttributes) {
            // 0.0.5版本新增属性检查
            for (let ps in Config.PlayerSeting) {
                if (Config.PlayerSeting.hasOwnProperty(ps) && !PlayerSeting[pl.realName].hasOwnProperty(ps)) {
                    PlayerSeting[pl.realName][ps] = Config.PlayerSeting[ps];
                    logger.warn(`玩家[${pl.realName}] ${ps} 属性缺失，已自动补齐`);
                }
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
    //玩家退出游戏
    mc.listen('onLeft', (pl) => {
        if (pl.isSimulatedPlayer()) return;
        TPA_Cache.DeleteCache(pl);
    })
    //玩家重生
    mc.listen('onRespawn', (pl) => {
        // 发送返回死亡点弹窗
        if (Config.Death.sendBackGUI == true && PlayerSeting[pl.realName].DeathPopup == true) {
            MAPPING_TABLE["DeathUi"](pl);//todo 待尝试pl.isloading接口
        }
    })
}
