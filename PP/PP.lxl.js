//LiteLoaderScript Dev Helper
/// <reference path="c:\Users\X\Documents\Liteloader-Aids/dts/HelperLib-master/src/index.d.ts"/> 

/*            注意
 * 插件源码归原作者（PPOUI）所有
 * 未经允许禁止 二改、转载、整合等
 * 本插件为免费插件，仅在MineBBS发布
*/

const PLUGINS_NAME = "PP"
const PLUGINS_JS = `§d§l${PLUGINS_NAME} §a留§e言§b板§r`
const PLUFINS_VERSION = [1,0,0]
const PLUGINS_ZZ = 'PPOUI'//请勿更改
const PLUGINS_URL = 'https://www.minebbs.com/resources/pp-gui-gui.5201/'//请勿更改

ll.registerPlugin(
    /* name */ PLUGINS_NAME,
    /* introduction */ PLUGINS_JS,
    /* version */ PLUFINS_VERSION,
    /* otherInformation */ {
        "作者":PLUGINS_ZZ,
        "发布地址":PLUGINS_URL
    }
); 
const Conf_Path = `.\\Plugins\\${PLUGINS_NAME}\\`
const user_init = '{"user":[],"BLACKLIST":[]}'
const data_init = '{"data":[],"RECYCLE_BIN":[]}'
const Config_init = '{"version":"1.0","PROMPT_TEXT":"文明留言","RECYCLE_BIN":1,"LEAVING_A_MESSAGE":1,"VIEW_COMMENTS":1,"DELETE_MESSAGE":1,"SEARCH":1,"ACHIEVEMENT_TIPS":0}'
const button_init = '{"Main":[{"name":"我要留言","images":"textures/ui/book_edit_default"},{"name":"查看留言板","images":"textures/ui/icon_sign"},{"name":"删除留言","images":"textures/ui/realms_red_x"},{"name":"搜索留言","images":"textures/ui/magnifyingGlass"},{"name":"管理菜单","images":"textures/ui/op"}],"MANAGE_FORMS":[{"name":"用户管理","images":"textures/ui/FriendsDiversity"},{"name":"回收站管理","images":"textures/ui/icon_trash"},{"name":"删除留言","images":"textures/ui/realms_red_x"},{"name":"插件设置","images":"textures/ui/settings_glyph_color_2x"},{"name":"重载配置文件","images":"textures/ui/refresh_light"}]}'
let Config = data.openConfig(Conf_Path+'Config.json','json',Config_init)
let Conf_data = data.openConfig(Conf_Path+'data.json','json',data_init)
let Conf_User = data.openConfig(Conf_Path+'user.json','json',user_init)
let Conf_BUtton = data.openConfig(Conf_Path+'Button.json','json',button_init)
function Conf_reload(){
    Config.reload()
    Conf_data.reload()
    Conf_User.reload()
    Conf_BUtton.reload()
    colorLog('green','重载配置文件完成！')
}
mc.regPlayerCmd('pp',PLUGINS_JS,MainGUI)
mc.regConsoleCmd('pp reload','重载配置文件',Conf_reload)
mc.regConsoleCmd('pp add','添加管理员',(args)=>{
    let tmp = Conf_User.get('user')
    let plxuid = data.name2xuid(args[0])
    if(tmp.indexOf(plxuid) == -1){
        if(plxuid==''){
            logger.error('获取玩家'+args[0]+'的XUID失败！')
        }
        else{
            colorLog('green','玩家'+args[0]+'已设置为管理员')
            tmp.push(plxuid)
            Conf_User.set('user',tmp)
            Conf_reload()
        }
    }
    else{
        logger.warn('玩家'+args[0]+'已是管理员！请勿重复添加')
    }
})
mc.regConsoleCmd('pp remove','移除管理员',(args)=>{
    let tmp = Conf_User.get('user')
    let plxuid = data.name2xuid(args[0])
    if(tmp.indexOf(plxuid) == -1){
        logger.warn('获取玩家'+args[0]+'的XUID失败！')
    }
    else{
        tmp.splice(tmp.indexOf(plxuid),1)
        Conf_User.set('user',tmp)
        colorLog('green','成功移除管理员'+args[0])
        Conf_reload()
    }
})
mc.regConsoleCmd('pp help','帮助',(args)=>{
    colorLog('yellow',`+======+ ${PLUGINS_JS} 帮助 v${PLUFINS_VERSION} +======+`)
    colorLog('green','pp add [玩家名]      添加管理员')
    colorLog('green','pp remove [玩家名]   移除管理员')
    colorLog('green','pp reload            重载配置文件')
    colorLog('green','注意：添加/移除管理员请勿带上括号[]')
    colorLog('yellow','+=====================================+')
})
const LISTEN_SWITCH = false
if(LISTEN_SWITCH==true){
    mc.listen('onUseItem',(pl,it)=>{
        if(pl.sneaking == 1){
            if(it.type=='minecraft:clock'){
                MainGUI(pl)
            }
        }
    })
}


