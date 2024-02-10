//LiteLoaderScript Dev Helper
/// <reference path="c:\Users\Administrator\Documents\aids/dts/HelperLib-master/src/index.d.ts"/> 
//!DEV预览模式
const DEV = false

/**
 * 插件模板:YoyoRobot 机器人ws 对接模板
 * 作者:Yoyo
 * 版本:v0.0.3/4
 */

/**
 *  注册插件
 */
const PLUGINS_NAME = 'QSgin';
const PLUGINS_JS = '在Q群签到';
const PLUGINS_VERSION = [2, 0, 0];
const PLUGINS_ZZ = 'PPOUI';
const PLUGINS_URL = 'https://www.minebbs.com/resources/qsgin-q-yoyorobot.5271/';
ll.registerPlugin(
    /* name */ PLUGINS_NAME,
    /* introduction */ PLUGINS_JS,
    /* version */ PLUGINS_VERSION,
    /* otherInformation */ {
        '作者': PLUGINS_ZZ,
        '发布网站': PLUGINS_URL
    }
); let Gm_Tell;
if (DEV !== false) {
    logger.setTitle(PLUGINS_NAME + ' Dev')
    logger.setConsole(true, 5)
    Gm_Tell = `§e[§d${PLUGINS_NAME} §cDev§e] §r§a`
    logger.warn('已开启DEV模式  将会输出Debug信息')
}
else {
    Gm_Tell = `§e[§d${PLUGINS_NAME}§e] §r§a`
    logger.setTitle(PLUGINS_NAME)
    logger.setConsole(true, 4)
}
logger.setFile(`./logs/${PLUGINS_NAME}.log`, 4)

/**
 *  释放/加载 配置文件
 */
const Conf_init = {
    "Config": {
        "Enable": true,//总开关
        "Group": [],
        "Admin": [],
        "WebSocket": {
            "host": "127.0.0.1",
            "port": 5000,
            "key": "TqMZ6TsRbH"
        },
        "Charts": 10,//排行榜默认行数
        //积分设置
        "Integral": {
            "Random": true,//随机积分
            "IncreasePoints": 10,//固定积分
            "Random_Range": "0-100"//随机范围
        },
        //签到图片/随机图片
        "Sgin_image": {
            "Enable": false,//开关
            "Img_URL": ""//图片API地址
        },
        //经济配置
        "Money": {
            "LLMoney": true,//LL经济接口
            "Money_Name": "经济",//货币名称
            "taxRate": "0.20",//税率 0.0-0.99
            "Money_Cmd": "money add ${Player} ${Money}"//加钱命令
        },
        //游戏签到配置
        "Game_Sgin": {
            "Sgin": true,// 是否启用游戏签到
            "Sgin_init": false,//游戏内首次签到是否生成数据
            "Key_Exchange": true,// 游戏内首签是否生成数据
            "From_Txt": "请选择一个操作\nCDK请在Q群兑换获取CDK"//表单公告
        }
    },
    "UserData": {
        "data": [],
        "CDK": []
    },
    "Reg": [
        {
            "name": "^签到帮助$",
            "msg": "请仔细阅读～",
            "img": "https://mcid.25565.top/QSgin_Cmd.jpeg",
            "type": "help",
            "Admin": false,
            "Enable": true
        },
        {
            "name": "^签到$",
            "type": "sgin",
            "Admin": false,
            "Enable": true
        },
        {
            "name": "^打卡$",
            "type": "sgin",
            "Admin": false,
            "Enable": true
        },
        {
            "name": "^随机图片$",
            "type": "image",
            "Admin": false,
            "Enable": true
        },
        {
            "name": "^兑换\\s[1-9]\\d*$",
            "type": "convert",
            "Admin": false,
            "Enable": true
        },
        {
            "name": "^积分排行$",
            "type": "charts",
            "Admin": false,
            "Enable": true
        },
        {
            "name": "^积分查询$",
            "type": "check",
            "Admin": false,
            "Enable": true
        },
        {
            "name": "^生成CDK\\s[1-9]\\d*$",
            "type": "cdks",
            "Admin": true,
            "Enable": true
        },
        {
            "name": "^数据更新$",
            "type": "update",
            "Admin": true,
            "Enable": true
        },
        {
            "name": "^猜数字\\s\\d+\\-\\d+$",
            "type": "suspect",
            "Admin": false,
            "Enable": true
        },
        {
            "name": "^[1-9]\\d*$",
            "type": "suspect1",
            "Admin": false,
            "Enable": true
        },
        {
            "name": "^停止猜数字$",
            "type": "suspect2",
            "Admin": false,
            "Enable": true
        }
    ]
}

