import { gmTell, pluginInformation } from "../utils/GlobalVars.js";
import { rule } from "../utils/data.js";
import { tr } from "../utils/i18n.js";

// 拼接命令
function spliceCommand(rule: string): string {
    return `gamerule ${rule}`;
}

// 解析规则值
function extractCommandResultValue(output: string): string {
    return output.replace(RegExp(/.+=./g), ""); // 解析命令返回值
}

// 获取规则值
function getRuleValue(rule: string) {
    const command = spliceCommand(rule); // 拼接命令
    const { output, success } = mc.runcmdEx(command); // 执行命令
    logger.debug(`command: ${command} => status: ${success} | output: ${output}`);
    return {
        output: extractCommandResultValue(output),
        success: success,
    };
}

// GUI
export function gameRule_UI(player: Player) {
    const fm = mc.newCustomForm(); // 构建表单
    fm.setTitle(tr("plugins.gameRule_UI.formTitle", { 0: pluginInformation.name })); // 设置标题

    const rawData = {}; // 原始数据，用于记录数据是否变动

    rule.data.forEach((i) => {
        const { success, output } = getRuleValue(i.rule); // 获取数据值

        // Bool转换
        const stringBoolToBool = (stringBool: string) => {
            return /true/.test(stringBool); // 正则转换 string => bool
        };

        // 拼接标题
        const title = tr("plugins.gameRule_UI.itemTitle", {
            0: i.name,
            1: i.describe,
            2: i.effect,
            3: success,
        });

        // 根据数据类型进行构建表单
        if (output === "true" || output === "false") {
            // Bool 类型，使用Switch
            const bool = stringBoolToBool(output); // 调用转换
            fm.addSwitch(title + "\n ", bool);
            // @ts-ignore
            rawData[i.rule] = bool; // 记录当前数据
        } else {
            // 其他类型，使用Input
            fm.addInput(title, "string any", output);
            // @ts-ignore
            rawData[i.rule] = output;
        }
    });
    player.sendForm(fm, (player2, data) => {
        if (data == null) return player2.tell(gmTell + tr("formClose"));
        // logger.debug(JSON.stringify(data));
        let index = 0;
        // 遍历原始数据
        for (const key in rawData) {
            // @ts-ignore 检查回调数据是否与原始数据不匹配
            if (data[index] !== rawData[key]) {
                mc.runcmd(spliceCommand(key) + ` ${data[index]}`);
            }
            index++;
        }
        player2.tell(gmTell + tr("plugins.gameRule_UI.success"));
    });
}