//todo 2023/1/03 能不能加入一个发送附件（物品）的功能，有的时候给别人留东西结果他下线了
function MainGUI(pl){
    let fm = mc.newSimpleForm()
    .setTitle(`${PLUGINS_JS}`)
    .setContent('请选择一个操作')
    let bt = Conf_BUtton.get('Main')
    bt.forEach(dt =>{
        fm.addButton(dt.name,dt.images)
    })
    pl.sendForm(fm,(pl,id)=>{
        if(id==null){Close_tell(pl);return null}
        switch (id){
            case 0:
                if(Config.get('LEAVING_A_MESSAGE')==1){
                    if(CLOSURE_JUDGMENT(pl)){
                        add_ui(pl)
                    }
                }
                else{
                    OFF(pl)
                }
                break;
            case 1:
                if(Config.get('VIEW_COMMENTS')==1){
                    show_ui(pl)
                }
                else{
                    OFF(pl)
                }
                break;
            case 2:
                if(Config.get('DELETE_MESSAGE')==1){
                    remove_ui(pl)
                }
                else{
                    OFF(pl)
                }
                break;
            case 3:
                if(Config.get('SEARCH')==1){
                    SEARCH_ui(pl)
                }
                else{
                    OFF(pl)
                }
                break;
            case 4:
                if(AUTHORITY_JUDGMENT(pl)){
                    op_ui(pl)
                }
                break;
        }
    })
}
function op_ui(pl){
    let fm = mc.newSimpleForm()
    .setTitle(`${PLUGINS_JS}`)
    .setContent('选择一个操作')
    let bt = Conf_BUtton.get('MANAGE_FORMS')
    bt.forEach(dt =>{
        fm.addButton(dt.name,dt.images)
    })
    pl.sendForm(fm,(pl,id)=>{
        if(id==null){Close_tell(pl);return null}
        switch (id){
            case 0:
                let Online_Players = []
                mc.getOnlinePlayers().forEach(pl => {
                    Online_Players.push(pl.realName)
                })
                let fm4 = mc.newCustomForm()
                fm4.setTitle(`${PLUGINS_JS}`)
                fm4.addInput('§c§l■§r离线 请输入玩家名','str')
                fm4.addDropdown('§a§l■§r在线 请选择一个玩家',Online_Players,0)
                fm4.addStepSlider('§e§l■§r切换模式',['§a§l■§r在线模式','§c§l■§r离线模式'],0)
                fm4.addStepSlider('§e§l■§r操作类型',['§c§l■§r封禁用户','§a§l■§r解禁用户'],0)
                pl.sendForm(fm4,(pl,sdt)=>{
                    if(sdt==null){Close_tell(pl);return null}
                    if(sdt[3]==0){
                        if(sdt[2]==0){
                            let stmp = Conf_User.get('BLACKLIST')
                            let plxuid = data.name2xuid(Online_Players[sdt[1]])
                            if(stmp.indexOf(plxuid) == -1){
                                if(plxuid==''){
                                    C_tell(pl,`获取玩家${Online_Players[sdt[1]]}的XUID失败！`)
                                }
                                else{
                                    C_tell(pl,`成功封禁用户${Online_Players[sdt[1]]}`)
                                    stmp.push(plxuid)
                                    Conf_User.set('BLACKLIST',stmp)
                                    Conf_reload()
                                }
                            }
                            else{
                                C_tell(pl,`玩家${Online_Players[sdt[1]]}已被封禁，请勿重复封禁`)
                            }
                        }
                        else{
                            if(sdt[0]==''){
                                C_tell(pl,'输入框为空！')
                            }
                            else{
                                let stmp = Conf_User.get('BLACKLIST')
                                let plxuid = data.name2xuid(sdt[0])
                                if(stmp.indexOf(plxuid) == -1){
                                    if(plxuid==''){
                                        C_tell(pl,`获取玩家${sdt[0]}的XUID失败！`)
                                    }
                                    else{
                                        C_tell(pl,`成功封禁用户${sdt[0]}`)
                                        stmp.push(plxuid)
                                        Conf_User.set('BLACKLIST',stmp)
                                        Conf_reload()
                                    }
                                }
                                else{
                                    C_tell(pl,`玩家${sdt[0]}已被封禁，请勿重复封禁`)
                                }
                            }
                        }
                    }
                    else{
                        if(sdt[2]==0){
                            let sstmp = Conf_User.get('BLACKLIST')
                            let plxuid = data.name2xuid(Online_Players[sdt[1]])
                            if(sstmp.indexOf(plxuid) == -1){
                                C_tell(pl,'获取玩家'+Online_Players[sdt[1]]+'的XUID失败！')
                            }
                            else{
                                sstmp.splice(sstmp.indexOf(plxuid),1)
                                Conf_User.set('BLACKLIST',sstmp)
                                C_tell(pl,'已解禁用户'+Online_Players[sdt[1]])
                                Conf_reload()
                            }
                        }
                        else{
                            let sstmp = Conf_User.get('BLACKLIST')
                            let plxuid = data.name2xuid(sdt[0])
                            if(sstmp.indexOf(plxuid) == -1){
                                C_tell(pl,'获取玩家'+sdt[0]+'的XUID失败！')
                            }
                            else{
                                sstmp.splice(sstmp.indexOf(plxuid),1)
                                Conf_User.set('BLACKLIST',sstmp)
                                C_tell(pl,'已解禁用户'+sdt[0])
                                Conf_reload()
                            }
                        }
                    }
                })
                break;
            case 1:
                let fm3 = mc.newSimpleForm()
                fm3.setTitle(`${PLUGINS_JS}`)
                fm3.setContent('选择一条留言')
                let bt1 = Conf_data.get('RECYCLE_BIN')
                let arr1 = []
                bt1.forEach(dt =>{
                    fm3.addButton(`§e时间： §a${dt.time}\n§e内容： §d${dt.text}`)
                    arr1.push(dt.gid)
                })
                pl.sendForm(fm3,(pl,id2)=>{
                    if(id2==null){Close_tell(pl);return null}
                    let data_tmp2 = Conf_data.get('RECYCLE_BIN')
                    let tmp = JSON.parse(File.readFrom(`./Plugins/${PLUGINS_NAME}/data.json`))
                    let GUID=arr1[id2]
                    let index = data_tmp2.findIndex(tmp => tmp.gid === GUID);
                    pl.sendModalForm(PLUGINS_JS+'确认页',`§a§l|§r§e玩家： §b${data_tmp2[index].name}\n§a§l|§r§eXUID: §g${data_tmp2[index].xuid}\n§a§l|§r§e时间： §a${data_tmp2[index].time}\n§a§l|§r§e设备： §a${data_tmp2[index].os} §eIP： §o§a${data_tmp2[index].ip}§r\n§a§l|§r§eGID:§b${data_tmp2[index].gid}\n§a§l|§r§e内容： §d${data_tmp2[index].text}`,'永久删除','放弃表单',(pl,fdt)=>{
                        if(fdt==null || fdt==false){Close_tell(pl);return null}
                        if(fdt==true){
                            data_tmp2.splice(index, 1);
                            Conf_data.set('RECYCLE_BIN',data_tmp2)
                            C_tell(pl,`成功删除留言！  GID：${GUID}`)            
                        }
                    })
                })
                break;
            case 2:
                let fm2 = mc.newSimpleForm()
                fm2.setTitle(`${PLUGINS_JS}`)
                fm2.setContent('选择一条留言')
                let bt = Conf_data.get('data')
                let arr = []
                bt.forEach(dt =>{
                    fm2.addButton(`§e时间： §a${dt.time}\n§e内容： §d${dt.text}`)
                    arr.push(dt.gid)
                })
                pl.sendForm(fm2,(pl,id1)=>{
                    if(id1==null){Close_tell(pl);return null}
                    let data_tmp1 = Conf_data.get('data')
                    let tmp = JSON.parse(File.readFrom(`./Plugins/${PLUGINS_NAME}/data.json`))
                    let GUID=arr[id1]
                    let index = data_tmp1.findIndex(tmp => tmp.gid === GUID);
                    pl.sendModalForm(PLUGINS_JS+'确认页',`§a§l|§r§e玩家： §b${data_tmp1[index].name}\n§a§l|§r§eXUID: §g${data_tmp1[index].xuid}\n§a§l|§r§e时间： §a${data_tmp1[index].time}\n§a§l|§r§e设备： §a${data_tmp1[index].os} §eIP： §o§a${data_tmp1[index].ip}§r\n§a§l|§r§eGID:§b${data_tmp1[index].gid}\n§a§l|§r§e内容： §d${data_tmp1[index].text}`,'移至回收站','放弃表单',(pl,fdt1)=>{
                        if(fdt1==null || fdt1==false){Close_tell(pl);return null}
                        if(fdt1==true){
                            if(Config.get('RECYCLE_BIN')==1){
                                let del = Conf_data.get('RECYCLE_BIN')
                                del.push(data_tmp1[index])
                                Conf_data.set('RECYCLE_BIN',del)
                            }
                            data_tmp1.splice(index, 1);
                            Conf_data.set('data',data_tmp1)
                            C_tell(pl,`成功删除留言！  GID：${GUID}`)        
                        }
                    })
                })     
                break;
            case 3:
                let fm1 = mc.newCustomForm()
                fm1.setTitle(`${PLUGINS_JS}`)
                let sw1;let sw2;let sw3;let sw4;let sw5;let sw6
                if(Config.get('RECYCLE_BIN')==1){sw1=true}else{sw1=false}
                if(Config.get('LEAVING_A_MESSAGE')==1){sw2=true}else{sw2=false}
                if(Config.get('VIEW_COMMENTS')==1){sw3=true}else{sw3=false}
                if(Config.get('DELETE_MESSAGE')==1){sw4=true}else{sw4=false}
                if(Config.get('SEARCH')==1){sw5=true}else{sw5=false}
                if(Config.get('ACHIEVEMENT_TIPS')==1){sw6=true}else{sw6=false}
                fm1.addInput('§l§a|§r§e留言时显示的提示','str',Config.get('PROMPT_TEXT'))
                fm1.addSwitch('§l§a|§r§e回收站功能\n §a用户删除的留言是否移至回收站',sw1)
                fm1.addSwitch('§l§a|§r§e留言功能\n §a是否允许用户留言',sw2)
                fm1.addSwitch('§l§a|§r§e查看留言板\n §a是否允许用户查看留言板',sw3)
                fm1.addSwitch('§l§a|§r§e删除留言\n §a是否允许用户删除自己的留言',sw4)
                fm1.addSwitch('§l§a|§r§e搜索功能\n §a是否允许用户使用搜索功能',sw5)
                fm1.addSwitch('§l§a|§r§e通知功能\n §a是否启用成就栏通知',sw6)
                pl.sendForm(fm1,(pl,dt1)=>{
                    if(dt1==null){Close_tell(pl);return null}
                    Config.set('PROMPT_TEXT',dt1[0])
                    Config.set('RECYCLE_BIN',dt1[1])
                    Config.set('LEAVING_A_MESSAGE',dt1[2])
                    Config.set('VIEW_COMMENTS',dt1[3])
                    Config.set('DELETE_MESSAGE',dt1[4])
                    Config.set('SEARCH',dt1[5])
                    Config.set('ACHIEVEMENT_TIPS',dt1[6])
                    Conf_reload()
                    C_tell(pl,'重载配置文件完成')
                })
                break;
            case 4:
                Conf_reload()
                C_tell(pl,'重载配置文件完成！')
                break;
        }
    })
}
function SEARCH_ui(pl,ctmp){
    let Online_Players = []
    mc.getOnlinePlayers().forEach(pl => {
        Online_Players.push(pl.realName)
    })
    let fm = mc.newCustomForm()
    .setTitle(`${PLUGINS_JS}`)
    if(ctmp==null){
        fm.addInput('输入GID','str')
    }
    else{
        fm.addInput('输入GID','str',ctmp)
    }
    fm.addDropdown('选择一个玩家',Online_Players,0)
    .addStepSlider('搜索模式',['玩家','GID'])
    pl.sendForm(fm,(pl,data)=>{
        if(data==null){Close_tell(pl);return null}
        let arr_i = []
        let data_tmp = Conf_data.get('data')
        let tmp = JSON.parse(File.readFrom(`./Plugins/${PLUGINS_NAME}/data.json`))
        switch (data[2]){
            case 0:
                let fm1 = mc.newCustomForm()
                fm1.setTitle(`${PLUGINS_JS}`)
                var count = 0
                data_tmp.forEach(i =>{
                    if(Online_Players[data[1]]==i.name){
                        fm1.addLabel(`§a§l|§r§e玩家： §b${i.name}\n§a§l|§r§e时间： §a${i.time}\n§a§l|§r§e设备： §a${i.os} §eIP： §o§a${i.ip}§r\n§a§l|§r§e内容： §d${i.text}`)
                        count++;
                    }
                })
                fm1.addLabel(`检索玩家"${Online_Players[data[1]]}"完成   共${count}条结果`)
                if(count!==0){
                    pl.sendForm(fm1,(pl,dt1)=>{
                        if(dt1==null){Close_tell(pl);return}
                    })
                }
                else{
                    pl.sendModalForm('ERROR 错误！',`未检索到玩家 "${Online_Players[data[1]]}"\n是否返回？`,'返回上一级','放弃表单',(pl,dt2)=>{
                        if(dt2==null || dt2==false){Close_tell(pl);return}
                        if(dt2==true){SEARCH_ui(pl)}
                    })
                }
                break;
            case 1:
                if(data[0]==''){
                    C_tell(pl,'输入框为空!')
                }
                else{
                    data_tmp.forEach(i =>{
                        if(data[0]==i.gid){
                            arr_i.push(i.gid)
                        }
                    })
                    if(arr_i.length == 0){
                        pl.sendModalForm('ERROR 错误！',`未检索到GID "${data[0]}"\n是否返回？`,'返回上一级','放弃表单',(pl,dt2)=>{
                            if(dt2==null || dt2==false){Close_tell(pl);return}
                            if(dt2==true){SEARCH_ui(pl,data[0])}
                        })
                    }
                    else{
                        let GUID=arr_i[0]
                        let index = data_tmp.findIndex(tmp => tmp.gid === GUID);
                        pl.sendModalForm(`${PLUGINS_JS} 搜索 (${GUID})`,`§a§l|§r§e玩家： §b${data_tmp[index].name}\n§a§l|§r§e时间： §a${data_tmp[index].time}\n§a§l|§r§e设备： §a${data_tmp[index].os} §eIP： §o§a${data_tmp[index].ip}§r\n§a§l|§r§e内容： §d${data_tmp[index].text}`,'放弃表单','返回上一级',(pl,dt)=>{
                            if(dt==null && dt==true){Close_tell;return}
                            if(dt==false){SEARCH_ui(pl,data[0])}
                        })
                    }
                }
                break;
        }
    })
}
function remove_ui(pl){
    let fm = mc.newSimpleForm()
    .setTitle(`${PLUGINS_JS}`)
    .setContent('选择一条留言')
    let bt = Conf_data.get('data')
    let arr = []
    bt.forEach(dt =>{
        if(dt.name==pl.realName){
            fm.addButton(`§e时间： §a${dt.time}\n§e内容： §d${dt.text}`)
            arr.push(dt.gid)
        }
    })
    if(arr.length===0){
        C_tell(pl,'你还没有留言，快去留言吧！')
        return false
    }
    else{
        pl.sendForm(fm,(pl,id)=>{
            if(id==null){Close_tell(pl);return null}
            let data_tmp = Conf_data.get('data')
            let tmp = JSON.parse(File.readFrom(`./Plugins/${PLUGINS_NAME}/data.json`))
            let GUID=arr[id]
            let index = data_tmp.findIndex(tmp => tmp.gid === GUID);
            pl.sendModalForm(PLUGINS_JS+'确认页',`§a§l|§r§e玩家： §b${data_tmp[index].name}\n§a§l|§r§e时间： §a${data_tmp[index].time}\n§a§l|§r§e设备： §a${data_tmp[index].os} §eIP： §o§a${data_tmp[index].ip}§r\n§a§l|§r§e内容： §d${data_tmp[index].text}`,'永久删除','返回上一页',(pl,fdt)=>{
                if(fdt==null){Close_tell(pl);return null}
                if(fdt==false){remove_ui(pl)}
                if(fdt==true){
                    if(Config.get('RECYCLE_BIN')==1){
                        let del = Conf_data.get('RECYCLE_BIN')
                        del.push(data_tmp[index])
                        Conf_data.set('RECYCLE_BIN',del)
                    }
                    data_tmp.splice(index, 1);
                    Conf_data.set('data',data_tmp)
                    C_tell(pl,`成功删除留言！  GID：${GUID}`)
                }
            })
        })    
    }

}
function show_ui(pl){
    let fm = mc.newCustomForm()
    .setTitle(`${PLUGINS_JS}`)
    let tmp = Conf_data.get('data')
    tmp.forEach(dt =>{
        fm.addLabel(`§a§l|§r§e玩家： §b${dt.name}\n§a§l|§r§e时间： §a${dt.time}\n§a§l|§r§e设备： §a${dt.os} §eIP： §o§a${dt.ip}§r\n§a§l|§r§e内容： §d${dt.text}`)
    })
    pl.sendForm(fm,(pl,data)=>{
        if(data==null){Close_tell(pl);return null}
    })
}