let _Reg;//存储正则
//设置路径
const Path = `.\\Plugins\\${PLUGINS_ZZ}\\${PLUGINS_NAME}\\`
//释放/读取文件
let Config = data.openConfig(Path + 'Config.json', 'json', JSON.stringify(Conf_init.Config))
let UserData = data.openConfig(Path + 'UserData.json', 'json', JSON.stringify(Conf_init.UserData))
//判断正则文件是否存在
if (!File.exists(Path + "Reg.json")) {
    File.writeTo(Path + "Reg.json", JSON.stringify(Conf_init.Reg, null, 4))
    logger.error("正则文件<Reg>不存在，已释放正则文件")
}
else {
    _Reg = JSON.parse(File.readFrom(Path + "Reg.json"))
}
//设置重载
function Reloads() {
    Config.reload();
    UserData.reload();
    _Reg = JSON.parse(File.readFrom(Path + "Reg.json"))
    webConfig = Config.get("WebSocket")
    logger.info("Reload Ok")
}


/**
 *  主要功能
 */
let webConfig = Config.get("WebSocket")//读取配置项

class wsRobot {
    /**
     * 监听群聊事件
     * @param {Object} e 
     */
    messageGroup(e) {
        if (Config.get("Enable") == false) { return };
        if (!isTrue(0, e.group_id)) { return };
        let es = _Msg(e.raw_message);//解析消息
        logger.debug(es)
        if (es == null) {
            //es为null返回防止错误
            return;
        }
        else {
            //判断是否返回false
            if (es.code !== 0) {
                if (es.data.Enable == false) {
                    yoyo.client.sendGroupMsg(e.group_id, [yoyo.segment.at(e.sender.user_id), yoyo.segment.text("此功能已关闭\n如需使用请更改配置文件\nEnable: true")])
                    return;//功能已关闭
                }
                if (es.data.Admin == 1) {
                    //开启权限判断
                    if (!isTrue(1, e.user_id)) {
                        //无权限
                        yoyo.client.sendGroupMsg(e.group_id, [yoyo.segment.at(e.sender.user_id), yoyo.segment.text("此命令为管理员命令，无权限执行")])
                        return;
                    }
                }
                //未开启权限判断
                //yoyo.client.sendGroupMsg(e.group_id, [yoyo.segment.text("正在解析处理请求...")])
                switch (es.data.type) {
                    case "help":
                        //帮助
                        yoyo.client.sendGroupMsg(e.group_id, [es.data.msg, yoyo.segment.image(es.data.img)]);
                        break;
                    case "sgin":
                        //签到
                        if (_isSginData(0, e.user_id)) {
                            //true
                            if (!Recur_Sgin(e.user_id)) {
                                // 读取数据
                                let res = getSgin_Data(e.user_id)
                                let arr = UserData.get('data')
                                let gtime = system.getTimeObj()//获取系统时间
                                let stime = `${gtime.Y}-${gtime.M}-${gtime.D}`//设置时间格式
                                // 判断积分类型 处理签到数据
                                let jf;
                                if (Config.get('Integral').Random == true) {
                                    jf = Random_Number(Config.get('Integral').Random_Range);//随机分
                                }
                                else {
                                    jf = Config.get('Integral').IncreasePoints
                                }
                                arr[res].name = e.sender.card.replace(/\\/g, '')//保存名称
                                arr[res].Integral = arr[res].Integral + jf;//增加积分
                                arr[res].days++;//连续签到天数+1
                                arr[res].time = stime;//设置签到日期
                                UserData.set('data', arr)
                                //发送结果
                                let msg = [
                                    yoyo.segment.at(e.user_id),
                                    yoyo.segment.text(`签到成功！\n#获得积分: ${jf}\n#累计签到: ${arr[res].days}天\n#总积分: ${arr[res].Integral}`)
                                ]
                                if (Config.get('Sgin_image').Enable == true) { msg.push(yoyo.segment.image(Config.get('Sgin_image').Img_URL)) }
                                yoyo.client.sendGroupMsg(e.group_id, msg)
                            }
                            else {
                                yoyo.client.sendGroupMsg(e.group_id, [yoyo.segment.at(e.user_id), yoyo.segment.text(`今日已签到\n请勿重复签到`)])
                            }
                        }
                        else {
                            yoyo.client.sendGroupMsg(e.group_id, [yoyo.segment.at(e.user_id), yoyo.segment.text(`检测到无历史签到数据，已生成数据\n请再次发送${es.msg[0]}进行签到`)])
                        }
                        break;
                    case "image":
                        //随机图片
                        yoyo.client.sendGroupMsg(e.group_id, [yoyo.segment.image(Config.get('Sgin_image').Img_URL)])
                        break;
                    case "convert":
                        //兑换
                        if (_isSginData(0, e.user_id)) {
                            //读取数据
                            let arr = UserData.get('data')
                            let tmp = getSgin_Data(e.user_id)
                            //判断积分
                            if (arr[tmp].Integral < 10) {
                                yoyo.client.sendGroupMsg(e.group_id, [yoyo.segment.at(e.user_id), yoyo.segment.text('\n你的积分太少了\n以后再来换吧！')])
                                return;
                            }
                            if (es.msg[1] > arr[tmp].Integral) {
                                yoyo.client.sendGroupMsg(e.group_id, [yoyo.segment.at(e.user_id), yoyo.segment.text(`\n你还没有这么多积分！\n当前积分: ${arr[tmp].Integral}`)])
                                return;
                            }
                            //处理数据
                            let cdk = Release_CDK(es.msg[1])
                            arr[tmp].Integral = arr[tmp].Integral - es.msg[1]
                            UserData.set('data', arr)
                            // 发送结果
                            yoyo.client.sendGroupMsg(e.group_id, [yoyo.segment.at(e.user_id), yoyo.segment.text(`兑换成功！\n\n#兑换积分: ${es.msg[1]}\n#获得${Config.get('Money').Money_Name}: ${cdk.money}\n#剩余积分: ${arr[tmp].Integral}\n\nCDK已私信发送，请不要泄露哦\n如未收到CDK请找管理员查看日志`)])
                            yoyo.client.sendTempMsg(e.group_id, e.user_id, [yoyo.segment.text(`兑换时间: ${system.getTimeStr()}\n\n#CDK: ${cdk.CDK}\n\n请前往服务器输入/qsgin命令兑换\n此CDK只能使用一次，请不要泄露！`)])
                            logger.info(`#兑换事件   触发群聊: <${e.group_id}>    触发用户<${e.user_id}>   输入积分: <${es.msg[1]}>   兑换${Config.get('Money').Money_Name}: <${cdk.money}>    剩余积分: <${arr[tmp].Integral}>    CDK: <${cdk.CDK}>`)
                        }
                        else {
                            yoyo.client.sendGroupMsg(e.group_id, [yoyo.segment.at(e.user_id), yoyo.segment.text('\n你还没有签过到\n无积分数据！')])
                        }
                        break;
                    case "charts":
                        // 排行榜
                        // 使用sort方法排序
                        let tmp = UserData.get('data')
                        tmp.sort(function (a, b) {
                            // 从大到小排序
                            return b.Integral - a.Integral
                        }); let arr = tmp.slice(0, Config.get('Charts'));
                        let pm = 0; logger.debug(arr);
                        var msg = [yoyo.segment.text(` --积分排行榜--\n`)]
                        //循环获取内容
                        arr.forEach(i => {
                            pm++;//对排名进行+1
                            msg.push(yoyo.segment.text(`${pm}. ${i.name} : ${i.Integral}\n`))
                        });
                        //发送消息
                        msg.push(yoyo.segment.text(`---------------------\n仅显示前${Config.get('Charts')}个结果`))
                        yoyo.client.sendGroupMsg(e.group_id, msg)
                        break;
                    case "check":
                        //查询积分
                        if (_isSginData(0, e.user_id)) {
                            //读取数据
                            let arr = UserData.get('data')
                            let tmp = getSgin_Data(e.user_id)
                            yoyo.client.sendGroupMsg(e.group_id, [yoyo.segment.at(e.user_id), yoyo.segment.text(`\n你的积分为: ${arr[tmp].Integral}`)])
                        }
                        else {
                            yoyo.client.sendGroupMsg(e.group_id, [yoyo.segment.at(e.user_id), yoyo.segment.text('\n你还没有签过到\n无积分数据！')])
                        }
                        break;
                    case "update":
                        //更新签到数据
                        if (!Update_Data()) {
                            yoyo.client.sendGroupMsg(e.group_id, `执行失败！请检查是否按要求放入文件`)
                        }
                        else {
                            yoyo.client.sendGroupMsg(e.group_id, `更新数据成功!`)
                        }
                        break;
                    case "cdks":
                        let key = Release_CDK(es.msg[1])
                        yoyo.client.sendGroupMsg(e.group_id, [yoyo.segment.at(e.user_id), yoyo.segment.text(`生成CDK成功！\n\n#CDK经济: ${es.msg[1]}\n\nCDK已私信发送，请勿泄露`)])
                        yoyo.client.sendTempMsg(e.group_id, e.user_id, [yoyo.segment.text(`生成时间: ${system.getTimeStr()}\n\n#CDK: ${key.CDK}\n\nCDK只能使用一次，请不要泄露！`)])
                        break;
                    case "suspect":
                        //猜数字
                        suspect = 1//开启
                        suspect_num = Random_Number(es.msg[1])//生成随机数
                        yoyo.client.sendGroupMsg(e.group_id, `猜数字游戏已开启\n范围：${es.msg[1]}\n\n如需停止请发送: 停止猜数字`)
                        break;
                    case "suspect2":
                        suspect = 0
                        yoyo.client.sendGroupMsg(e.group_id, `已停止猜数字游戏!`)
                        break;
                    case "suspect1":
                        //猜数字处理
                        if (suspect == 1) {
                            //已开启
                            if (es.msg[0] == suspect_num) {
                                //猜对
                                yoyo.client.sendGroupMsg(e.group_id, [yoyo.segment.reply(e.message_id), yoyo.segment.at(e.user_id), yoyo.segment.text(`\n恭喜你猜对了！ \n\n随机数: ${suspect_num}\n\n继续游玩请发送\n猜数字 最小值-最大值`)])
                                suspect = 0//关闭
                            }
                            else {
                                if (es.msg[0] > suspect_num) {
                                    //大
                                    yoyo.client.sendGroupMsg(e.group_id, [yoyo.segment.reply(e.message_id), yoyo.segment.text(`猜大了`)])
                                }
                                if (es.msg[0] < suspect_num) {
                                    //小
                                    yoyo.client.sendGroupMsg(e.group_id, [yoyo.segment.reply(e.message_id), yoyo.segment.text(`猜小了`)])
                                }
                            }
                        }
                        else {
                            return
                        }
                        break;
                }
            }
        }
    }
}
let suspect;//存储猜数字状态
let suspect_num;//存储要猜数字

