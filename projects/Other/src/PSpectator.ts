/* 

- 路径:`./plugins/PPOUI/PSpectator/Config.json`  

```json
{
    "tp": true,//切换生存是否传送回保存的坐标
    "listen": true,//是否进服就开启旁观模式
    "PlayerData": [],//存储玩家坐标
    // 旁观限制
    "BystanderLimitation": {
        "Enable": true,// 是否开启
        "InspectionType": "3DSquareCenter",// 检查类型
        "InspectionFrequency": 250,// 检查频率 单位毫秒
        "AllowableDistance": 25// 允许距离(半径/半边长)
    }
}
```

`InspectionType`可用类型  
| InspectionType | 描述 |
| -------------- | ---- |
| 2DCircle       | 2D圆形，以开启旁观坐标为中心，圆形检查X,Z轴 |
| 3DCircle       | 3D圆形，以开启旁观坐标为中心，圆形检查X.y,z轴 | 
| 2DSquareCenter | 2D矩阵，以开启旁观坐标为中心，方形检查X,Z | 
| 3DSquareCenter | 3D矩阵，以开启旁观坐标为中心，立方体检查X,Y,Z |

> Tips: 上述4个检查类型都以开启旁观模式时记录的坐标为中心，当玩家超出区域，插件会计算对应坐标轴的边界位置坐标，把玩家拉回边界

 */

const PLUGIN_NAME = "PSpectator";
const Tell = `§e[§a${PLUGIN_NAME}§e] §b`;
file.exists(`.\\plugins\\PPOUI\\debug`) ? logger.setLogLevel(5) : false;

// @ts-ignore 配置文件
const Config = new JsonConfigFile(
    `.\\Plugins\\PPOUI\\${PLUGIN_NAME}\\Config.json`,
    JSON.stringify({
        tp: true, //切换生存是否传送回保存的坐标
        listen: true, //是否进服就开启旁观模式
        BystanderLimitation: {
            Enable: true, // 是否开启
            InspectionType: "3DSquareCenter", // 检查类型
            InspectionFrequency: 250, // 检查频率 单位毫秒
            AllowableDistance: 25, // 允许距离(半径)
        },
        PlayerData: [], //存储玩家坐标
    }),
);

// @ts-ignore 注册真命令
function regCommand() {
    const cmd = mc.newCommand("ps", "旁观模式切换", PermType.Any);
    cmd.overload([]);
    cmd.setCallback((cmd, ori, out) => {
        // 检查数据是否存在
        if (DataProcessing.isPlayerInData(ori.player)) {
            // 切换生存
            if (ori.player.setGameMode(0)) {
                if (Config.get("tp")) {
                    const res = Config.get("PlayerData").findIndex(
                        (item: {
                            xuid: string;
                            pos: {
                                x: number;
                                y: number;
                                z: number;
                                dimid: number;
                            };
                        }) => item.xuid === ori.player.xuid,
                    );
                    ori.player.teleport(DataProcessing.parsePos(Config.get("PlayerData")[res].pos));
                }
                DataProcessing.DelData(ori.player);
                out.success(Tell + "切换生存");
            }
        } else {
            // 切换旁观
            if (ori.player.setGameMode(6)) {
                DataProcessing.ReleaseData(ori.player);
                out.success(Tell + "切换成功，已保存坐标");
            }
        }
    });
    cmd.setup();
}

class DataProcessing {
    /**
     * 格式化字符串转坐标对象
     * @param {String} posObject 待转换字符串
     * @returns 坐标对象
     */
    static parsePos(posObject: { x: number; y: number; z: number; dimid: number }) {
        const { x, y, z, dimid } = posObject;
        return new IntPos(Number(x), Number(y), Number(z), Number(dimid));
    }
    /**
     * 玩家数据是否存在
     * @param {Player} pl
     * @returns bool 是否存在
     */
    static isPlayerInData(pl: Player) {
        return Config.get("PlayerData").some(
            (item: {
                xuid: string;
                pos: {
                    x: number;
                    y: number;
                    z: number;
                    dimid: number;
                };
            }) => item.xuid === pl.xuid,
        );
    }
    /**
     * 释放玩家数据
     * @param {Player} pl
     */
    static ReleaseData(pl: Player) {
        const arr = Config.get("PlayerData");
        const { x, y, z, dimid } = pl.blockPos;
        arr.push({
            xuid: pl.xuid,
            pos: {
                x: x,
                y: y,
                z: z,
                dimid: dimid,
            },
        });
        Config.set("PlayerData", arr);
    }
    /**
     * 删除玩家数据
     * @param {Player} pl
     */
    static DelData(pl: Player) {
        const arr: Array<{
            xuid: string;
            pos: {
                x: number;
                y: number;
                z: number;
                dimid: number;
            };
        }> = Config.get("PlayerData");
        const res = arr.findIndex((item) => item.xuid === pl.xuid);
        arr.splice(res, 1);
        Config.set("PlayerData", arr);
    }
}