function add_ui(pl){
    let fm = mc.newCustomForm()
    .setTitle(`${PLUGINS_JS}`)
    .addLabel(Config.get('PROMPT_TEXT'))
    .addInput('输入要留言的内容','str')
    pl.sendForm(fm,(pl,data)=>{
        if(data==null){Close_tell(pl);return null}
        if(data[1]==''){
            C_tell(pl,'输入框为空！')
        }
        else{
            let dv = pl.getDevice()
            let Conf_tmp = Conf_data.get('data')
            let data_tmp = {
                "name": pl.realName,
                "xuid": pl.xuid,
                "time": system.getTimeStr(),
                "text": data[1],
                "ip": dv.ip,
                "os": dv.os,
                "gid":system.randomGuid()
            }
            Conf_tmp.push(data_tmp)
            Conf_data.set('data',Conf_tmp)
            Conf_reload()
        }
    })
}
const Gm_tell = `§l§a|§r§e[§d${PLUGINS_NAME}§e] §b`
function Close_tell(pl){
    C_tell(pl,'表单已放弃')
}
function OFF(pl){
    C_tell(pl,'管理员关闭了此功能')
}
function C_tell(pl,txts){
    if(Config.get('ACHIEVEMENT_TIPS')==0){
        pl.tell(Gm_tell+txts)
    }
    else{
        pl.sendToast(`§l§a|§r§e[§d${PLUGINS_NAME}留言板§e]§r`,'§e§l■§b'+txts)
    }
}
function AUTHORITY_JUDGMENT(pl){
    let tmp = Conf_User.get('user')
    if(tmp.indexOf(pl.xuid) !== -1){
        return true
    }
    else{
        C_tell(pl,'无权限访问！')
        return false
    }
}
function CLOSURE_JUDGMENT(pl){
    let tmp = Conf_User.get('BLACKLIST')
    if(tmp.indexOf(pl.xuid) !== -1){
        C_tell(pl,'你已被管理员封禁，无法使用此功能')
        return false
    }
    else{
        return true
    }
}
const VERSION_DETECTION = JSON.parse(Config_init)
if(Config.get('version')==VERSION_DETECTION.version){
    colorLog('green','配置文件版本匹配，加载插件...')
}
else{
    colorLog('red','配置文件版本不匹配！可能导致插件无法正常运行！')
}
colorLog('green','加载完成！')
colorLog('green',`版本：${PLUFINS_VERSION}`)
colorLog('green',`作者：${PLUGINS_ZZ}`)
colorLog('green',`发布网站：${PLUGINS_URL}`)