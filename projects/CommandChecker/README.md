# CommandChecker - 让命令在特定区域可用

## 插件特性

1. 支持2D/3D 圆形/方形 区域检测    
2. 支持白名单    
3. 导出API

## 使用方法：

路径：./plugins/ppoui/CommandChecker/data.json

```json
[
    {// 2D/3D 圆
        "cmd": "", // 命令
        "whiteList": [],//白名单
        "type": "Circle",// 计算方式  Circle圆  Square方  
        "Radius": 5,// 圆半径
        "CenterCoordinates": {// 圆心坐标
            "x": 0,
            "y": 0,// 当计算方式为2D 时  此项为null
            "z": 0,
            "dimid": 0
        },
        "blacklistWithinRegion": false// 设定区域内黑名单  设置为false代表区域外不可用（黑名单
    },
    {// 2D/3D 方
        "cmd": "", // 命令
        "whiteList": [],//白名单
        "type": "Square",// 计算方式  Circle圆  Square方  
        "TopLeft": {// 左上角坐标
            "x": 0,
            "y": 0,// 当计算方式为2D 时  此项为null
            "z": 0,
            "dimid": 0
        },
        "BottomRight": {// 右下角坐标
            "x": 0,
            "y": 0,
            "z": 0,
            "dimid": 0
        },
        "blacklistWithinRegion": false// 设定区域内黑名单  设置为false代表区域外不可用（黑名单
    },
    {// 2D/3D方 (此模式与上述模式不同，此模式使用中心点确定整个方形区域)
        "cmd": "",
        "whiteList": [],//白名单
        "type": "SCenter",// 计算方式  Circle圆  Square方  SCenter方(中心)
        "HalfLength": 5,// 半边长
        "CentralCoordinate": {
            "x": 0,
            "y": null,// 当计算方式为2D 时  此项为null
            "z": 0,
            "dimid": 0
        },
        "blacklistWithinRegion": false// 设定区域内黑名单  设置为false代表区域外不可用（黑名单
    }
]
```
