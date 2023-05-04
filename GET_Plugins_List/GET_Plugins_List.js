//LiteLoaderScript Dev Helper
/// <reference path="c:\Users\Administrator\Documents\aids/dts/HelperLib-master/src/index.d.ts"/> 

const PLUGINS_NAME = 'GET_Plugins_List';
const PLUGINS_JS = '快捷获取插件列表';
const PLUGINS_VERSION = [0, 0, 1];
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
mc.regConsoleCmd("getlist", "all", (args) => {
    let List = ll.getAllPluginInfo();
    let ToBeOutput = `## 获取到< **%NumberOfPlugins%** >个插件的信息\n| 名称 | 版本 | 简介 | 版本字符串 | 类型 | 路径 |\n| ---- | --- | ---- | ---------- | ---- | ---- |\n`;
    let NumberOfPlugins = 0;/* 插件数量 */let OutPut_File = 'Plugins_List.md'; // 输出文件类型
    List.forEach(i => {/*               名称                版本                       简介       版本字符串               类型                       路径  */;
        ToBeOutput = ToBeOutput + `| ${i.name} | ${i.version.join().replace(/,/g, '.')} | ${i.desc} | ${i.versionStr} | ${i.others.PluginType} | ${i.others.PluginFilePath}\n`;
        NumberOfPlugins++;
    });
    ToBeOutput = ToBeOutput.replace(/%NumberOfPlugins%/g, NumberOfPlugins);
    if (args == 'csv') {/*       去除markdown居中行         替换|为，           去除开头，          去除末尾，*/;
        ToBeOutput = ToBeOutput.replace(/##.+息$/gm, `获取到< ${NumberOfPlugins} >个插件的信息,,,,,,`).replace(/\| .+- \|$/gm, '').replace(/\|/gm, ',').replace(/^,/gm, '').replace(/,$/gm, '');
        OutPut_File = 'Plugins_List.csv';
    };
    File.writeTo(`./${OutPut_File}`, ToBeOutput);
    colorLog('green', `${OutPut_File} 文件已输出到根目录<./${OutPut_File}>`)
})
colorLog('green', `GET_Plugins_List已加载\n====================================\n\t命令：/getlist {md/csv}\n\t作者：${PLUGINS_ZZ}\n====================================`);