# TPSystem --BDS传送系统

## 1. 安装
> 请确保你的服务器已安装并运行Liteloader   

    1. 下载**TPSystem.js**  
    2. 扔到万能的**Plugins**文件夹  
    3. 启动或重启服务端，待Liteloader 输出JS插件TPSystem已加载，则代表安装成功    

## 2. 配置插件   

> 通过配置**TPSystem**使它更好的为服务器提供传送功能    
> 注意：编辑文件时请使用**VSCode**或其他编辑器编辑文件

**Config.json**
- 路径：./Plugins/PPOUI/TpSystem/Config.json  

```json
{
    "Command": {//命令配置
        "name": "tps",//命令名称
        "Describe": "传送系统"//命令描述
    },
    "Money": {//经济配置
        "Enable": true,//开关
        "LLMoney": true,//是否启用LLMoney
        "MoneyName": "money"//经济名称
    },
    "Home": {//家园传送配置
        "Enable": true,
        "CreateHome": 0,//创建家 所需经济
        "GoHome": 0,//前往家 经济
        "EditHome": 0,//编辑家 经济
        "DeleteHome": 0,//删除家 经济
        "MaxHome": 10//最大家园数量//todo
    },
    "Warp": {//公共传送点配置
        "Enable": true,
        "GoWarp": 0//前往传送点 经济
    },
    "TPA": {//玩家传送配置
        "Enable": true,
        "Player_Player": 0,//玩家传玩家 经济
        "Player_Home": 0,//玩家穿家 经济
        "CacheExpirationTime": 30,//缓存过期时间//todo
        "CacheExpirationTimeUnit": "second",//缓存过期时间单位 "second"秒 "minute"分钟//todo
        "RegularlyCheckExpirationTime": 30//定期检查过期时间 单位： 毫秒//todo
    },
    "Death": {//死亡传送配置
        "Enable": true,
        "GoDelath": 0,//前往死亡点 经济
        "sendBackGUI": true//发送死亡返回传送点弹窗 总开关
    },
    "TPR": {//随机传送配置
        "Enable": true,
        "Min": 1000,//随机坐标最小值
        "Max": 5000,//最大值
        "Money": 0,//所需经济
        "MainWorld": true,//主世界//todo
        "Infernal": true,//地狱
        "Terminus": true//末地
    },
    "MergeRequest": {//并入公共传送点配置
        "Enable": true,
        "sendRequest": 0,//发送请求 经济
        "DeleteRequest": 0//删除请求 经济
    },
    "PlayerSeting": {//玩家配置默认
        "AcceptTransmission": true,//接受传送请求
        "SecondaryConfirmation": true,//传送二次确认
        "SendRequestPopup": true,//传送请求弹窗
        "DeathPopup": true//死亡弹出返回死亡点 子开关
    }
}
```

**MainUI.json**
- 路径：./Plugins/PPOUI/TpSystem/GUI/MainUI.json

此功能参考OPTools自定义主页

TPSystem内部函数参考
```js
const MAPPING_TABLE = {
    HomeUi: HomeForms.Home_Panel,
    WarpUi: Forms.PublicTransportation,
    PlayerUi: Forms.PlayerTransportation,
    DeathUi: Forms.DeathTransportation,
    RandomUi: Forms.RandomTransportation,
    SetingUi: Forms.PersonalSettings
}
```

## 3. 关于命令
> 注意： 默认的顶层命令为/**tps** 如有修改，请使用修改后的顶层命令   
> []为可选参数  <>为必选参数   输入命令时不要带上[]和<>   

/tps mgr        --打开管理面板GUI

/tps random     --随机传送（无GUI）

/tps reload     --保存并重新读取文件

/tps back       --打开返回死亡点GUI

/tps refresh    --强制刷新缓存并重新读取文件（不建议在生产环境使用此命令，可能导致玩家数据丢失

/ tps [gui] [home|warp|player|death|random|seting]      --打开对应功能GUI

/tps accept     --接受传送请求

/tps deny       --拒绝传送请求

更多内容待补充   
本页最后更新于2023年5月15日22:14:03    