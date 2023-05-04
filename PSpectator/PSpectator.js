//LiteLoaderScript Dev Helper
/// <reference path="c:\Users\Administrator\Documents\aids/dts/HelperLib-master/src/index.d.ts"/> 

/**
 * 未经允许不得转载、整合、二次开发
 * 作者 PPOUI
 */

const PLUGIN_NAME = "PSpectator"
const Tell = `§e[§a${PLUGIN_NAME}§e] §b`

//配置文件
const Path = `.\\Plugins\\PPOUI\\${PLUGIN_NAME}\\`;
const Cfg_init = {
    "tp": true,
    "listen": true,
    "PlayerData": []
}
let Cfg = data.openConfig(Path + 'Config.json', 'json', JSON.stringify(Cfg_init))

//注册真命令
const cmd = mc.newCommand('ps', "旁观模式切换", PermType.Any);
cmd.overload([]);
cmd.setCallback((cmd, ori, out, res) => {
    if (isData(ori.player)) {
        //存在 切换生存
        if (ori.player.setGameMode(0)) {
            //切换成功
            if (Cfg.get("tp") == true) {
                let res = Cfg.get("PlayerData").findIndex(item => item.xuid === ori.player.xuid);
                let XYZ = Cfg.get("PlayerData")[res].pos.split(",");
                XYZ[1] = XYZ[1] + 1;
                ori.player.teleport(parseFloat(XYZ[0]),parseFloat(XYZ[1]),parseFloat(XYZ[2]),parseInt(XYZ[3]));
            }
            DelData(ori.player);
            return out.success(Tell+"切换生存")
        }
    }
    else {
        //no
        if (ori.player.setGameMode(6)) {
            ReleaseData(ori.player);
            out.success(Tell + '切换成功，已保存坐标')
        }
    }
});
cmd.setup();

//注册监听器
if (Cfg.get("listen") == true) {
    mc.listen("onJoin", (pl) => {
        if (isData(pl)) {
            return;
        }
        if (pl.setGameMode(6)) {
            ReleaseData(pl)
            pl.tell(Tell + "已切换为旁观者模式 \n使用命令/ps 切换生存");
        }
    })
}

//判断玩家数据是否存在
function isData(pl) {
    if (Cfg.get("PlayerData").find(item => item.xuid === pl.xuid)) {
        return true;
    } else {
        return false
    }
}

//释放玩家数据
function ReleaseData(pl) {
    let arr = Cfg.get("PlayerData");
    let dataPos = `${pl.pos.x},${pl.pos.y},${pl.pos.z},${pl.pos.dimid}`
    let tmp = {
        "xuid": pl.xuid,
        "pos": dataPos
    };
    arr.push(tmp);
    Cfg.set("PlayerData", arr)
    Cfg.reload()
}

//删除数据
function DelData(pl) {
    let arr = Cfg.get("PlayerData");
    let res = arr.findIndex(item => item.xuid === pl.xuid);
    arr.splice(res, 1);
    Cfg.set("PlayerData", arr);
    Cfg.reload()
}
//logger.setFile(`./logs/${PLUGIN_NAME}.log`)

logger.info(`${PLUGIN_NAME} 已加载`);
logger.info(`作者： PPOUI`);
logger.info(`MineBBS地址: https://www.minebbs.com/threads/pspectator.17326/`);