mc.regPlayerCmd("qsgin", "§b签到 §e§l| §r§aCDK兑换", (pl) => {
    pl.sendModalForm(`${PLUGINS_NAME} 菜单选项`, Config.get('Game_Sgin').From_Txt, "签到", "Key兑换", (pl, data) => {
        switch (data) {
            case null:
                pl.tell(Gm_Tell + '表单已放弃');
                break;
            case true:
                if (Config.get('Game_Sgin').Sgin == false) {
                    pl.tell(Gm_Tell + '此功能已关闭！')
                    return;
                }
                Sgin(pl)
                function Sgin(pl) {
                    let fm = mc.newCustomForm()
                        .setTitle(`${PLUGINS_NAME} 签到`)
                        .addInput('请输入你的QQ号', 'String')
                        .addSwitch('确认')
                    pl.sendForm(fm, (pl, data) => {
                        if (data == null) { pl.tell(Gm_Tell + '表单已放弃'); return }
                        if (data[1] == 1) {
                            if (data[0] !== '') {
                                if (isNumber(data[0])) {
                                    if (_isSginData(1, data[0])) {
                                        //true
                                        if (!Recur_Sgin(data[0])) {
                                            // 读取数据
                                            let res = getSgin_Data(data[0])
                                            let arr = UserData.get('data')
                                            let gtime = system.getTimeObj()//获取系统时间
                                            let stime = `${gtime.Y}-${gtime.M}-${gtime.D}`//设置时间格式
                                            // 判断积分类型 处理签到数据
                                            let jf;
                                            if (Config.get('Integral').Random == true) {
                                                jf = Random_Number(Config.get('Integral').Random_Range);//随机分
                                            }
                                            else {
                                                jf = Config.get('Integral').IncreasePoints
                                            }
                                            arr[res].Integral = arr[res].Integral + jf;//增加积分
                                            arr[res].days++;//连续签到天数+1
                                            arr[res].time = stime;//设置签到日期
                                            UserData.set('data', arr)
                                            //发送结果
                                            pl.tell(Gm_Tell + `签到成功！\n#获得积分: ${jf}\n#累计签到: ${arr[res].days}天\n#总积分: ${arr[res].Integral}`)
                                        }
                                        else {
                                            pl.tell(Gm_Tell + `今日已签到\n请勿重复签到`)
                                        }
                                    }
                                    else {
                                        pl.tell(Gm_Tell + `检测到无历史签到数据，已生成数据\n请再次发送命令进行签到`)
                                    }
                                }
                                else {
                                    pl.tell(Gm_Tell + '请输入数字！')
                                }
                            }
                            else {
                                pl.tell(Gm_Tell + '输入框为空！')
                            }
                        }
                        else {
                            Sgin(pl)
                        }
                    })
                }
                /**
                 * 判断传入值是否为数字
                 * @param {String} str 
                 * @returns 
                 */
                function isNumber(str) {
                    return !isNaN(str);
                }
                break;
            case false:
                if (Config.get('Game_Sgin').Key_Exchange == false) {
                    pl.tell(Gm_Tell + '此功能已关闭！')
                    return;
                }
                CDKey(pl)
                function CDKey(pl, key) {
                    let fm = mc.newCustomForm()
                        .setTitle(`${PLUGINS_NAME} CDKey兑换`)
                    if (key == null || key == '') {
                        fm.addInput('请输入机器人给你的CDKey', 'String')
                    }
                    else {
                        fm.addInput('请输入机器人给你的CDKey', 'String', key)
                    }
                    fm.addSwitch('确认')
                    pl.sendForm(fm, (pl, data) => {
                        if (data == null) { pl.tell(Gm_Tell + '表单已放弃'); return }
                        if (data[1] == 1) {
                            if (data[0] !== '') {
                                let arr = UserData.get('CDK'); let resl;
                                for (var i = 0; i < arr.length; i++) {
                                    if (data[0] == arr[i].cdk) {
                                        resl = i;
                                        break;
                                    }
                                }
                                if (resl == null || resl == undefined) {
                                    pl.tell(Gm_Tell + 'CDK无效或错误！')
                                    CDKey(pl, data[0])
                                    return
                                }
                                _addMoney(`${arr[resl].money}`)
                                arr.splice(resl, 1)
                                UserData.set('CDK', arr)
                                pl.tell(Gm_Tell + `兑换完成 CDK已失效\n如未收到${Config.get('Money').Money_Name}请联系管理员查看日志获取`)
                                logger.info(`CDK兑换事件    触发玩家: <${pl.realName}>    输入CDK: <${data[0]}>`)
                                /** 
                                 *  给玩家添加经济
                                 * @param {Number} money 经济
                                 * @returns 
                                 */
                                function _addMoney(money) {
                                    let run_code;//存储状态
                                    if (Config.get("Money").LLMoney == true) {
                                        //LLMoney
                                        run_code = pl.addMoney(parseInt(money))
                                    }
                                    else {
                                        //命令添加
                                        let rn = `"${pl.realName}"`
                                        let res = mc.runcmdEx(Config.get('Money').Money_Cmd.replace('${Player}', rn).replace('${Money}', money));
                                        run_code = res.success;
                                        logger.debug(res.output)
                                    }
                                    return run_code
                                }
                            }
                            else {
                                pl.tell(Gm_Tell + '输入框为空！')
                            }
                        }
                        else {
                            CDKey(pl, data[0])
                        }
                    })
                }
                break
        }
    })
})



