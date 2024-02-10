//LiteLoaderScript Dev Helper
/// <reference path="c:\Users\Administrator\Documents\aids/dts/HelperLib-master/src/index.d.ts"/> 
//!DEV预览模式
const DEV = false

/**
 *  注册插件
 */
const PLUGINS_NAME = 'QMgr';
const PLUGINS_JS = '在Q群管理MCSM实例';
const PLUGINS_VERSION = [1, 0, 0];
const PLUGINS_ZZ = 'PPOUI';
const PLUGINS_URL = '';
ll.registerPlugin(
    /* name */ PLUGINS_NAME,
    /* introduction */ PLUGINS_JS,
    /* version */ PLUGINS_VERSION,
    /* otherInformation */ {
        '作者': PLUGINS_ZZ,
        '发布网站': PLUGINS_URL
    }
);
if (DEV !== false) {
    logger.setTitle(PLUGINS_NAME + ' Dev')
    logger.setConsole(true, 5)
    logger.warn('已开启DEV模式  将会输出Debug信息')
}
else {
    logger.setTitle(PLUGINS_NAME)
    logger.setConsole(true, 4)
}

/**
 *  释放/加载 配置文件
 */
const Conf_init = {
    "Config": {
        "Enable": true,
        "Group": [],
        "Admin": [],
        "WebSocket": {
            "host": "127.0.0.1",
            "port": 5000,
            "key": ""
        },
        "MCSM_Config": {
            "host": "http://127.0.0.1",
            "port": 23333,
            "apikey": ""
        },
        "Remote": [
            {
                "name": "守护进程1",
                "uuid": "a4137402hjs64ff993haoanf708756c405",
                "data": [
                    {
                        "name": "实例1",
                        "uuid": "c111b5f6c2184ahsis052cc46fe0b975"
                    },
                    {
                        "name": "实例2",
                        "uuid": "c111b5f6c2184ahkds052cc46fe0b975"
                    }
                ]
            },
            {
                "name": "守护进程2",
                "uuid": "7ab50ef0aea6422f844559gsjsce0069",
                "data": [
                    {
                        "name": "实例2",
                        "uuid": "2a729b64209a4e0d8poeibca1f6fe1d6e"
                    }
                ]
            }
        ]
    },
    "data": [
        {
            "name": "^帮助$",
            "msg": "请仔细阅读～",
            "img": "https://mcid.25565.top/robot_cmd.jpeg",
            "type": "help",
            "Admin": true,
            "Enable": true
        },
        {
            "name": "^守护进程列表$",
            "api_path": "/api/service/remote_services_list?apikey={}",
            "type": "get_list",
            "Admin": true,
            "Enable": true
        },
        {
            "name": "^启动\\s\\S+\\s\\S+$",
            "api_path": "/api/protected_instance/open?apikey={}&remote_uuid={}&uuid={}",
            "type": "instance",
            "Operate": "start",
            "Admin": true,
            "Enable": true
        },
        {
            "name": "^重启\\s\\S+\\s\\S+$",
            "api_path": "/api/protected_instance/restart?apikey={}&remote_uuid={}&uuid={}",
            "type": "instance",
            "Operate": "rest",
            "Admin": true,
            "Enable": true
        },
        {
            "name": "^关闭\\s\\S+\\s\\S+$",
            "api_path": "/api/protected_instance/stop?apikey={}&remote_uuid={}&uuid={}",
            "type": "instance",
            "Operate": "stop",
            "Admin": true,
            "Enable": true
        },
        {
            "name": "^终止\\s\\S+\\s\\S+$",
            "api_path": "/api/protected_instance/kill?apikey={}&remote_uuid={}&uuid={}",
            "type": "instance",
            "Operate": "kill",
            "Admin": true,
            "Enable": true
        },
        {
            "name": "^查询\\s\\S+\\s\\S+$",
            "api_path": "/api/service/remote_service_instances?apikey={}&remote_uuid={}&instance_name={}&page=1&page_size=5",
            "Admin": true,
            "type": "serach",
            "Enable": true
        },
        {
            "name": "^发送命令\\s\\S+\\s\\S+(.+)$",
            "api_path": "/api/protected_instance/command?apikey={}&remote_uuid={}&uuid={}&command={}",
            "Admin": true,
            "type": "command",
            "Enable": true
        }
    ]
}
let Data;
const Path = `.\\Plugins\\${PLUGINS_ZZ}\\${PLUGINS_NAME}\\`
let Config = data.openConfig(Path + 'Config.json', 'json', JSON.stringify(Conf_init.Config))
if (!File.exists(Path + "Data.json")) {
    File.writeTo(Path + "Data.json", JSON.stringify(Conf_init.data, null, 4))
    logger.error("Data文件不存在，已释放Data文件")
}
else {
    Data = JSON.parse(File.readFrom(Path + "Data.json"))
}
function Reloads() {
    Config.reload()
    Data = JSON.parse(File.readFrom(Path + "Data.json"))
    webConfig = Config.get("WebSocket")
    MCSM_Config = Config.get("MCSM_Config")
    logger.info("Reload Ok")
}
/**
 *  主要功能
 */