const ZoneCehckAPIs: ZoneCheckV3APIs = {};

function importZoneCheckV3APIs() {
    const ZoneCheckV3_NameSpace = "ZoneCheckV3";
    ZoneCehckAPIs.isWithinRadius = ll.imports(ZoneCheckV3_NameSpace, "RegionChecker2D::isWithinRadius");
    ZoneCehckAPIs.isWithinRectangle = ll.imports(ZoneCheckV3_NameSpace, "RegionChecker2D::isWithinRectangle");
    ZoneCehckAPIs.isWithinCenteredSquare = ll.imports(ZoneCheckV3_NameSpace, "RegionChecker2D::isWithinCenteredSquare");
    ZoneCehckAPIs.isWithinSphere = ll.imports(ZoneCheckV3_NameSpace, "RegionChecker3D::isWithinSphere");
    ZoneCehckAPIs.isWithinCuboid = ll.imports(ZoneCheckV3_NameSpace, "RegionChecker3D::isWithinCuboid");
    ZoneCehckAPIs.isWithinCenteredCube = ll.imports(ZoneCheckV3_NameSpace, "RegionChecker3D::isWithinCenteredCube");
    ZoneCehckAPIs.getExceededBoundaryCircle2D = ll.imports(ZoneCheckV3_NameSpace, "BoundaryChecker::is2D::getExceededBoundaryCircle2D");
    ZoneCehckAPIs.getExceededBoundaryRectangle2D = ll.imports(
        ZoneCheckV3_NameSpace,
        "BoundaryChecker::is2D::getExceededBoundaryRectangle2D",
    );
    ZoneCehckAPIs.getExceededCenteredBoundary2D = ll.imports(ZoneCheckV3_NameSpace, "BoundaryChecker::is2D::getExceededCenteredBoundary2D");
    ZoneCehckAPIs.getExceededBoundaryCircle3D = ll.imports(ZoneCheckV3_NameSpace, "BoundaryChecker::is3D::getExceededBoundaryCircle3D");
    ZoneCehckAPIs.getExceededBoundaryCube3D = ll.imports(ZoneCheckV3_NameSpace, "BoundaryChecker::is3D::getExceededBoundaryCube3D");
    ZoneCehckAPIs.getExceededCenteredBoundary3D = ll.imports(ZoneCheckV3_NameSpace, "BoundaryChecker::is3D::getExceededCenteredBoundary3D");
    ZoneCehckAPIs.getRandomCoordinateInCircle = ll.imports(ZoneCheckV3_NameSpace, "RandomAreaPosition::getRandomCoordinateInCircle");
    ZoneCehckAPIs.getRandomCoordinateInRectangle = ll.imports(ZoneCheckV3_NameSpace, "RandomAreaPosition::getRandomCoordinateInRectangle");
    ZoneCehckAPIs.getRandomCoordinateInSquare = ll.imports(ZoneCheckV3_NameSpace, "RandomAreaPosition::getRandomCoordinateInSquare");
    return true;
}

