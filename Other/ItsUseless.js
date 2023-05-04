//LiteLoaderScript Dev Helper
/// <reference path="c:\Users\Administrator\Documents\aids/dts/HelperLib-master/src/index.d.ts"/> 

/**
 *  注册插件
 */
const PLUGINS_NAME = "ItsUseless";
const PLUGINS_JS = `${PLUGINS_NAME} 没啥用`;
const PLUGINS_VERSION = [0, 0, 1];
const PLUGINS_ZZ = "PPOUI";
const PLUGINS_URL = "";
ll.registerPlugin(
    /* name */ PLUGINS_NAME,
    /* introduction */ PLUGINS_JS,
    /* version */ PLUGINS_VERSION,
    /* otherInformation */ {
        "作者": PLUGINS_ZZ,
        "发布网站": PLUGINS_URL
    }
);
let Gm_Tell = `§e§l[§d${PLUGINS_NAME}§e]§r§b `;
if (File.exists(`.\\plugins\\${PLUGINS_ZZ}\\debug`)) {
    logger.setTitle(PLUGINS_NAME + ' Debug');
    logger.setLogLevel(5);
    logger.warn('你已开启Debug模式，将会输出Debug信息');
    Gm_Tell = `§e§l[§d${PLUGINS_NAME}§c Debug§e]§r§b `;
    mc.listen("onUseItemOn", (pl, it, bl, si) => {
        if (it.type == 'minecraft:stick') {
            pl.runcmd("te");
        }
    })
}

const FilePath = `.\\Plugins\\${PLUGINS_ZZ}\\${PLUGINS_NAME}\\`
const Config = data.openConfig(FilePath + 'Config.json', 'json', JSON.stringify({
    "RegCmd": {
        "name": "te",
        "Describe": "test"
    }
}))

const Cmd = mc.newCommand(Config.get('RegCmd').name, Config.get('RegCmd').Describe, PermType.Any);
Cmd.overload();
Cmd.setCallback((_, ori, out, res) => {
    if (ori.player == null) return out.error('获取玩家对象失败');
    Main(ori.player)
});
Cmd.setup();

const API_HOSTS = `http://localhost:60020`

function Main(pl) {
    const fm = mc.newSimpleForm();
    fm.setTitle(PLUGINS_NAME);
    fm.setContent(PLUGINS_JS);
    fm.addButton('一言(毒鸡汤)');
    fm.addButton('今天吃什么');
    fm.addButton('答案之书');
    fm.addButton('今日运势');
    pl.sendForm(fm, (pl, id) => {
        switch (id) {
            case 0:
                ABriefRemark(pl)
                function ABriefRemark(pl) {
                    GET(API_HOSTS + '/api/?type=yy', dt => {
                        pl.sendModalForm(`一言`, dt.data, "换一个", "返回主页", (pl, res) => {
                            switch (res) {
                                case true:
                                    ABriefRemark(pl)
                                    break;
                                case false:
                                    Main(pl)
                                    break;
                                default:
                                    Close(pl)
                                    break;
                            }
                        })
                    })
                }
                break;
            case 1:
                WhatDoYouHaveToEat(pl)
                function WhatDoYouHaveToEat(pl) {
                    GET(API_HOSTS + '/api/?type=eat', dt => {
                        pl.sendModalForm(`今天吃什么？`, dt.data, "换一个", "返回主页", (pl, res) => {
                            switch (res) {
                                case true:
                                    WhatDoYouHaveToEat(pl)
                                    break;
                                case false:
                                    Main(pl)
                                    break;
                                default:
                                    Close(pl)
                                    break;
                            }
                        })
                    })
                }
                break;
            case 2:
                TheBookOfAnswers(pl, '')
                function TheBookOfAnswers(pl, txt) {
                    const fm = mc.newCustomForm();
                    fm.setTitle('答案之书');
                    fm.addInput('输入你的问题', "String", txt);
                    pl.sendForm(fm, (pl, dt) => {
                        if (dt == null) return Close(pl);
                        to(pl)
                        function to(pl) {
                            GET(API_HOSTS + '/api/?type=da', ca => {
                                pl.sendSimpleForm('答案之书', '问：' + dt[0] + '\n\n答：' + ca.data + '\n   ', ['换一个', '修改问题', '返回主页'], ['', '', ''], (_, id) => {
                                    switch (id) {
                                        case 0:
                                            to(pl)
                                            break;
                                        case 1:
                                            TheBookOfAnswers(pl, dt[0])
                                            break;
                                        case 2:
                                            Main(pl)
                                            break;
                                        default:
                                            Close(pl);
                                            break;
                                    }
                                })
                            })
                        }
                    })
                }
                break;
            case 3:
                Fortune(pl)
                function Fortune(pl) {
                    GET(API_HOSTS + '/api/?type=ys', dt => {
                        pl.sendModalForm(`运势`, dt.data[0] + "\n" + dt.data[1], "换一个", "返回主页", (pl, res) => {
                            switch (res) {
                                case true:
                                    Fortune(pl)
                                    break;
                                case false:
                                    Main(pl)
                                    break;
                                default:
                                    Close(pl)
                                    break;
                            }
                        })
                    })
                }
                break;
            default:
                Close(pl)
                break;
        }
    })
}

mc.listen(`onJoin`, (pl) => {
    GET(API_HOSTS + '/api/?type=yy', dt => {
        pl.tell(Gm_Tell + '欢迎进入服务器\n' + dt.data);
    })
})

const Close = (pl) => {
    pl.tell(Gm_Tell + '表单已放弃')
}

const GET = (url, callback) => {
    logger.debug(url)
    network.httpGet(url, (s, r) => {
        if (s !== -1) {
            logger.debug(s, r)
            callback(JSON.parse(r));
        } else {
            logger.error('ERROR' + s);
        }
    })
}