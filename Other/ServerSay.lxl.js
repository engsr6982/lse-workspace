//LiteLoaderScript Dev Helper
/// <reference path="c:\Users\X\Documents\LiteLoaderSE-Aids/dts/HelperLib-master/src/index.d.ts"/> 


/********************#注册插件#********************/
let pl_name = "ServerSay";
let pl_js = "ServerSay服务器广播";
let zuozhe = "PPOUI";
let versin = [1,2,0];
let url = "https://www.minebbs.com/resources/serversay.4774/";

ll.registerPlugin(
    /* name */ pl_name,
    /* introduction */ pl_js,
    /* version */ versin,
    /* otherInformation */ {
        "作者":zuozhe,
        "发布链接":url
    }
); 
//设置日志头
logger.setTitle(`${pl_name}`)
logger.setConsole(true,4)

/********************#配置文件#********************/
var conf_path = ".\\Plugins\\"+`${pl_name}`+"\\Config.json"
var conf = new JsonConfigFile(`${conf_path}`)
conf.init("广播消息头","§e§l[广播]§r")
conf.init("定时开关","1")
conf.init("定时时间（单位:分钟）","10")
conf.init("内容","服务器Q群：12345666\n官网：https://xxxxxx")
//读取配置文件
var head = conf.get("广播消息头")
var kaiguan = conf.get("定时开关")
var shijian = conf.get("定时时间（单位:分钟）")
var neiron = conf.get("内容")
var times = `${shijian}`*`60000`//转换时间为毫秒

//重载文件
function conf_reload(){
    conf.reload("广播消息头")
    conf.reload("定时开关")
    conf.reload("定时时间（单位:分钟）")
    conf.reload("内容")
    head = conf.get("广播消息头")
    kaiguan = conf.get("定时开关")
    shijian = conf.get("定时时间（单位:分钟）")
    times = `${shijian}`*`60000`//转换时间为毫秒
    neiron = conf.get("内容")
    logger.info("重载配置文件完成")
}
logger.info(`当前已设置时间为${shijian}分钟`)
/********************#注册命令#********************/
mc.regConsoleCmd("conftime","查询已设置时间",(pl)=>{
    if(kaiguan=1){
        logger.info(`当前已设置时间为${shijian}分钟`)
    }
    else{
        logger.warn('检测到自动广播已关闭，查询失败')
    }
})
mc.regConsoleCmd('conftime reload','重载配置文件',(pl)=>{
    conf_reload()
})
/*mc.regConsoleCmd("conftime set","设置时间",(args)=>{
    conf.set("定时时间（单位:分钟）",`${args}`)
    conf_reload()
    return
})*/
mc.regConsoleCmd('serversay', '发送服务器广播', (pl)=>{
    says(pl)
})
mc.regPlayerCmd("says", "发送服务器广播", (pl)=>{
    says(pl)
})
/**********************#判断#**********************/
if(kaiguan=1){
    logger.info(`检测到已开启自动广播，将在${shijian}分钟后开始第一次广播`)
    setInterval(() => {
        auto_say()
    }, times);
}
else{
    logger.warn("检测到已关闭自动广播，插件将不会进行自动广播")
}
/********************#发送广播#********************/
function says(pl){
    mc.broadcast(`${head}`+`${neiron}`)
}
function auto_say(){
    mc.broadcast(`${head}`+`${neiron}`)
    logger.warn(`${head}`+`${neiron}`)
}
/********************#输出日志#********************/
logger.info('#########################')
logger.info(`§a${pl_name}加载成功！`)
logger.info(`版本:${versin}`)
logger.info(`§a作者：${zuozhe}`)
logger.info(`§a发布链接：${url}`)
logger.info('#########################')