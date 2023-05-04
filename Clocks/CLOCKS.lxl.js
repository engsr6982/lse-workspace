//LiteLoaderScript Dev Helper
/// <reference path="c:\Users\X\Documents\Liteloader-Aids/dts/HelperLib-master/src/index.d.ts"/> 

/********************#注册插件#********************/
const PLUHINS_NAME = "CLOCKS";
const PLUHINS_JS = "CLOCKS进服欢迎";
const PLUGINS_ZZ = "PPOUI";
const PLUGINS_VERSION = [2,0,0];
const PLUGINS_URL = "https://www.minebbs.com/resources/clocks-_.4804/";

ll.registerPlugin(
    /* name */ PLUHINS_NAME,
    /* introduction */ PLUHINS_JS,
    /* version */ PLUGINS_VERSION,
    /* otherInformation */ {
        "作者":PLUGINS_ZZ,
        "发布链接":PLUGINS_URL
    }
); 
const Gm_tell = `§l§d[${PLUHINS_NAME}] §e`
//设置日志头
logger.setTitle(`${PLUHINS_NAME}`)
logger.setConsole(true,4)

/********************#配置文件#********************/
const Conf_Path = `.\\Plugins\\${PLUHINS_NAME}\\`
const Conf_init = '{"REG_COMMAND":1,"PERMISSION_MODE":0,"SUBTITLE_SWITCH":1,"REG_SET_COMMAND":1,"MAIN_TITLE_SWITCH":1,"CHAT_WELCOME_SWITCH":1,"RETURN_PROMPT_SWITCH":1,"MAIN_TITLE_TEXT":"元旦快乐","SUBTITLE_TEXT":"祝您游玩愉快","CHAT_WELCOME_TEXT":"§l§d欢迎加入§exxx§d服务器 | 输入/clock获得钟表菜单","RETURN_PROMPT_TEXT":"§l§d[CLOCLS]§e获取钟成功！"}'
const User_init = '{"user":[]}'
let Config = data.openConfig(Conf_Path+'Config.json','json',Conf_init)
let Conf_User = data.openConfig(Conf_Path+'user.json','json',User_init)

function Conf_reload(){
    Config.reload()
    logger.info('重载配置文件完成')
}

/********************#注册命令#********************/
mc.regPlayerCmd('clock', '§l§e获§a取§d钟',(pl)=>{
    if(Config.get('REG_COMMAND')==1){
        Give_item(pl)
    }
    else{
        pl.tell(`${Gm_tell}管理员已关闭此功能`)
    }
})

mc.regConsoleCmd('clock reload','重载配置文件',Conf_reload)

