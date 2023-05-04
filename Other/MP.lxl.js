//LiteLoaderScript Dev Helper
/// <reference path="c:\Users\X\Documents\LiteLoaderSE-Aids/dts/HelperLib-master/src/index.d.ts"/> 

/********************************注册插件********************************/
let PLUGINS_NAME = 'MP'
let PLUGINS_JS = 'MP 命令黑名单'
let PLUGINS_VERSION = [1,0,0]
let PLUGINS_AUTHOR = 'PPOUI'
let PLUGINS_URL = 'https://www.minebbs.com/resources/mp-gui.4830/'

ll.registerPlugin(
    /* name */ PLUGINS_NAME,
    /* introduction */ PLUGINS_JS,
    /* version */ PLUGINS_VERSION,
    /* otherInformation */ {
        '作者':PLUGINS_AUTHOR,
        '发布网站':PLUGINS_URL
    }
); 

/********************************注册其他内容********************************/
logger.setTitle(`${PLUGINS_NAME}`)
logger.setFile('./logs/MP.log')
logger.setConsole(true); 
var GAME_TELL = `§b[§a${PLUGINS_NAME}§b]§e `

function Close_Tell(pl){
    pl.tell(`${GAME_TELL} 表单已放弃`)
}

/********************************配置文件********************************/
var CONFIGINIT = '{"op":[],"public":["say","me","msg","w"]}'
var CONFIG = data.openConfig('.\\Plugins\\MP\\Config.json','json',CONFIGINIT)

function CONFIG_reload() {
    CONFIG.reload()
    CONFIG = data.openConfig('.\\Plugins\\MP\\Config.json','json',CONFIGINIT)
    colorLog('green',`${PLUGINS_NAME}重载完成`)
}

/********************************注册命令********************************/
mc.regConsoleCmd('mp reload','重载配置文件',CONFIG_reload)

mc.regConsoleCmd('mp add','添加插件管理员',(args)=>{
    let tmp = CONFIG.get('op')
    if(tmp.indexOf(args[0]) == -1){
        colorLog('green','玩家'+args[0]+'已设置为插件管理')
        tmp.push(args[0])
        CONFIG.set('op',tmp)
        CONFIG_reload()
    }
    else{
        colorLog('yellow','玩家'+args[0]+'已是插件管理，请勿重复添加')
    }
})

mc.regConsoleCmd('mp remove','删除插件管理员',(args)=>{
    let tmp = CONFIG.get('op')
    if(tmp.indexOf(args[0]) === -1){
        colorLog('yellow','玩家'+args[0]+'不是插件管理')
    }
    else{
        tmp.splice(tmp.indexOf(args[0]));
        colorLog('yellow','已删除玩家'+args[0]+'的插件管理权限')
        CONFIG.set("op",tmp);
        CONFIG_reload();
    }
})

mc.regPlayerCmd('mp','命令黑名单GUI控制面板',(pl,name)=>{
    let tmp = CONFIG.get('op')
    if(tmp.indexOf(pl.name) !== -1){
        MainGUI(pl)
    }
    else{
        pl.tell(`${GAME_TELL}错误！您无权限访问模命令黑名单GUI控制面板！`)
    }
})
/********************************测试模块********************************/
var useitems_swich = false

mc.listen("onUseItem",useitems)
function useitems(pl,it){
    if(useitems_swich == true){
        if(it.type == 'minecraft:clock'){
            MainGUI(pl)
        }
    }
}
/********************************监听拦截*******************************/
mc.listen("onPlayerCmd",function(player,cmd){
    for(let i = 0; i < CONFIG.get("public").length;i++){
        if(cmd.includes(CONFIG.get("public")[i])){
            logger.warn(`玩家${player.name}执行了黑名单命令: /${cmd}`);
            return false;
        };
    };
});
/********************************GUI表单********************************/
function MainGUI(pl){
    var fm = mc.newCustomForm()
    .setTitle(`${PLUGINS_JS}`)
    .addLabel(`欢迎使用${PLUGINS_JS}`)
    .addDropdown('选择操作类型',['添加/删除 命令','重载配置文件'])
    pl.sendForm(fm,(pl,id)=>{
        if(id==null){Close_Tell(pl)};
        if(id==null){return null}
        switch(id[1]){
            case 0:
                //添加/移除 命令
                add_remove_use(pl)
                break;
            case 1:
                //重载
                pl.tell(`${GAME_TELL}重载完成`)
                CONFIG_reload()
                break;
        }
    })
}

//添加/移除 命令
function add_remove_use(pl){
    let public = CONFIG.get('public')     //读取命令库
    var fm =mc.newCustomForm()
    .setTitle(`${PLUGINS_JS}`)
    .addInput('输入要添加的命令','命令')      //data 0
    .addDropdown('选择需要删除的命令',public)     //data 1
    .addSwitch('添加命令<-->删除命令',false)    //data 2 1
    .addSwitch('确认选择',false)    //data 3 1
    pl.sendForm(fm,(pl,data)=>{
        if(data==null){Close_Tell(pl)}
        if(!data) return null
        if(data[1]==null){return null}
        if(data[3] == 1){   //判断开关 确认选择 是否开启
            if(data[2] == 0){
                if(data[0] == ''){//判断输入框
                    pl.tell(`${GAME_TELL}错误！输入框为空，添加失败`)
                }
                else{
                    if(!/^[^/].*/.test(data[0])){//判断命令
                        pl.tell(`${GAME_TELL}错误！指令前面不要加 /`)
                    }
                    else{
                        if(public.indexOf(data[0]) !== -1){//判断重复
                            pl.tell(`${GAME_TELL}错误！命令已存在，无法重复添加`)
                        }
                        else{//添加
                            public.push(data[0])
                            CONFIG.set('public',public)
                            CONFIG_reload()
                            pl.tell(`${GAME_TELL}重载配置文件完成!`)
                            pl.sendModalForm(`${PLUGINS_JS}`,'添加完成，是否继续？','继续','关闭',(pl,id)=>{
                                if(id==null){Close_Tell(pl)}
                                if(id==true){add_remove_use(pl)}
                                if(id==false){Close_Tell(pl)}
                            })
                        }
                    }
                    
                }
            }
            else{//删除
                public.splice(data[1],1)
                CONFIG.set('public',public)
                CONFIG_reload()
                pl.tell(`${GAME_TELL}重载配置文件完成!`)
                pl.sendModalForm(`${PLUGINS_JS}`,'删除成功！是否继续？','继续','关闭',(pl,id)=>{
                    if(id==null)(Close_Tell(pl))
                    if(id==true){add_remove_use(pl)}
                    if(id==false){Close_Tell(pl)}
                })
            }
        }
        else{
            //关闭 返回表单
            add_remove_use(pl)
        }
    })
}

colorLog('green',`${PLUGINS_NAME}加载成功！作者：${PLUGINS_AUTHOR}`)