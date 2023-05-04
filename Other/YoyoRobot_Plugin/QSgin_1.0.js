//LiteLoaderScript Dev Helper
/// <reference path="c:\Users\X\Documents\Liteloader-Aids/dts/HelperLib-master/src/index.d.ts"/> 
const YAPI = require('./nodejs/yoyorobot/llseapi_0.0.1.js');//调用YoYoBot

const PLUGINS_NAME = 'QSgin'
const PLUGINS_JS = 'Q群签到插件'
const PLUGINS_ZZ = 'PPOUI'
const PLUGINS_VERSION = [1,0,0]
const PLUGINS_URL = ''

ll.registerPlugin(
    /* name */ PLUGINS_NAME,
    /* introduction */ PLUGINS_JS,
    /* version */ PLUGINS_VERSION,
    /* otherInformation */ {
        "作者":PLUGINS_ZZ,
        "发布网站":PLUGINS_URL
    }
); 
/**
 *  配置文件
 */
const Conf_Path = `.\\plugins\\${PLUGINS_NAME}\\`
const Conf_init = '{"group":[],"sgin_name":{"name1":"签到","name2":"打卡"},"IncreasePoints":10,"game_sgin":true,"game_init":false}'
const Data_init = '{"data":[]}'
let Config = data.openConfig(Conf_Path+'Config.json','json',Conf_init)
let Conf_data = data.openConfig(Conf_Path+'data.json','json',Data_init)
function Conf_reload(){
    Config.reload()
    Conf_data.reload()
    colorLog('green','Reload ok')
}
/**
 *  注册命令
 */
mc.regConsoleCmd('qsgin reload','reload data',Conf_reload)
if(Config.get('game_sgin')==true){
    mc.regPlayerCmd('qsgin','Q群签到 格式/qsgin qq号',qsgin)
}

/**
 *  调用机器人
 */
YAPI((YBot) => {
    //监听群消息
    YBot.listen('messageGroup',(sg)=>{
        //判断群聊是否再配置文件内
        if(Config.get('group').indexOf(JSON.stringify(sg.group_id)) !== -1){
            //在  判断消息是否为设置的
            if(sg.raw_message==Config.get('sgin_name').name1 || sg.raw_message==Config.get('sgin_name').name2){
                //是  判断是否有签到记录
                if(Conf_data.get('data').some(its=> its.qq == sg.user_id)){
                    //有签到记录  判断是否重复签到
                    let gtime = system.getTimeObj()//获取系统时间
                    let stime = `${gtime.Y}-${gtime.M}-${gtime.D}`//设置时间格式
                    let arr = Conf_data.get('data')//读取数据文件
                        let result;//存储数组位置
                        for(let i = 0; i < arr.length; i++){
                            if(arr[i].qq==sg.user_id){
                                //qq匹配
                                result=i
                            }
                        }
                    if(arr[result].time !== stime){
                        //不是重复签到  进行签到处理
                        arr[result].Integral= arr[result].Integral + Config.get('IncreasePoints');//增加积分
                        arr[result].days++;//连续签到天数+1
                        arr[result].time = stime;//设置签到日期
                        Conf_data.set('data',arr)
                        YBot.client.sendGroupMsg(sg.group_id, [YBot.segment.at(sg.user_id),YBot.segment.text(`签到成功！\n累计签到${Conf_data.get('data')[result].days}天\n积分增加：${Config.get('IncreasePoints')}\n当前积分为：${Conf_data.get('data')[result].Integral}`)]);
                    }
                    else{
                        //重复签到
                        YBot.client.sendGroupMsg(sg.group_id, [YBot.segment.at(sg.user_id),YBot.segment.text(`你今天已签到，请勿重复签到`)]);
                    }
                }
                else{
                    YBot.client.sendGroupMsg(sg.group_id, [YBot.segment.at(sg.user_id),YBot.segment.text(`检测到无历史签到记录，已创建数据\n请再次发送"${Config.get('sgin_name').name1}"或"${Config.get('sgin_name').name2}"进行签到`)]);
                    //无签到记录
                    let dttmp = Conf_data.get('data')
                    //预写入配置文件
                    let set_init = {
                        "qq": sg.user_id,
                        "Integral": 0,
                        "days": 0,
                        "time": ""
                    }
                    dttmp.push(set_init)
                    Conf_data.set('data',dttmp)
                }
            }
        }
    });
}, PLUGINS_NAME);

const Gm_Tell = `[${PLUGINS_NAME}] `
function qsgin(pl,arg){
    if(arg==null || arg==''){
        pl.tell(Gm_Tell+`请按格式进行签到！格式/qsgin qq号`)
        return
    }
    if(Conf_data.get('data').some(its=> its.qq == arg[0])){
        //有签到记录  判断是否重复签到
        let gtime = system.getTimeObj()//获取系统时间
        let stime = `${gtime.Y}-${gtime.M}-${gtime.D}`//设置时间格式
        let arr = Conf_data.get('data')//读取数据文件
            let result;//存储数组位置
            for(let i = 0; i < arr.length; i++){
                if(arr[i].qq==arg[0]){
                    //qq匹配
                    result=i
                }
            }
        if(arr[result].time !== stime){
            //不是重复签到  进行签到处理
            arr[result].Integral= arr[result].Integral + Config.get('IncreasePoints');//增加积分
            arr[result].days++;//连续签到天数+1
            arr[result].time = stime;//设置签到日期
            Conf_data.set('data',arr)
            pl.tell(Gm_Tell+`签到成功！\n积分增加：${Config.get('IncreasePoints')}\n当前积分为：${Conf_data.get('data')[result].Integral}`);
        }
        else{
            //重复签到
            pl.tell(Gm_Tell+`你今天已签到，请勿重复签到`);
        }
    }
    else{
        if(Config.get('game_init')==false){
            pl.tell(Gm_Tell+`检测到无历史签到记录，请前往Q群${Config.get('group')}进行签到`)
            return
        }
        else{
            pl.tell(Gm_Tell+`检测到无历史签到记录，已创建数据\n请再次发送"${Config.get('sgin_name').name1}"或"${Config.get('sgin_name').name2}"进行签到`);
            //无签到记录
            let dttmp = Conf_data.get('data')
            //预写入配置文件
            let set_init = {
                "qq": arg[0],
                "Integral": 0,
                "days": 0,
                "time": ""
            }
            dttmp.push(set_init)
            Conf_data.set('data',dttmp)
        }
    }
}

colorLog('green',`${PLUGINS_NAME}加载完成!`)
colorLog('green',`版本：${PLUGINS_VERSION}`)
colorLog('green',`作者：${PLUGINS_ZZ}`)
colorLog('green',`发布网站：${PLUGINS_URL}`)