/**
 * 旧签到数据更新
 */
function Update_Data() {
    if (File.exists(Path + 'Update_False')) {
        return false;
    }
    if (!File.exists(Path + 'old.json')) {
        return false;
    }
    let up = []//存储新数据
    let old = JSON.parse(File.readFrom(Path + 'old.json'))
    let ol = old.data;//指定数据
    for (var i = 0; i < ol.length; i++) {
        let user = {
            "qq": ol[i].qq,//用户QQ
            "name": "",//用户名称
            "Integral": ol[i].Integral,//积分
            "days": ol[i].days,//累计签到天数
            "time": ol[i].time//最后签到时间
        };
        up.push(user)
    }
    UserData.set('data', up);//覆盖写入
    data.openConfig(Path + 'Update_False', 'txt', 'null')
    return true
}


/**
 * 释放CDK
 * @param {Number} socre 传入用户积分 
 * @returns 
 */
function Release_CDK(socre) {
    let tmp = UserData.get('CDK')
    let key = generateID()
    let money = exchange_Money(socre)
    let cdk = {
        "cdk": key,
        "money": money
    }
    tmp.push(cdk)
    UserData.set('CDK', tmp)
    return {
        "CDK": key,
        "money": money
    }
}
/**
 * 生成10位随机ID
 * @returns 返回ID
 */
