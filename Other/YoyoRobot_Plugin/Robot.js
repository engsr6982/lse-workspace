let Data =
{
    "post_type": "message", //消息类型
    "message_id": "GVRbZQpTUUkAAPmuDY/I5mPL9UIB",
    "user_id": 173232457, //发消息的用户
    "time": 1674310978,
    "seq": 63918,
    "rand": 227526886,
    "font": "宋体", //字体
    "message": [
        {
            "type": "text",
            "text": "测试"
        }
    ],
    "raw_message": "测试", //消息内容
    "message_type": "group",
    "sender": { //用户详细信息
        "user_id": 173232457,
        "nickname": "ㅤ",
        "card": "｜没事别@我｜",
        "sex": "male",
        "age": 16,
        "area": "",
        "level": 1,
        "role": "owner",
        "title": ""
    },
    "group_id": 424958821, //群号
    "group_name": "插件反馈群", //群名称
    "block": false,
    "sub_type": "normal",
    "anonymous": null,
    "atme": false,
    "atall": false,
    "group": {},
    "member": {},
    "self_id": 3305645319
}
//守护进程列表
var data =
{
    "code": 200,
    "data": {
        "status": 200,
        "data": [
            {
                "uuid": "7ab50ef0aea6422f8445599ab4ce0069",
                "ip": "localhost",
                "port": 24444,
                "available": 1,
                "remarks": "亿速云 - 香港"
            },
            {
                "uuid": "a4137402f1864ff993e558f79b8bc405",
                "ip": "182.61.28.179",
                "port": 24444,
                "available": 1,
                "remarks": "百度云 - 广州"
            }
        ],
        "time": 1674393281228
    }
}
//查询实例
var data =
{
    "code":200,
    "data":{// ↓ 会返回的值及其解释：200（正常，并返回相应内容）；400（请求参数不正确）；403（无权限）；500（服务器内部错误）
        "status":200,//状态码
        "data":{
            "page":1,//页码
            "pageSize":5,//每页显示实例数量
            "maxPage":1,//最大页书
            "data":[
                {
                    "instanceUuid":"65b16329fa274ae481badbe4d5774347",//实例UUID
                    "started":1,
                    // ↓ 会返回的值及其解释：-1（状态未知）；0（已停止）；1（正在停止）；2（正在启动）；3（正在运行）。下方同理
                    "status":3,
                    "config":{
                        "nickname":"TTFCraft | 生存服",//实例名称
                        "startCommand":"bedrock_server_mod.exe",//启动命令
                        "stopCommand":"stop",//关闭命令
                        "cwd":"C:\Users\Administrator\Desktop\生存服",//路径
                        "ie":"UTF-8",//输入编码
                        "oe":"UTF - 8",
                        "createDatetime":"2022 / 10 / 3",
                        "lastDatetime":"2023 / 1 / 22 14: 45",
                        "type":"minecraft / bedrock",//类型
                        "tag":[

                        ],
                        "endTime":"",
                        "fileCode":"UTF - 8",//文件编码
                        "processType":"general",
                        "updateCommand":"",
                        "crlf":2,
                        "actionCommandList":[

                        ],
                        "terminalOption":{
                            "haveColor":1,
                            "pty":0,
                            "ptyWindowCol":140,
                            "ptyWindowRow":40
                        },
                        "eventTask":{
                            "autoStart":1,
                            "autoRestart":1,
                            "ignore":0
                        },
                        "docker":{//Docker隔离
                            "containerName":"",
                            "image":"",
                            "ports":[

                            ],
                            "extraVolumes":[

                            ],
                            "memory":"Null",
                            "networkMode":"bridge",
                            "networkAliases":[

                            ],
                            "cpusetCpus":"",
                            "cpuUsage":"Null",
                            "maxSpace":"Null",
                            "io":"Null",
                            "network":"Null"
                        },
                        "pingConfig":{
                            "ip":"mc.25565.top",//状态IP
                            "port":19132,
                            "type":1
                        },
                        "extraServiceConfig":{
                            "openFrpTunnelId":"",
                            "openFrpToken":""
                        }
                    },
                    "info":{
                        "currentPlayers":-1,
                        "maxPlayers":-1,
                        "version":"",
                        "fileLock":0,
                        "playersChart":[
                            {
                                "value":-1
                            }
                        ],
                        "openFrpStatus":0
                    }
                }
            ]
        },
        "time":1674397682009
    }
}