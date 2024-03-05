import { RegEvent } from "./event.js";

export const ZoneCehckAPIs: ZoneCheckV3APIs = {};

export function importAPI() {
    if (!ll.hasExported("ZoneCheckV3", "RegionChecker2D::isWithinRadius")) {
        return logger.error(`前置组件[ZoneCheck]缺失，本插件无法运行!`);
    }
    const ZoneCheckV3_NameSpace = "ZoneCheckV3";
    // 2d
    ZoneCehckAPIs.isWithinRadius = ll.imports(ZoneCheckV3_NameSpace, "RegionChecker2D::isWithinRadius");
    ZoneCehckAPIs.isWithinRectangle = ll.imports(ZoneCheckV3_NameSpace, "RegionChecker2D::isWithinRectangle");
    ZoneCehckAPIs.isWithinCenteredSquare = ll.imports(ZoneCheckV3_NameSpace, "RegionChecker2D::isWithinCenteredSquare");
    // 3d
    ZoneCehckAPIs.isWithinSphere = ll.imports(ZoneCheckV3_NameSpace, "RegionChecker3D::isWithinSphere");
    ZoneCehckAPIs.isWithinCuboid = ll.imports(ZoneCheckV3_NameSpace, "RegionChecker3D::isWithinCuboid");
    ZoneCehckAPIs.isWithinCenteredCube = ll.imports(ZoneCheckV3_NameSpace, "RegionChecker3D::isWithinCenteredCube");
    // boundary 2d
    ZoneCehckAPIs.getExceededBoundaryCircle2D = ll.imports(ZoneCheckV3_NameSpace, "BoundaryChecker::is2D::getExceededBoundaryCircle2D");
    ZoneCehckAPIs.getExceededBoundaryRectangle2D = ll.imports(
        ZoneCheckV3_NameSpace,
        "BoundaryChecker::is2D::getExceededBoundaryRectangle2D",
    );
    ZoneCehckAPIs.getExceededCenteredBoundary2D = ll.imports(ZoneCheckV3_NameSpace, "BoundaryChecker::is2D::getExceededCenteredBoundary2D");
    // boundary 3d
    ZoneCehckAPIs.getExceededBoundaryCircle3D = ll.imports(ZoneCheckV3_NameSpace, "BoundaryChecker::is3D::getExceededBoundaryCircle3D");
    ZoneCehckAPIs.getExceededBoundaryCube3D = ll.imports(ZoneCheckV3_NameSpace, "BoundaryChecker::is3D::getExceededBoundaryCube3D");
    ZoneCehckAPIs.getExceededCenteredBoundary3D = ll.imports(ZoneCheckV3_NameSpace, "BoundaryChecker::is3D::getExceededCenteredBoundary3D");
    // random
    ZoneCehckAPIs.getRandomCoordinateInCircle = ll.imports(ZoneCheckV3_NameSpace, "RandomAreaPosition::getRandomCoordinateInCircle");
    ZoneCehckAPIs.getRandomCoordinateInRectangle = ll.imports(ZoneCheckV3_NameSpace, "RandomAreaPosition::getRandomCoordinateInRectangle");
    ZoneCehckAPIs.getRandomCoordinateInSquare = ll.imports(ZoneCheckV3_NameSpace, "RandomAreaPosition::getRandomCoordinateInSquare");
    // 导入完成，注册事件
    RegEvent();
}