function generateID() {
    // 定义一个空字符串
    let str = '';
    // 定义一个字符串，包含0-9，a-z
    let char = '0123456789abcdefghijklmnopqrstuvwxyzQWERTYUIOPASDFGHJKLZXCVBNM';
    // 遍历10次
    for (let i = 0; i < 10; i++) {
        // 随机取一个字符
        let index = Math.floor(Math.random() * char.length);
        // 拼接字符
        str += char[index];
    }
    return str;
}
/**
 * 税率计算
 * @param {Number} score 传入积分
 * @return {Number} 返回积分
 */
function exchange_Money(score) {
    // 读取设置的税率
    let taxRate = Config.get("Money").taxRate
    // 将传入的积分数值乘以变量taxRate的比例
    let money = (1 - taxRate) * score
    // 将兑换后的金额向下取整
    money = Math.floor(money);
    // 返回兑换后的金额
    return money;
}


/**
 * 判断用户是否有签到数据
 * @param {Number} num 模式 0 Q群 ｜ 1 游戏
 * @param {Number} qq 用户QQ
 * @returns true 有 | false 无
 */
function _isSginData(num, qq) {
    let tmp = UserData.get("data");
    if (tmp.some(its => its.qq == qq)) {
        return true
    }
    else {
        if (num == 1) {
            if (Config.get('Game_Sgin').Sgin_init == false) {
                return null
            }
        }
        let user = {
            "qq": qq,//用户QQ
            "name": "",//用户名称
            "Integral": 0,//积分
            "days": 0,//累计签到天数
            "time": ""//最后签到时间
        };
        tmp.push(user);
        UserData.set('data', tmp);
        Reloads()
        return false;
    }
}

