//LiteLoaderScript Dev Helper
/// <reference path="c:\Users\Administrator\Documents\aids/dts/HelperLib-master/src/index.d.ts"/> 

const PLUGINS_NAME = 'Login';
const PLUGINS_JS = 'Login';
const PLUGINS_VERSION = [1, 1, 0];
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

// 判断释放配置文件
const Path = `.\\Plugins\\PPOUI\\Login\\`;
const __inits = {
    "_Config": {
        "whiteList": [],
        "residenceTime": 1,
        "offlineTime": 30,
        "achievementBarPrompt": true,
        "passwordRegular": "^[a-zA-Z]\\w{5,17}$",
        "loginPrompt": "登录xxx服务器\n\n%OUTPUT%",
        "loginSucceeded": "登录成功！欢迎加入xxx服务器",
        "registrationTips": "欢迎注册\n\n密码(以字母开头，长度在6~18之间，只能包含字母、数字和下划线)\n%OUTPUT%",
        "coordinate": {
            "Enable": true,
            "pullBackInPlace": false,
            "x": "-341",
            "y": "68",
            "z": "-232",
            "dimid": 0
        }
    }
}
let Config = data.openConfig(Path + 'Config.json', 'json', data.toJson(__inits._Config));
let db = new KVDatabase(Path + 'DB');//使用键值数据库存储
// 缓存列表
let TO_BE_LOGGED_IN = [];// 待登录
let LOGIN_SUCCEEDED = [];// 登陆成功
let OFFLINE_PLAYER = [];// 下线玩家

// 时间转换处理模块
const TIME_MODULE = {
    /**
     * 根据传入分钟获取截止时间
     * @param {Number} min 分钟
     * @returns 
     */
    FormatDate(min) {
        var date = new Date(new Date().getTime() + min * 60000);
        var y = date.getFullYear(),
            m = date.getMonth() + 1,
            d = date.getDate(),
            h = date.getHours(),
            i = date.getMinutes(),
            s = date.getSeconds();
        if (m < 10) { m = '0' + m; }
        if (d < 10) { d = '0' + d; }
        if (h < 10) { h = '0' + h; }
        if (i < 10) { i = '0' + i; }
        if (s < 10) { s = '0' + s; }
        return y + '-' + m + '-' + d + ' ' + h + ':' + i + ':' + s;
    },
    /**
     *  根据传入日期时间判断
     * @param {String} rq 解封时间
     * @returns true/1 解 | false/0 封
     */
    isDate(rq) {
        if (new Date(rq).getTime() <= new Date().getTime()) {
            return true;
        }
        else {
            return false;
        }
    }
}

// 注册命令
const Cmd = mc.newCommand('login', '登录', PermType.Any);
Cmd.overload([]);
Cmd.setCallback((cmd, ori, out, res) => {
    if (db.get(ori.player.realName) == null) return;
    Forms.CHANGE_PASSWORD_FORM(ori.player)
})
Cmd.setup();

// 监听进服事件
mc.listen('onJoin', function (pl) {
    if (pl.isSimulatedPlayer()) {
        return;// 模拟玩家无需登录
    }
    if (Config.get('whiteList').find(w => w === pl.realName)) return;
    if (LOGIN_SUCCEEDED.find(i => i === pl.realName)) return;//有登陆记录
    if (OFFLINE_PLAYER.find(n => n.name === pl.realName)) {
        // 在离线时间内, 重新计算时间
        let res = OFFLINE_PLAYER.findIndex(y => y.name === pl.realName);
        OFFLINE_PLAYER.splice(res, 1);
        LOGIN_SUCCEEDED.push(pl.realName);
        Tell(pl, '欢迎回来')
        return;
    }
    // 无登录成功记录
    if (db.get(pl.realName) == null) {
        // 无数据，注册
        Forms.REGISTRATION_FORM(pl);
    }
    else {
        // 有数据，登录
        Forms.LOGIN_FORM(pl, db.get(pl.realName));
    }
    TO_BE_LOGGED_IN.push({//加入待登录列表
        "name": pl.realName,
        "end": TIME_MODULE.FormatDate(Config.get('residenceTime')),
        "pos": {// 原地拉回坐标
            "x": pl.pos.x,
            "y": pl.pos.y,
            "z": pl.pos.z,
            "dimid": pl.pos.dimid
        }
    });
})

// 循环检查登录超时
setInterval(() => {
    if (TO_BE_LOGGED_IN.length === 0) { return }
    for (let i = 0; i < TO_BE_LOGGED_IN.length; i++) {
        if (TIME_MODULE.isDate(TO_BE_LOGGED_IN[i].end)) {
            // 超时
            let pl = mc.getPlayer(TO_BE_LOGGED_IN[i].name);
            if (pl == null) {
                TO_BE_LOGGED_IN.splice(i, 1);
            }
            else {
                pl.kick('登录超时');
                TO_BE_LOGGED_IN.splice(i, 1);
            }
        }
    }
}, 10000)