if(Config.get('PERMISSION_MODE')==1){
    mc.regConsoleCmd('clock add','添加管理员',(args)=>{
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
    mc.regConsoleCmd('clock remove','移除管理员',(args)=>{
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
    mc.regPlayerCmd('clock set', '§l§e进服§a欢迎§d设置',(pl)=>{
        if(Config.get('REG_SET_COMMAND')==1){
            if(AUTHORITY_JUDGMENT(pl)){
                GUI(pl)
            }
        }
        else{
            pl.tell(`${Gm_tell}此功能已关闭`)
        }
    })
}
else{
    mc.regPlayerCmd('clock set', '§l§e进服§a欢迎§d设置',(pl)=>{
        if(Config.get('REG_SET_COMMAND')==1){
            GUI(pl)
        }
        else{
            pl.tell(`${Gm_tell}此功能已关闭`)
        }
    },1)
}
function AUTHORITY_JUDGMENT(pl){
    let tmp = Conf_User.get('user')
    if(tmp.indexOf(pl.xuid) !== -1){
        return true
    }
    else{
        pl.tell(Gm_tell+'无权限访问！')
        return false
    }
}
/********************#GUI#********************/
function GUI(pl){
    let fm = mc.newSimpleForm()
    .setTitle(PLUHINS_NAME+' 插件设置')
    .setContent('请选择一项操作')
    .addButton('功能管理',"textures/ui/settings_glyph_color_2x.png")
    .addButton('欢迎设置',"textures/ui/settings_glyph_color_2x.png")
    .addButton('热重载插件',"textures/ui/refresh_light.png")
    .addButton('重载配置文件',"textures/ui/refresh.png")
    pl.sendForm(fm,(pl,dt)=>{
        if(dt==null){return}
        switch (dt){
            case 0:
                let sw1;let sw2;let sw3;let sw4;let sw5;let sw6;let sw7
                if(Config.get('REG_COMMAND')==1){sw1=true}else{sw1=false}
                if(Config.get('REG_SET_COMMAND')==1){sw2=true}else{sw2=false}
                if(Config.get('MAIN_TITLE_SWITCH')==1){sw3=true}else{sw3=false}
                if(Config.get('SUBTITLE_SWITCH')==1){sw4=true}else{sw4=false}
                if(Config.get('CHAT_WELCOME_SWITCH')==1){sw5=true}else{sw5=false}
                if(Config.get('RETURN_PROMPT_SWITCH')==1){sw6=true}else{sw6=false}
                if(Config.get('PERMISSION_MODE')==1){sw7=true}else{sw7=false}
                let fm1 = mc.newCustomForm()
                fm1.setTitle(PLUHINS_NAME+' 功能管理')
                fm1.addSwitch('§l§a|§r§e注册命令\n§a关闭后将无法通过/clock获取钟',sw1)
                fm1.addSwitch('§l§a|§r§e注册设置命令\n§a关闭后将无法打开本设置页面',sw2)
                fm1.addSwitch('§l§a|§r§e启用主标题\n§a关闭后将不再显示主标题',sw3)
                fm1.addSwitch('§l§a|§r§e启用副标题\n§a关闭后将不再显示副标题',sw4)
                fm1.addSwitch('§l§a|§r§e启用聊天欢迎\n§a关闭后聊天栏将不显示欢迎信息',sw5)
                fm1.addSwitch('§l§a|§r§e启用返回提示\n§a关闭后获取钟将不再显示提示',sw6)
                fm1.addSwitch('§l§a|§r§e权限判定模式\n§aOP(操作员) <=> 插件管理',sw7)
                pl.sendForm(fm1,(pl,dt1)=>{
                    if(dt1==null){return}
                    Config.set('REG_COMMAND',dt1[0])
                    Config.set('REG_SET_COMMAND',dt1[1])
                    Config.set('MAIN_TITLE_SWITCH',dt1[2])
                    Config.set('SUBTITLE_SWITCH',dt1[3])
                    Config.set('CHAT_WELCOME_SWITCH',dt1[4])
                    Config.set('RETURN_PROMPT_SWITCH',dt1[5])
                    Config.set('PERMISSION_MODE',dt1[6])
                    Conf_reload()
                    pl.sendModalForm(PLUHINS_NAME,'设置完成，请选择一个操作','返回上一级','关闭表单',(pl,mdt1)=>{
                        if(mdt1==null || mdt1==false){return}
                        if(mdt1==true){GUI(pl)}
                    })
                })
                break;
            case 1:
                let fm2 = mc.newCustomForm()
                fm2.setTitle(PLUHINS_NAME+' 欢迎设置')
                fm2.addInput('主标题内容','str',Config.get('MAIN_TITLE_TEXT'))
                fm2.addInput('副标题内容','str',Config.get('SUBTITLE_TEXT'))
                fm2.addInput('聊天栏内容','str',Config.get('CHAT_WELCOME_TEXT'))
                fm2.addInput('返回提示内容','str',Config.get('RETURN_PROMPT_TEXT'))
                pl.sendForm(fm2,(pl,dt2)=>{
                    if(dt2==null){return}
                    Config.set('MAIN_TITLE_TEXT',dt2[0])
                    Config.set('SUBTITLE_TEXT',dt2[1])
                    Config.set('CHAT_WELCOME_TEXT',dt2[2])
                    Config.set('RETURN_PROMPT_TEXT',dt2[3])
                    Conf_reload()
                    pl.sendModalForm(PLUHINS_NAME,'设置完成，请选择一个操作','返回上一级','关闭表单',(pl,mdt2)=>{
                        if(mdt2==null || mdt2==false){return}
                        if(mdt2==true){GUI(pl)}
                    })
                })
                break;
            case 2:
                pl.sendModalForm(PLUHINS_NAME+' §c警告！','§c警告，你正在进行热重载插件\n使用此功能前需确保未更改插件默认名称,如有更改导致重载失败和报错请自行解决\n如果重载后功能异常请删除配置文件重启服务器','返回上一级','我已确认风险 继续重载',(pl,mdt3)=>{
                    if(mdt3==null){return}
                    if(mdt3==true){GUI(pl)}
                    if(mdt3==false){mc.runcmdEx('ll reload "CLOCKS.lxl.js"')}
                })
                break;
            case 3:
                Conf_reload()
                pl.tell(`${Gm_tell}重载完成`)
                break;
        }
    })
}

/********************#核心#********************/
mc.listen("onJoin", Join_Server)//监听进入服务器

function Join_Server(pl){
    if(Config.get('MAIN_TITLE_SWITCH')==1){//主标题
        pl.setTitle(`${Config.get('MAIN_TITLE_TEXT')}`)
    }
    else{
        logger.warn('主标题已关闭，无法发送标题')
    }
    if(Config.get('SUBTITLE_SWITCH')==1){//副标题
        pl.setTitle(`${Config.get('SUBTITLE_TEXT')}`,3)
    }
    else{
        logger.warn('副标题已关闭，无法发送标题')
    }
    if(Config.get('CHAT_WELCOME_SWITCH')==1){//聊天栏
        pl.tell(`${Config.get('CHAT_WELCOME_TEXT')}`)
    }
    else{
        logger.warn('聊天栏已关闭，无法发送聊天栏内容')
    }
}

//获取钟
function Give_item(pl) {
    mc.runcmdEx('give "' + pl.realName + '" clock')
    if(Config.get('RETURN_PROMPT_SWITCH')==1){//返回值
        pl.tell(`${Config.get('RETURN_PROMPT_TEXT')}`)
    }
    else{
        logger.warn('返回值已关闭，无法发送内容')
    }
    return false;
}

/********************#输出日志#********************/
logger.info('#########################')
logger.info(`§a${PLUHINS_NAME}加载成功！`)
logger.info(`版本:${PLUGINS_VERSION}`)
logger.info(`§a作者：${PLUGINS_ZZ}`)
logger.info(`§a发布链接：${PLUGINS_URL}`)
logger.info('#########################')