/**
 * 随机数生成器
 * @param {String} str 传入范围
 * @returns 
 */
function Random_Number(str) {
    //将字符串转换为数组
    let arr = str.split('-');
    //获取最小值
    let min = parseInt(arr[0]);
    //获取最大值
    let max = parseInt(arr[1]);
    //获取随机数
    let randomNum = Math.floor(Math.random() * (max - min + 1) + min);
    //返回随机数
    logger.debug(`传入范围：${str}  随机数: ${randomNum}`)
    return randomNum;
}

/**
 * 判断用户是否重复签到
 * @param {Number} qq 用户QQ
 * @returns true 重复 | false 不重复
 */
function Recur_Sgin(qq) {
    let gtime = system.getTimeObj()//获取系统时间
    let stime = `${gtime.Y}-${gtime.M}-${gtime.D}`//设置时间格式
    let arr = UserData.get('data')//读取数据文件
    let result;//存储数组位置
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].qq == qq) {
            //qq匹配
            result = i
            break;
        }
    }
    if (arr[result].time !== stime) {
        return false
    }
    else {
        return true
    }
}

/**
 * 获取用户签到数据位置
 * @param {Number} qq 
 * @returns 数组位置
 */
function getSgin_Data(qq) {
    let arr = UserData.get('data')//读取数据文件
    let result;//存储数组位置
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].qq == qq) {
            //qq匹配
            result = i
            break;
        }
    }
    return result
}


