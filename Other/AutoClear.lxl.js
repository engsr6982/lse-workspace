//LiteLoaderScript Dev Helper
/// <reference path="c:\Users\X\Documents\LiteLoaderSE-Aids/dts/HelperLib-master/src/index.d.ts"/> 

//注册函数
let pl_name = "AutoClear";
let pl_js = "自动清理掉落物";
let zuozhe = "PPOUI";
let versin = [1,0,0];
let url = "https://www.minebbs.com/resources/autoclear-_.4785/";

//设置日志头
logger.setTitle(`${pl_name}`);
logger.setConsole(true,4)

//注册插件
ll.registerPlugin(
    /* name */ pl_name,
    /* introduction */ pl_js,
    /* version */ versin,
    /* otherInformation */ {
        "作者":zuozhe,
        "发布链接":url
    }
); 

//配置文件
var pl_path = '.\\plugins\\'+`${pl_name}`+'\\Config.ini';
var conf = new IniConfigFile(`${pl_path}`)
conf.init("设置","设置间隔执行时间（单位：毫秒  警告：设置时间必须大于或等于5分钟）","300000")
conf.init("音效","是否启用音效（0为关闭 1为开启）","1")
var conf_time = conf.getInt("设置","设置间隔执行时间（单位：毫秒  警告：设置时间必须大于或等于5分钟）")//读取配置项
var conf_music = conf.getInt("音效","是否启用音效（0为关闭 1为开启）")
//检测设置的时间
if(conf_time>=300000){
    logger.info(`${pl_name}配置文件正确，正在加载插件...`)
    start()
}
    else{
        errorconf()
    }
//重复检测
function iftime(){
    if(conf_time>=300000){
        start()
    }
    else{
        errorconf()
    }
}

/*****************注册命令***************/
//查询已设置时间
mc.regConsoleCmd("conftime","查询已设置的时间",(pl)=>{
    times()
})
//设置时间
mc.regConsoleCmd("conftime set","设置时间",(args)=>{
    conf.set("设置","设置间隔执行时间（单位：毫秒  警告：设置时间必须大于或等于5分钟）",`${args}`)
    retime()
    return
})
//手动清理
mc.regPlayerCmd('autoclear','手动清理掉落物',(pl)=>{
    //mc.broadcast(`玩家${pl}启动了手动清理掉落物`)
    pl.tell(`${name1}清理任务已启动，请稍后...`)
    time30()
})
//重载命令
mc.regConsoleCmd('conftime reload','重载配置文件',(pl)=>{
    retime()
})

//重载
function retime(){
    conf.reload("设置间隔执行时间（单位：毫秒  警告：设置时间必须大于或等于5分钟）")
    conf.reload("是否启用音效（0为关闭 1为开启）")
    conf_time = conf.getInt("设置","设置间隔执行时间（单位：毫秒  警告：设置时间必须大于或等于5分钟）")
    conf_music = conf.getInt("是否启用音效（0为关闭 1为开启）")
    logger.info('重载成功')
    times()
    iftime()
}

//输出查询时间
function times(){
    colorLog("green",`当前已设置${conf_time}毫秒`)
}

//音效模块
function music(){
    if(conf_music==1){
        mc.runcmd('playsound note.pling @a ')
    }
}
function music1(){
    if(conf_music==1){
        mc.runcmd('playsound random.levelup @a ')
    }
}

/***************定时执行**************/
function start(){
    setTimeout((pl) => {
        time30()
    }, conf_time);
}

var name1 = `§d[${pl_name}]§r`
/***************延时执行**************/
function time30(){
    setTimeout((pl)=>{
        mc.broadcast(`${name1}§e将在30秒后清理掉落物`)
        logger.warn(`${name1}将在30秒后启动`)
        time15()
    },15000)
}

function time15(){
    setTimeout((pl)=>{
        mc.broadcast(`${name1}§e将在15秒后清理掉落物`)
        logger.warn(`${name1}将在15秒后启动`)
        time5()
    },10000)
}

function time5(){
    setTimeout((pl)=>{
        mc.broadcast(`${name1}§e倒计时：5`)
        logger.warn(`${name1}倒计时：5`)
        time4()
        music()
    },1000)
}

function time4(){
    setTimeout((pl)=>{
        mc.broadcast(`${name1}§e倒计时：4`)
        logger.warn(`${name1}倒计时：4`)
        time3()
        music()
    },1000)
}

function time3(){
    setTimeout((pl)=>{
        mc.broadcast(`${name1}§e倒计时：3`)
        logger.warn(`${name1}倒计时：3`)
        time2()
        music()
    },1000)
}

function time2(){
    setTimeout((pl)=>{
        mc.broadcast(`${name1}§e倒计时：2`)
        logger.warn(`${name1}倒计时：2`)
        time1()
        music()
    },1000)
}

function time1(){
    setTimeout((pl)=>{
        mc.broadcast(`${name1}§e清理中...`)
        logger.warn(`${name1}清理中...`)
        autoclear()
        music()
    },1000)
}

//清理
function autoclear(){
    mc.runcmd('kill @e[type=item]')
    mc.broadcast(`${name1}§a清理完成！`)
    colorLog('green',`${name1}自动清理成功！`)
    start()
    music1()
}

//错误
function errorconf(){
    logger.error(`${pl_name}错误！设置的时间过小  要求大于或等于5分钟`)
    logger.error(`${pl_name}错误！设置的时间过小  要求大于或等于5分钟`)
    setTimeout((pl) => {
        mc.runcmd('conftime set 300000')
        logger.warn(`${pl_name}检测到设置时间过小，已自动纠正`)
    }, 10000);
}

//输出信息
logger.info('#############################')
logger.info(`${pl_name}加载成功！`)
logger.info(`版本：${versin}`)
logger.info(`作者：${zuozhe}`)
logger.info(`发布网站：${url}`)
logger.info('本插件是免费的，如果你是付费购买说明你被坑了')
logger.info('转载请注明原作者和MineBBS链接')
logger.info('#############################')