function BystanderLimitation() {
    setInterval(
        async () => {
            const { InspectionType, AllowableDistance } = Config.get("BystanderLimitation");
            // 遍历数据
            Config.get("PlayerData").forEach(
                (i: {
                    xuid: string;
                    pos: {
                        x: number;
                        y: number;
                        z: number;
                        dimid: number;
                    };
                }) => {
                    // 尝试获取玩家对象
                    const pl = mc.getPlayer(i.xuid);
                    if (!pl) return; // 离线
                    // 格式化坐标对象
                    const pos = DataProcessing.parsePos(i.pos);
                    let p;
                    switch (InspectionType) {
                        case "2DCircle":
                            if (!ZoneCehckAPIs.isWithinRadius(pos.x, pos.z, AllowableDistance, pl.blockPos.x, pl.blockPos.z)) {
                                p = ZoneCehckAPIs.getExceededBoundaryCircle2D(
                                    pos.x,
                                    pos.z,
                                    AllowableDistance,
                                    pl.blockPos.x,
                                    pl.blockPos.z,
                                );
                            }
                            break;
                        case "3DCircle":
                            if (
                                !ZoneCehckAPIs.isWithinSphere(
                                    pos.x,
                                    pos.y,
                                    pos.z,
                                    AllowableDistance,
                                    pl.blockPos.x,
                                    pl.blockPos.y,
                                    pl.blockPos.z,
                                )
                            ) {
                                p = ZoneCehckAPIs.getExceededBoundaryCircle3D(
                                    pos.x,
                                    pos.y,
                                    pos.z,
                                    AllowableDistance,
                                    pl.blockPos.x,
                                    pl.blockPos.y,
                                    pl.blockPos.z,
                                );
                            }
                            break;
                        case "2DSquareCenter":
                            if (!ZoneCehckAPIs.isWithinCenteredSquare(pos.x, pos.z, AllowableDistance, pl.blockPos.x, pl.blockPos.z)) {
                                p = ZoneCehckAPIs.getExceededCenteredBoundary2D(
                                    pos.x,
                                    pos.z,
                                    AllowableDistance,
                                    pl.blockPos.x,
                                    pl.blockPos.z,
                                );
                            }
                            break;
                        case "3DSquareCenter":
                            if (
                                !ZoneCehckAPIs.isWithinCenteredCube(
                                    pos.x,
                                    pos.y,
                                    pos.z,
                                    AllowableDistance,
                                    pl.blockPos.x,
                                    pl.blockPos.y,
                                    pl.blockPos.z,
                                )
                            ) {
                                p = ZoneCehckAPIs.getExceededCenteredBoundary3D(
                                    pos.x,
                                    pos.y,
                                    pos.z,
                                    AllowableDistance,
                                    pl.blockPos.x,
                                    pl.blockPos.y,
                                    pl.blockPos.z,
                                );
                            }
                            break;
                        default:
                            logger.error(`未知的检查类型: ${InspectionType}`);
                    }
                    // @ts-ignore
                    p != null ? (p.axis = String.fromCharCode(p.axis)) : null;
                    logger.debug(p);
                    if (Object.keys(p).length !== 0) {
                        const np = new IntPos(
                            // @ts-ignore
                            p.axis == "x" ? p.boundary : pl.blockPos.x,
                            // @ts-ignore
                            p.axis == "y" ? p.boundary : pl.blockPos.y,
                            // @ts-ignore
                            p.axis == "z" ? p.boundary : pl.blockPos.z,
                            pos.dimid,
                        );
                        pl.teleport(np);
                        pl.tell(`超出边界  坐标轴: ${p.axis}  边界: ${p.boundary}  当前: ${p.value}`, 5);
                    }
                },
            );
        },
        Number(Config.get("BystanderLimitation").InspectionFrequency),
    );
}

//注册监听器
if (Config.get("listen") == true) {
    mc.listen("onJoin", (pl) => {
        // 玩家数据存在  / 是模拟玩家
        if (DataProcessing.isPlayerInData(pl) || pl.isSimulatedPlayer()) return;
        if (pl.setGameMode(6)) {
            DataProcessing.ReleaseData(pl);
            pl.tell(Tell + "已切换为旁观者模式 \n使用命令/ps 切换生存");
        }
    });
}

mc.listen("onServerStarted", () => {
    if (Config.get("BystanderLimitation").Enable) {
        importZoneCheckV3APIs() ? BystanderLimitation() : logger.error("缺少前置组件：ZoneCheck");
    }
    regCommand();
});

logger.info(`作者： PPOUI`);
logger.info(`MineBBS: https://www.minebbs.com/threads/pspectator.17326/`);