/**
 * 解析群消息
 * @param {String} txt 待解析 文本/消息/字符串
 * @returns 成功则返回解析内容｜失败不返回
 */
function _Msg(txt) {
    // 遍历json数组
    for (let i = 0; i < _Reg.length; i++) {
        let regex = new RegExp(_Reg[i].name);
        // 正则表达式匹配字符串
        if (regex.test(txt)) {
            logger.debug('正则匹配', txt)
            return {
                "code": true,
                "msg": txt.split(" "),
                "data": _Reg[i]
            }
        }
    }
}

/**
 * 群聊/管理 判断
 * @param {String} str 类型：0=group / 1=admin
 * @param {Number} id 群号/QQ号
 * @returns 
 */
function isTrue(num, id) {
    let tmp;//存储读取的内容
    if (num == 0) { tmp = Config.get('Group') }
    if (num == 1) { tmp = Config.get('Admin') }
    //防止判断出错，整形转字符串
    let arr = tmp.map(String);
    if (Number.isInteger(id)) {
        id = id.toString();
    }
    //进行判断
    if (arr.indexOf(id) !== -1) {
        logger.debug(`${id} is true`)
        return true
    }
    else {
        logger.debug(`${id} is false`)
        return false
    }
}

colorLog('green', '加载完成！')
colorLog('green', `版本：${PLUGINS_VERSION}`)
colorLog('green', `作者：${PLUGINS_ZZ}`)
colorLog('green', `发布网站：${PLUGINS_URL}`)


/**
 * 下面的懒的看了，大佬写的咱看不懂（
 */