//读取配置项
let webConfig = Config.get("WebSocket")
let MCSM_Config = Config.get("MCSM_Config")

class wsRobot {
    /**
     * 监听群聊事件
     * @param {Object} e 
     */
    messageGroup(e) {
        if (Config.get("Enable") == false) { return };
        if (!isTrue(0, e.group_id)) { return };
        //logger.debug('接收群消息:', JSON.stringify(e));
        //yoyo.client.sendGroupMsg(e.group_id,'Hello world!'）
        //yoyo.client.sendGroupMsg(e.group_id, ['看美女', yoyo.segment.image('https://img1.baidu.com/it/u=4128078998,2997625627&fm=253&app=120&size=w931&n=0&f=JPEG&fmt=auto?sec=1673715600&t=a3782efc6d96e7881477f50f05857127')]);
        let es = _Msg(e.raw_message);//解析消息
        logger.debug(es)
        if (es == null) {
            //es为null返回防止错误
            return
        }
        else {
            //判断是否返回false
            if (es.code !== 0) {
                //判断权限
                if (isTrue(1, e.sender.user_id)) {
                    //有权限
                    if (es.data.Enable == false) {
                        yoyo.client.sendGroupMsg(e.group_id, [yoyo.segment.at(e.sender.user_id), yoyo.segment.text("此功能已关闭\n如需使用请更改配置文件\nEnable: true")])
                        return;//功能已关闭
                    }
                    yoyo.client.sendGroupMsg(e.group_id, [yoyo.segment.at(e.sender.user_id), yoyo.segment.text("\n解析处理请求...\n请勿重复调用！")])
                    switch (es.data.type) {
                        case "help":
                            //帮助
                            yoyo.client.sendGroupMsg(e.group_id, [es.data.msg, yoyo.segment.image(es.data.img)]);
                            break;
                        case "get_list":
                            //守护进程列表
                            Network(API_Analysis(es.data.api_path,MCSM_Config.apikey),(data)=>{
                                logger.debug(data)
                                if (data.code !== -1){
                                    if (data.data.status == 200){
                                        let arr = [yoyo.segment.text("• 守护进程列表\n")]; 
                                        for (var i=0; i < data.data.data.length; i++) {
                                            arr.push(yoyo.segment.text(`#名称: ${data.data.data[i].remarks}\n#UUID: ${data.data.data[i].uuid}\n`))
                                        }
                                        arr.push(yoyo.segment.text(`完成！共：${i}个守护进程`))
                                        yoyo.client.sendGroupMsg(e.group_id,arr)
                                    }
                                    else{
                                        yoyo.client.sendGroupMsg(e.group_id,[yoyo.segment.text(`请求错误！状态码：${data.data.status}\nMCSM消息: ${data.data.data}`)])
                                    }
                                }
                                else{
                                    yoyo.client.sendGroupMsg(e.group_id,[yoyo.segment.text(`请求失败！状态码:${data.code}\n请检查IP端口是否正确！`)])
                                }
                            })
                            break;
                        case "serach":
                            //查询实例
                            Network(API_Analysis(es.data.api_path, MCSM_Config.apikey, _Remote(0, es.msg[1]).remote, es.msg[2]), (data) => {
                                logger.debug(data)
                                if (data.code !== -1) {
                                    if (data.data.status == 200) {
                                        let arr = [yoyo.segment.text(`• 查询<${es.msg[1]}>的实例\n`)];
                                        let isarr = data.data.data.data;//降低长度
                                        for (var i = 0; i < isarr.length; i++) {
                                            let sw;//存储实例状态
                                            switch (isarr[i].status) {
                                                case -1: sw = "未知"; break;
                                                case 0: sw = "已停止"; break;
                                                case 1: sw = "正在停止"; break;
                                                case 2: sw = "正在启动"; break;
                                                case 3: sw = "正在运行"; break;
                                            }
                                            arr.push(yoyo.segment.text(`#UUID: ${isarr[i].instanceUuid}\n#名称: ${isarr[i].config.nickname}\n#状态: ${sw}\n#类型: ${isarr[i].config.type}\n-----------------------------\n`))
                                        }
                                        arr.push(yoyo.segment.text(`完成！共：${i}个实例`))
                                        yoyo.client.sendGroupMsg(e.group_id, arr)
                                    }
                                    else {
                                        yoyo.client.sendGroupMsg(e.group_id, [yoyo.segment.text(`请求错误！状态码：${data.data.status}\n状态码解释：\n400 参数不正确\n403 无权限\n500 服务器错误`)])
                                    }
                                }
                                else {
                                    yoyo.client.sendGroupMsg(e.group_id, [yoyo.segment.text(`请求失败！状态码:${data.code}\n请检查IP端口是否正确！`)])
                                }
                            })
                            break;
                        case "command":
                            //发送命令
                            Network(API_Analysis(es.data.api_path, MCSM_Config.apikey, _Remote(0, es.msg[1]).remote, _Remote(1, es.msg[1], es.msg[2]).instance, _Cmd(es.msg[3])), (data) => {
                                logger.debug(data)
                                if (data.code !== -1) {
                                    if (data.data.status == 200) {
                                        yoyo.client.sendGroupMsg(e.group_id, [
                                            yoyo.segment.text(`• 发送命令到实例<${es.msg[2]}>\n`),
                                            yoyo.segment.text(`#状态码:${data.data.status}\n#命令:${_Cmd(es.msg[3])}\n`),
                                            yoyo.segment.text(`---------------------------\n由于API问题，此接口不会返回数据！\n`)
                                        ])
                                    }
                                    else {
                                        yoyo.client.sendGroupMsg(e.group_id, [yoyo.segment.text(`请求错误！状态码：${data.data.status}\n状态码解释：\n400 参数不正确\n403 无权限\n500 服务器错误`)])
                                    }
                                }
                                else {
                                    yoyo.client.sendGroupMsg(e.group_id, [yoyo.segment.text(`请求失败！状态码:${data.code}\n请检查IP端口是否正确！`)])
                                }
                            })
                            break;
                        case "instance":
                            //操作实例
                            switch (es.data.Operate) {
                                case "start":
                                    Network(API_Analysis(es.data.api_path, MCSM_Config.apikey, _Remote(0, es.msg[1]).remote, _Remote(1, es.msg[1], es.msg[2]).instance), (data) => {
                                        logger.debug(data)
                                        if (data.code !== -1) {
                                            if (data.data.status == 200) {
                                                yoyo.client.sendGroupMsg(e.group_id, [
                                                    yoyo.segment.text(`• 启动实例<${es.msg[2]}>\n`),
                                                    yoyo.segment.text(`#状态码:${data.data.status}\n#UUID:${data.data.data.instanceUuid}\n`),
                                                    yoyo.segment.text(`---------------------------\n如需获取状态，请发送：\n查询 ${es.msg[1]} ${es.msg[2]}\n`)
                                                ])
                                            }
                                            else {
                                                yoyo.client.sendGroupMsg(e.group_id, [yoyo.segment.text(`请求错误！状态码：${data.data.status}\n状态码解释：\n400 参数不正确\n403 无权限\n500 服务器错误`)])
                                            }
                                        }
                                        else {
                                            yoyo.client.sendGroupMsg(e.group_id, [yoyo.segment.text(`请求失败！状态码:${data.code}\n请检查IP端口是否正确！`)])
                                        }
                                    })
                                    break;
                                case "rest":
                                    Network(API_Analysis(es.data.api_path, MCSM_Config.apikey, _Remote(0, es.msg[1]).remote, _Remote(1, es.msg[1], es.msg[2]).instance), (data) => {
                                        logger.debug(data)
                                        if (data.code !== -1) {
                                            if (data.data.status == 200) {
                                                yoyo.client.sendGroupMsg(e.group_id, [
                                                    yoyo.segment.text(`• 重启实例<${es.msg[2]}>\n`),
                                                    yoyo.segment.text(`#状态码:${data.data.status}\n#UUID:${data.data.data.instanceUuid}\n`),
                                                    yoyo.segment.text(`---------------------------\n如需获取状态，请发送：\n查询 ${es.msg[1]} ${es.msg[2]}\n`)
                                                ])
                                            }
                                            else {
                                                yoyo.client.sendGroupMsg(e.group_id, [yoyo.segment.text(`请求错误！状态码：${data.data.status}\n状态码解释：\n400 参数不正确\n403 无权限\n500 服务器错误`)])
                                            }
                                        }
                                        else {
                                            yoyo.client.sendGroupMsg(e.group_id, [yoyo.segment.text(`请求失败！状态码:${data.code}\n请检查IP端口是否正确！`)])
                                        }
                                    })
                                    break;
                                case "stop":
                                    Network(API_Analysis(es.data.api_path, MCSM_Config.apikey, _Remote(0, es.msg[1]).remote, _Remote(1, es.msg[1], es.msg[2]).instance), (data) => {
                                        logger.debug(data)
                                        if (data.code !== -1) {
                                            if (data.data.status == 200) {
                                                yoyo.client.sendGroupMsg(e.group_id, [
                                                    yoyo.segment.text(`• 停止实例<${es.msg[2]}>\n`),
                                                    yoyo.segment.text(`#状态码:${data.data.status}\n#UUID:${data.data.data.instanceUuid}\n`),
                                                    yoyo.segment.text(`---------------------------\n如需获取状态，请发送：\n查询 ${es.msg[1]} ${es.msg[2]}\n`)
                                                ])
                                            }
                                            else {
                                                yoyo.client.sendGroupMsg(e.group_id, [yoyo.segment.text(`请求错误！状态码：${data.data.status}\n状态码解释：\n400 参数不正确\n403 无权限\n500 服务器错误`)])
                                            }
                                        }
                                        else {
                                            yoyo.client.sendGroupMsg(e.group_id, [yoyo.segment.text(`请求失败！状态码:${data.code}\n请检查IP端口是否正确！`)])
                                        }
                                    })
                                    break;
                                case "kill":
                                    Network(API_Analysis(es.data.api_path, MCSM_Config.apikey, _Remote(0, es.msg[1]).remote, _Remote(1, es.msg[1], es.msg[2]).instance), (data) => {
                                        logger.debug(data)
                                        if (data.code !== -1) {
                                            if (data.data.status == 200) {
                                                yoyo.client.sendGroupMsg(e.group_id, [
                                                    yoyo.segment.text(`• 终止实例<${es.msg[2]}>\n`),
                                                    yoyo.segment.text(`#状态码:${data.data.status}\n#UUID:${data.data.data.instanceUuid}\n`),
                                                    yoyo.segment.text(`---------------------------\n如需获取状态，请发送：\n查询 ${es.msg[1]} ${es.msg[2]}\n`)
                                                ])
                                            }
                                            else {
                                                yoyo.client.sendGroupMsg(e.group_id, [yoyo.segment.text(`请求错误！状态码：${data.data.status}\n状态码解释：\n400 参数不正确\n403 无权限\n500 服务器错误`)])
                                            }
                                        }
                                        else {
                                            yoyo.client.sendGroupMsg(e.group_id, [yoyo.segment.text(`请求失败！状态码:${data.code}\n请检查IP端口是否正确！`)])
                                        }
                                    })
                                    break;
                            }
                            break;
                    }
                }
                else {
                    //无权限
                    yoyo.client.sendGroupMsg(e.group_id, [yoyo.segment.at(e.sender.user_id), yoyo.segment.text("此命令为管理员命令，无权限执行")])
                    return;
                }
            }
        }
    }
}

