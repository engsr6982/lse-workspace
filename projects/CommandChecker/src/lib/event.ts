import { datas } from "./Global.js";
import { ZoneCehckAPIs } from "./importAPI.js";
import { tell } from "./other.js";

export function RegEvent() {
    // eslint-disable-next-line complexity
    mc.listen("onPlayerCmd", function (pl, ccmd) {
        try {
            logger.debug(`执行命令： ${ccmd}`);
            if (!pl || pl.isSimulatedPlayer()) return;

            // 获取索引  去除空字符 转为小写
            const index = datas.findIndex((i) => {
                // 去除空字符，转为小写，替换*为通配符
                if (RegExp(/\*/g).test(i.cmd)) {
                    return new RegExp(i.cmd.trim().toLowerCase().replace(/\*/g, ".*")).test(ccmd.trim().toLowerCase());
                } else {
                    return i.cmd.trim().toLocaleLowerCase() == ccmd.trim().toLocaleLowerCase();
                }
            });

            if (index === -1) {
                logger.debug(`获取<${ccmd}>索引失败：${ccmd}`);
                return;
            }

            // 减短长度
            const tmp = datas[index];
            logger.debug(`获取[${ccmd}]索引：${index}`);

            if (tmp.whiteList.length !== 0 && tmp.whiteList.indexOf(pl.realName) !== -1) {
                // 白名单长度不为0   且  查询玩家不为-1
                logger.debug(`玩家[${pl.realName}]在白名单内`);
                return;
            }

            let status;
            // 根据类别执行对应检查
            switch (tmp.type) {
                case "Circle": // 圆
                    if (tmp.CenterCoordinates.dimid !== pl.pos.dimid) {
                        // 检查是否为设定维度
                        // 圆 设定维度 不等于 玩家当前维度
                        return;
                    }

                    if (tmp.CenterCoordinates.y === null) {
                        // 2D
                        status = ZoneCehckAPIs.isWithinRadius(
                            tmp.CenterCoordinates.x,
                            tmp.CenterCoordinates.z,
                            tmp.Radius,
                            pl.blockPos.x,
                            pl.blockPos.z,
                        );
                    } else {
                        // 3D
                        status = ZoneCehckAPIs.isWithinSphere(
                            tmp.CenterCoordinates.x,
                            tmp.CenterCoordinates.y,
                            tmp.CenterCoordinates.z,
                            tmp.Radius,
                            pl.blockPos.x,
                            pl.blockPos.y,
                            pl.blockPos.z,
                        );
                    }
                    break;
                case "Square": // 方
                    if (tmp.TopLeft.dimid !== pl.pos.dimid || tmp.BottomRight.dimid !== pl.pos.dimid) {
                        // 检查是否为设定维度
                        // 方 左上或右下 维度不等于 玩家当前维度
                        return;
                    }

                    if (tmp.TopLeft.y === null && tmp.BottomRight.y === null) {
                        // 2D
                        status = ZoneCehckAPIs.isWithinRectangle(
                            tmp.TopLeft.x,
                            tmp.TopLeft.z,
                            tmp.BottomRight.x,
                            tmp.BottomRight.z,
                            pl.blockPos.x,
                            pl.blockPos.z,
                        );
                    } else {
                        // 3D
                        status = ZoneCehckAPIs.isWithinCuboid(
                            tmp.TopLeft.x,
                            tmp.TopLeft.y,
                            tmp.TopLeft.z,
                            tmp.BottomRight.x,
                            tmp.BottomRight.y,
                            tmp.BottomRight.z,
                            pl.blockPos.x,
                            pl.blockPos.y,
                            pl.blockPos.z,
                        );
                    }
                    break;
                case "SCenter":
                    if (tmp.CentralCoordinate.dimid != pl.pos.dimid) {
                        return;
                    }

                    if (tmp.CentralCoordinate.y === null) {
                        //2d
                        status = ZoneCehckAPIs.isWithinCenteredSquare(
                            tmp.CentralCoordinate.x,
                            tmp.CentralCoordinate.z,
                            tmp.HalfLength,
                            pl.blockPos.x,
                            pl.blockPos.z,
                        );
                    } else {
                        //3d
                        status = ZoneCehckAPIs.isWithinCenteredCube(
                            tmp.CentralCoordinate.x,
                            tmp.CentralCoordinate.y,
                            tmp.CentralCoordinate.z,
                            tmp.HalfLength,
                            pl.blockPos.x,
                            pl.blockPos.y,
                            pl.blockPos.z,
                        );
                    }
                    break;
            }

            if (status === true && tmp.blacklistWithinRegion === true) {
                // 玩家在区域内  且 拦截区域内
                tell(pl);
                return false;
            }
            if (status === false && tmp.blacklistWithinRegion === false) {
                // 玩家不在区域内 且 需要拦截区域外
                tell(pl);
                return false;
            }
        } catch (err) {
            logger.error(`遇到错误： ${err}\n${err.stack}`);
        }
    });
}