const wsc = new WSClient();
const wsRobotClass = new wsRobot();
const yoyo = {};
// 对象代理
yoyo.client = new Proxy({}, {
    get: (target, key) => (...ages) => {
        return new Promise((resolve, reject) => {
            let eventid = randStr();
            cache.funcArr[eventid] = resolve;//保存函数
            wsc.send(JSON.stringify({
                type: key,//api函数名
                data: ages,//对呀函数的数据
                eventid//事件id
            }));
        });
    }
});//代理client
yoyo.segment = {
    text: (text) => ({ type: 'text', text }),
    face: (id) => ({ type: 'face', id }),
    image: (url) => ({ type: 'image', file: url }),
    record: (url) => ({ type: 'record', url }),
    reply: (id) => ({ type: 'reply', id }),//0.0.4
    at: (qq) => ({ type: 'at', qq }),
    atall: () => ({ type: 'at', qq: 'all', text: '@全体成员' }),
    xml: (data) => ({ type: 'xml', data }),
};

const cache = {
    count: 1,
    funcArr: {}
};

connect();//连接


wsc.listen("onTextReceived", (msg) => {
    let objData = toJson(msg);
    if (objData && objData.post_type) {
        let eventName = ParseEvent(objData);
        if (!eventName) return;//错误事件名解析

        // 开发的时候可以通过这个得到事件名 (发布的时候请注释)
        logger.debug('事件名:', eventName);


        if (typeof wsRobotClass[eventName] == 'function') {
            // 有监听
            wsRobotClass[eventName](objData);//调用这个方法
        } else {
            // 没有监听
            logger.debug('没监听的', objData);
        }
    } else if (objData && objData.eventid) {
        if (typeof cache.funcArr[objData.eventid] == 'function') {
            cache.funcArr[objData.eventid](objData.data);//调用回调
            delete cache.funcArr[objData.eventid];//调用完 摧毁掉 释放内存
        }
    }
});

wsc.listen("onError", (msg) => {
    logger.error('发生错误!', msg);

});

wsc.listen("onLostConnection", (code) => {
    logger.error('连接断开 5 秒后尝试重新恢复连接,可能网络波动!');
    setTimeout(() => {
        connect();//连接
    }, 5000);

});

/**
 * json转Object
 * @param {String} text 
 * @returns 
 */
function toJson(text) {
    try {
        return JSON.parse(text);
    } catch (error) {
        return null;
    }
}

/**
 * 连接websocket
 */
function connect() {
    wsc.connectAsync(`ws://${webConfig.host}${webConfig.port ? (':' + webConfig.port) : webConfig.port}/${webConfig.key}`, res => {
        if (!res) {
            logger.error('连接失败 10 秒后尝试重新建立连接,请确保地址和key正确! 补充：记得开启WebSocket！');
            setTimeout(() => {
                connect();//连接
            }, 10000);
            return;
        }
        colorLog('green', `[WebSocket] 连接成功! 目标IP: ${webConfig.host}  端口: ${webConfig.port}`);
    });
}

/**
 * 首字母大写
 * @param {String} str 
 * @returns 
 */
function titleCase5(str) {
    return str.toLowerCase().replace(/( |^)[a-z]/g, (L) => L.toUpperCase());
}

/**
 * 解析事件名
 * @param {Object} datas 
 * @returns 
 */
function ParseEvent(datas) {
    let eventName = null;
    try {
        if (!datas.sub_type || datas.sub_type == 'normal') {
            eventName = datas.post_type + titleCase5(datas[`${datas.post_type}_type`]);
        } else {
            eventName = datas.post_type + titleCase5(datas[`${datas.post_type}_type`]) + titleCase5(datas.sub_type);
        }
        return eventName;

    } catch (error) {
        logger.error('解析事件名错误!');
        return null;
    }
}

function randStr() {
    cache.count++;
    let arr_str = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'];
    return String(`${Date.now()}${randNum(100, 999)}`).match(/./g).map(v => (Number(v) % 2 == 0) ? arr_str[Number(v)].toUpperCase() : arr_str[Number(v)]).join('') + cache.count;
}

function randNum(min = 0, max = 255) {
    return Math.floor(Math.random() * max) + min;
}