/**
 *  将#转换为空格
 * @param {String} txt 
 * @returns 
 */
function _Cmd(txt){
    return txt.replace(/#/g,' ')
}

/**
 * 获取守护进程/实例 UUID
 * @param {Number} num 模式 0获取守护进程 1守护进程+实例
 * @param {String} msg 守护进程名称
 * @param {String} msg1 实例名称
 * @returns 
 */
function _Remote(num, msg, msg1) {
    let Rem = Config.get("Remote")
    let arr = {
        "arr": [],
        "remote": "",
        "instance": ""
    }
    switch (num) {
        case 0:
            //获取守护进程
            for (let i = 0; i < Rem.length; i++) {
                if (msg == Rem[i].name) {
                    arr.arr.push(i)
                    arr.remote = Rem[i].uuid
                    break;
                }
            }
            break;
        case 1:
            //获取 守护进程+实例
            for (let i = 0; i < Rem.length; i++) {
                if (msg == Rem[i].name) {
                    arr.arr.push(i)
                    arr.remote = Rem[i].uuid
                    break;
                }
            }
            for (let x = 0; x < Rem[arr.arr[0]].data.length; x++) {
                if (msg1 == Rem[arr.arr[0]].data[x].name) {
                    arr.arr.push(x)
                    arr.instance = Rem[arr.arr[0]].data[x].uuid
                }
            }
            break;
    };
    logger.debug('获取uuid',arr)
    return arr
}

/**
 * 解析群消息
 * @param {String} txt 待解析 文本/消息/字符串
 * @returns 成功则返回解析内容｜失败不返回
 */
function _Msg(txt) {
    // 遍历json数组
    for (let i = 0; i < Data.length; i++) {
        let regex = new RegExp(Data[i].name);
        // 正则表达式匹配字符串
        if (regex.test(txt)) {
            logger.debug('正则匹配',txt)
            return {
                "code": true,
                "msg": txt.split(" "),
                "data": Data[i]
            }
        }
    }
}

/**
 *  网络请求
 * @param {String} url API路径
 * @param {*} callback 返回请求数据
 */
function Network(url, callback) {
    let urls = `${MCSM_Config.host}:${MCSM_Config.port}${url}`
    logger.debug("请求URL",urls)
    network.httpGet(urls, (status, data) => {
        let Get_JSON//待返回的数据
        if (status !== -1) {
            Get_JSON = JSON.parse(data)
        }
        else {
            logger.error(`请求MCSManager API失败！ 状态码：${status}\n请检查是否地址、端口、APIKey是否正确，如果跨域请开启API跨域！`)
        }
        callback({
            "code": status,
            "data": Get_JSON
        })
    })
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

/**
 *  API路径解析
 * @param {String} str 需要解析的API路径参数
 * @param  {...any} args 需要替换的参数
 * @returns 返回解析完成的内容
 */
function API_Analysis(str, ...args) {
    let i = 0;
    //logger.debug("解析API路径",str.replace(/\{\}/g, () => args[i++]))
    return str.replace(/\{\}/g, () => args[i++])
}


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
        if(typeof cache.funcArr[objData.eventid] == 'function') {
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