// 循环拉回坐标
setInterval(() => {
    if (!Config.get('coordinate').Enable == true) return;
    if (TO_BE_LOGGED_IN.length === 0) return;
    let pos = Config.get('coordinate');
    for (let i = 0; i < TO_BE_LOGGED_IN.length; i++) {
        let pl = mc.getPlayer(TO_BE_LOGGED_IN[i].name);
        if (pl == null) {
            TO_BE_LOGGED_IN.splice(i, 1);
        }
        else {
            if (Config.get('coordinate').pullBackInPlace == true) {
                // 原地拉回
                pl.teleport(
                    Number(TO_BE_LOGGED_IN[i].pos.x),
                    Number(TO_BE_LOGGED_IN[i].pos.y),
                    Number(TO_BE_LOGGED_IN[i].pos.z),
                    parseInt(TO_BE_LOGGED_IN[i].pos.dimid)
                )
            }
            else {// 拉回设置坐标
                pl.teleport(Number(pos.x), Number(pos.y), Number(pos.z), parseInt(pos.dimid));
            }
        }
    }
}, 400);

// 循环检查玩家离线
setInterval(() => {
    if (LOGIN_SUCCEEDED.length === 0) return;
    for (let i = 0; i < LOGIN_SUCCEEDED.length; i++) {
        if (mc.getPlayer(LOGIN_SUCCEEDED[i]) == null) {
            OFFLINE_PLAYER.push({// 玩家下线，指定时间内无需重新登录
                "name": LOGIN_SUCCEEDED[i],
                "end": TIME_MODULE.FormatDate(Config.get('offlineTime'))
            });
            LOGIN_SUCCEEDED.splice(i, 1);
        }
    }
}, 120000);

// 循环检查离线是否超出时长
setInterval(() => {
    if (OFFLINE_PLAYER.length === 0) return;
    for (let i of OFFLINE_PLAYER) {
        if (TIME_MODULE.isDate(i.end)) {
            // 离线超出时长
            let res = OFFLINE_PLAYER.findIndex(n => n.name === i.name);
            OFFLINE_PLAYER.splice(res, 1);
        }
    }
}, 120000);

// 表单模块
const Forms = {
    CHANGE_PASSWORD_FORM(pl) {
        let fm = mc.newCustomForm();
        fm.setTitle('Login 修改密码');
        fm.addInput('输入新密码', 'PassWord', db.get(pl.realName));
        pl.sendForm(fm, (pl, dt) => {
            if (dt == null) return;
            if (dt[0] == '') return Tell(pl, '输入框为空！');
            if (dt[0] == db.get(pl.realName)) return Tell(pl, '新密码不能与旧密码相同！');
            let Reg = RegExp(Config.get('passwordRegular'));
            if (Reg.test(dt[0])) {
                db.set(pl.realName, dt[0]);
            }
            else {
                Tell(pl, '密码强度不足! ')
            }
        })
    },
    // 登录表单
    LOGIN_FORM(pl, password, text) {
        let fm = mc.newCustomForm();
        fm.setTitle('Login登录');
        fm.addLabel(Config.get("loginPrompt").replace(/%OUTPUT%/gm, text).replace(/undefined/gm, ''));
        fm.addInput('请输入密码', 'String');
        pl.sendForm(fm, (pl, dt) => {
            if (dt == null) return Forms.LOGIN_FORM(pl, db.get(pl.realName), '请登录后关闭表单');
            if (dt[1] == '') return Forms.LOGIN_FORM(pl, '输入框为空！');
            if (dt[1] == password) {
                // 登录成功
                Tell(pl, Config.get('loginSucceeded'));
                LOGIN_SUCCEEDED.push(pl.realName);
                let res = TO_BE_LOGGED_IN.findIndex(i => i.name === pl.realName);
                TO_BE_LOGGED_IN.splice(res, 1);
                logger.debug('登陆成功' + LOGIN_SUCCEEDED);
                logger.debug('待登录列表' + TO_BE_LOGGED_IN);
            }
            else {
                Forms.LOGIN_FORM(pl, db.get(pl.realName), '登录失败！密码错误');
            }
        })
    },
    // 注册表单
    REGISTRATION_FORM(pl, txt) {
        let fm = mc.newCustomForm();
        fm.setTitle('Login 注册');
        fm.addLabel(Config.get('registrationTips').replace(/%OUTPUT%/gm, txt).replace(/undefined/gm, ''));
        fm.addInput('输入密码', 'String');
        pl.sendForm(fm, (pl, dt) => {
            if (dt == null) return Forms.REGISTRATION_FORM(pl, '请注册登录后关闭表单');
            let Reg = new RegExp(Config.get('passwordRegular'));
            if (Reg.test(dt[1])) {
                //注册成功
                db.set(pl.realName, dt[1]);
                Forms.LOGIN_FORM(pl, db.get(pl.realName), '注册成功! 你的密码为' + db.get(pl.realName) + '请妥善保存');
            }
            else {
                //注册失败
                Forms.REGISTRATION_FORM(pl, '注册失败！密码强度不够');
            }
        })
    }
}

const Tell = (pl, txt) => {
    if (Config.get('achievementBarPrompt')) {
        pl.sendToast('[Login]插件', txt)
    }
    else {
        pl.tell(`[Login] ${txt}`)
    }
}

//API导出
function API(gn, va, zz) {
    switch (gn) {
        case 'get':
            return db.get(va);
        case 'set':
            return db.set(va, zz)
        case 'del':
            return db.delete(va);
        case 'list':
            return db.listKey()
        default:
            return null;
    }
}
ll.export(API, 'LoginAPI');

/*
logger.setLogLevel(5);
setInterval(() => {
    logger.debug('---------------------------------')
    logger.debug('键值数据库', db.listKey());
    logger.debug('待登录列表', TO_BE_LOGGED_IN)
    logger.debug('登陆成功', LOGIN_SUCCEEDED)
    logger.debug('下线玩家', OFFLINE_PLAYER)
    logger.debug('---------------------------------')
}, 5000)
*/