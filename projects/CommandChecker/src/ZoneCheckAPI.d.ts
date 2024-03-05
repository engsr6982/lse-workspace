interface ZoneCheckV3APIs {
    /**
     * 检查一个点是否在给定的圆内。
     * @param centerX 圆心的X坐标
     * @param centerZ 圆心的Z坐标
     * @param width 圆的半径
     * @param pointX 点的X坐标
     * @param pointZ 点的Z坐标
     * @returns 点是否在圆内
     */
    isWithinRadius?(centerX: number, centerZ: number, width: number, pointX: number, pointZ: number): boolean;

    /**
     * 检查一个点是否在给定的矩形内。
     * @param leftTopX 左上角的X坐标
     * @param leftTopZ 左上角的Z坐标
     * @param rightBottomX 右下角的X坐标
     * @param rightBottomZ 右下角的Z坐标
     * @param pointX 点的X坐标
     * @param pointZ 点的Z坐标
     * @returns 点是否在矩形内
     */
    isWithinRectangle?(
        leftTopX: number,
        leftTopZ: number,
        rightBottomX: number,
        rightBottomZ: number,
        pointX: number,
        pointZ: number,
    ): boolean;

    /**
     * 检查一个点是否在给定的以中心点为中心的正方形内。
     * @param centerX 中心点的X坐标
     * @param centerZ 中心点的Z坐标
     * @param distance 到正方形边的距离
     * @param x 点的X坐标
     * @param z 点的Z坐标
     * @returns 点是否在正方形内
     */
    isWithinCenteredSquare?(centerX: number, centerZ: number, distance: number, x: number, z: number): boolean;

    /**
     * 检查一个点是否在给定的球体内。
     * @param centerX 球心的X坐标
     * @param centerY 球心的Y坐标
     * @param centerZ 球心的Z坐标
     * @param width 球的半径
     * @param pointX 点的X坐标
     * @param pointY 点的Y坐标
     * @param pointZ 点的Z坐标
     * @returns 点是否在球体内
     */
    isWithinSphere?(
        centerX: number,
        centerY: number,
        centerZ: number,
        width: number,
        pointX: number,
        pointY: number,
        pointZ: number,
    ): boolean;

    /**
     * 检查一个点是否在给定的立方体内。
     * @param leftTopX 左上角的X坐标
     * @param leftTopY 左上角的Y坐标
     * @param leftTopZ 左上角的Z坐标
     * @param rightBottomX 右下角的X坐标
     * @param rightBottomY 右下角的Y坐标
     * @param rightBottomZ 右下角的Z坐标
     * @param pointX 点的X坐标
     * @param pointY 点的Y坐标
     * @param pointZ 点的Z坐标
     * @returns 点是否在立方体内
     */
    isWithinCuboid?(
        leftTopX: number,
        leftTopY: number,
        leftTopZ: number,
        rightBottomX: number,
        rightBottomY: number,
        rightBottomZ: number,
        pointX: number,
        pointY: number,
        pointZ: number,
    ): boolean;

    /**
     * 检查一个点是否在给定的以中心点为中心的立方体内。
     * @param centerX 中心点的X坐标
     * @param centerY 中心点的Y坐标
     * @param centerZ 中心点的Z坐标
     * @param distance 到立方点的Z坐标
     * @param distance 到立方体边的距离
     * @param x 点的X坐标
     * @param y 点的Y坐标
     * @param z 点的Z坐标
     * @returns 点是否在立方体内
     */
    isWithinCenteredCube?(centerX: number, centerY: number, centerZ: number, distance: number, x: number, y: number, z: number): boolean;

    /**
     * 获取超出2D圆形边界的信息。
     * @param centerX 圆心的X坐标
     * @param centerZ 圆心的Z坐标
     * @param width 圆的宽度
     * @param x 点的X坐标
     * @param z 点的Z坐标
     * @returns 超出边界的信息
     */
    getExceededBoundaryCircle2D?(
        centerX: number,
        centerZ: number,
        width: number,
        x: number,
        z: number,
    ): { axis: number; value: number; boundary: number };

    /**
     * 获取超出2D矩形边界的信息。
     * @param minX 矩形左上角的X坐标
     * @param minZ 矩形左上角的Z坐标
     * @param maxX 矩形右下角的X坐标
     * @param maxZ 矩形右下角的Z坐标
     * @param x 点的X坐标
     * @param z 点的Z坐标
     * @returns 超出边界的信息
     */
    getExceededBoundaryRectangle2D?(
        minX: number,
        minZ: number,
        maxX: number,
        maxZ: number,
        x: number,
        z: number,
    ): { axis: number; value: number; boundary: number };

    /**
     * 获取超出以中心点为中心的2D正方形边界的信息。
     * @param centerX 中心点的X坐标
     * @param centerZ 中心点的Z坐标
     * @param width 正方形的宽度
     * @param x 点的X坐标
     * @param z 点的Z坐标
     * @returns 超出边界的信息
     */
    getExceededCenteredBoundary2D?(
        centerX: number,
        centerZ: number,
        width: number,
        x: number,
        z: number,
    ): { axis: number; value: number; boundary: number };

    /**
     * 获取超出3D圆形边界的信息。
     * @param centerX 圆心的X坐标
     * @param centerY 圆心的Y坐标
     * @param centerZ 圆心的Z坐标
     * @param width 圆的半径
     * @param x 点的X坐标
     * @param y 点的Y坐标
     * @param z 点的Z坐标
     * @returns 超出边界的信息
     */
    getExceededBoundaryCircle3D?(
        centerX: number,
        centerY: number,
        centerZ: number,
        width: number,
        x: number,
        y: number,
        z: number,
    ): { axis: number; value: number; boundary: number };

    /**
     * 获取超出3D立方体边界的信息。
     * @param minX 立方体左上角的X坐标
     * @param minY 立方体左上角的Y坐标
     * @param minZ 立方体左上角的Z坐标
     * @param maxX 立方体右下角的X坐标
     * @param maxY 立方体右下角的Y坐标
     * @param maxZ 立方体右下角的Z坐标
     * @param x 点的X坐标
     * @param y 点的Y坐标
     * @param z 点的Z坐标
     * @returns 超出边界的信息
     */
    getExceededBoundaryCube3D?(
        minX: number,
        minY: number,
        minZ: number,
        maxX: number,
        maxY: number,
        maxZ: number,
        x: number,
        y: number,
        z: number,
    ): { axis: number; value: number; boundary: number };

    /**
     * 获取超出以中心点为中心的3D立方体边界的信息。
     * @param centerX 中心点的X坐标
     * @param centerY 中心点的Y坐标
     * @param centerZ 中心点的Z坐标
     * @param width 立方体的宽度
     * @param x 点的X坐标
     * @param y 点的Y坐标
     * @param z 点的Z坐标
     * @returns 超出边界的信息
     */
    getExceededCenteredBoundary3D?(
        centerX: number,
        centerY: number,
        centerZ: number,
        width: number,
        x: number,
        y: number,
        z: number,
    ): { axis: number; value: number; boundary: number };

    /**
     * 在圆形区域内生成随机坐标。
     * @param x 圆心x轴坐标
     * @param z 圆心y轴坐标
     * @param radius 圆半径
     * @returns 随机坐标
     */
    getRandomCoordinateInCircle?(x: number, z: number, radius: number): { x: number; z: number };

    /**
     * 在矩形区域内生成随机坐标。
     * @param topLeftX 矩形左上角的X坐标
     * @param topLeftZ 矩形左上角的Z坐标
     * @param bottomRightX 矩形右下角的X坐标
     * @param bottomRightZ 矩形右下角的Z坐标
     * @returns 随机坐标
     */
    getRandomCoordinateInRectangle?(
        topLeftX: number,
        topLeftZ: number,
        bottomRightX: number,
        bottomRightZ: number,
    ): { x: number; z: number };

    /**
     * 在正方形区域内生成随机坐标。
     * @param centerX 正方形中心点的X坐标
     * @param centerZ 正方形中心点的Z坐标
     * @param halfLength 半边长
     * @returns 随机坐标
     */
    getRandomCoordinateInSquare?(centerX: number, centerZ: number, halfLength: number): { x: number; z: number };
}
