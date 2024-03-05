import { pluginFolderPath } from "./GlobalEnums.js";
import { config } from "./data.js";
import { fileOperation } from "./file.js";
import { formatPrintError } from "./util.js";

const _language = {
    zh_CN: {
        introduce: "{0} 管理工具",
        formClose: "表单已放弃",
        command: {
            failedToObtainXuid: "获取玩家{0}的XUID失败！",
            addAdministrator: "添加插件管理员{0}成功",
            addingAdministratorFailed: "添加插件管理员{0}失败，可能玩家已是插件管理员",
            removeAdministrator: "移除插件管理员{0}成功",
            removingAdministratorFailed: "移除插件管理员{0}失败，可能玩家不是插件管理员",
            reload: "操作成功",
            failedToObtainPlayerObject: "获取玩家对象失败",
        },
        form: {
            indexForm: {
                formTitle: "{0} | 主页",
                formContent: "· 选择一个操作",
                noFunction: "您当前所在权限组无任何可用功能！",
                configurationError: "表单type属性配置错误，无法执行任何操作",
                theSubformDoesNotExist: "子表单文件{0}不存在!",
                noPermissions: "无权限！",
            },
            viewSelection: {
                formTitle: "{0} | 视图选择",
                content: "请选择视图",
                button1: "默认视图",
                button2: "批量视图",
                button3: "放弃操作",
            },
        },
        plugins: {
            kick_UI: {
                formTitle: "{0} | 踢出玩家",
                dropdownBox: "选择要踢出的玩家",
                inputBox: "输入踢出后显示的内容",
                success: "踢出玩家<{0}>成功",
                fail: "踢出玩家<{0}>失败",
            },
            kill_UI: {
                formTitle: "{0} | 杀死玩家",
                content: "选择要杀死的玩家(无视创造模式)",
                success: "杀死玩家<{0}>成功",
                fail: "杀死玩家<{0}>失败",
            },
            playerTalk_UI: {
                formTitle: "{0} | 以玩家身份说话",
                inputBox: "输入要说的内容",
                dropdownBox: "选择玩家(受害者)",
                success: "操作成功",
                fail: "操作失败",
            },
            playerCmd_UI: {
                formTitle: "{0} | 以玩家身份执行命令",
                inputBox: "输入要执行的命令",
                dropdownBox: "选择玩家",
                success: "操作成功",
                fail: "操作失败",
            },
            gameRule_UI: {
                formTitle: "{0} | 更改世界规则",
                success: "操作完成",
            },
            playerInfo_UI: {
                formTitle: "{0} | 玩家详细信息",
                dropdownBox: "选择玩家",
                information:
                    "玩家名: {name}\n玩家真名: {realname}\nXUID: {xuid}\nUUID: {uuid}\n坐标: {pos}\n上次死亡坐标: {deathpos}\n\nIP: {ip}\n延迟: {ping}\n丢包: {loss}\n系统: {os}\n平均延迟: {avgping}\n平均丢包: {avgloss}\n客户端识别ID: {id}",
            },
            crashClient_UI: {
                formTitle: "{0} | 崩溃玩家客户端",
                content: "选择玩家",
                success: "操作完成",
            },
            modifyWeather: {
                formTitle: "{0} | 更改世界天气",
                content: "滑动选择需要更改的天气",
                sliderText: "<晴天>---------------<雨天>---------------<雷暴>\n\n已选择",
                sliderItem: {
                    "0": "晴天",
                    "1": "雨天",
                    "2": "雷暴",
                },
                success: "成功更改天气为<{}>",
                fail: "更改天气为<{}>失败！",
            },
            changeTime: {
                formTitle: "{0} | 更改世界时间",
                content: "滑动选择需要更改的时间",
                sliderText: "<上午>---<中午>--<傍晚>--<晚上>--<深夜>---<凌晨>\n\n已选择",
                sliderItem: {
                    "0": "上午",
                    "1": "中午",
                    "2": "傍晚",
                    "3": "晚上",
                    "4": "深夜",
                    "5": "凌晨",
                },
                success: "成功更改游戏时间",
                fail: "更改游戏时间失败，请重试",
            },
        },
    },
};

let loadLanguage: string;

export function load_i18n() {
    try {
        // 确定要加载的语言
        if (fileOperation.hasLang(config.language)) {
            loadLanguage = config.language;
        } else if (fileOperation.hasLang(ll.language)) {
            loadLanguage = ll.language;
        } else {
            loadLanguage = "zh_CN";
        }

        // 检查语言文件是否存在，不存在释放文件
        if (!fileOperation.hasLang(loadLanguage)) {
            for (const key in _language) {
                // @ts-ignore
                fileOperation.setLang(key, JSON.stringify(_language[key]));
                logger.info(`Release the translation file of the ${key} language`);
            }
        }

        // loadLanguage = loadLanguage + ".json"
        i18n.load(pluginFolderPath.lang, loadLanguage);
        logger.info(`Successfully loaded the language pack ${loadLanguage}`);
    } catch (error) {
        formatPrintError(error);
        return false;
    }
}

export const tr = (() => {
    if (i18n.tr(`introduce`) == `introduce`) load_i18n();
    return i18n.tr;
})();
