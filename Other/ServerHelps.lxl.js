//LiteLoaderScript Dev Helper
/// <reference path="c:/Users\X\Documents\LiteloaderSE-Aids/JS/HelperLib-master/src/index.d.ts"/> 

/**********************************************
 * 第一次写插件，0基础所以有些Bug见谅
 * 本插件仅在Minebbs发布，禁止倒卖（转载请附上原发布地址链接和作者）
***********************************************/

//注册信息
let pl_name = "ServerHelps";//插件名称
let pl_js = "ServerHelps服务器帮助插件";//插件介绍
let version = [1,0,0];//插件版本
let author = "PPOUI";//作者
let other = "https://www.minebbs.com/resources/serverhelps-gui.4655/";//发布地址

//注册插件APi
ll.registerPlugin(pl_name, pl_js, version, {
    "作者":author,
    "下载链接":other
});

//【配置文件】创建或读取配置文件
const dir_path = './plugins/ServerHelps/';//文件目录变量
const config_path = dir_path+'config.ini';//配置文件目录变量

//判断配置文件是否存在
if(file.exists(config_path)==false){
    new IniConfigFile(".\\plugins\\ServerHelps\\config.ini");//创建ini配置文件
    file.writeTo(config_path,"测试\n服务器帮助\n服务器帮助");//写入内容
}

const Texts = file.readFrom(config_path);//读取配置文件内容

//注册命令
mc.listen("onServerStarted", () => {
    mc.regPlayerCmd('helps',pl_js,function(pl){//注册假命令
        pl.sendForm(MainGUI(),function(player,id) {//发送表单给玩家
            player.tell("§l§6[§eServer§aHelps§6] §d表单§c已关闭");//关闭表单提示
        });
        //pl.sendForm(MainGUI(),Main)
        function MainGUI(){//GUI主界面
            let fm = mc.newCustomForm();//新建表单对象
            fm.setTitle("服务器帮助");//设置表单标题
            fm.addLabel(`§a${pl_name} | 服务器帮助系统`);//添加一行文字
            fm.addLabel(`${Texts}`);
            //fm.addDropdown('选择需要查看的帮助',['服务器Q群/官网','经济系统']);//添加下拉菜单
            //fm.addStepSlider("页码"['1-服务器Q群/官网\nQ群:123456','2-服务器资源包\n1234567']);//步进滑块
            return fm;//返回结果
        }

/*        function Main(pl, dt){
            let fm = mc.newCustomForm();
            fm.setTitle("帮助-服务器官网");
            fm.addLabel("测试\n测试2");
            return fm;
        };*/
    });
});

//输出插件信息
log('========================');
log(`${pl_name} 加载成功!`)
log(`欢迎使用${pl_name}插件！`)
log(`插件版本: ${version.join(".")}`)
log(`插件作者: ${author}`)
log(`发布网站: ${other}`)
log('========================');