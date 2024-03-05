# LSE-TPSystem 传送系统

## 安装

1. 将下载的`LSE-TPSystem.zip`解压  
2. 进入解压后的文件夹，把`LSE-TPSystem.js`和`PPOUI`文件夹复制（移动）到`服务端/plugins`目录下  
3. 重启服务器即可

具体的教程（最新的教程）请查看压缩包内的`README.md`文件

## 命令系统

> TPSystem的命令系统是以`顶层命令+功能枚举+操作名+参数`组成  
> 这样可以避免多种同类型插件命令冲突（重复注册）  
>
> 命令参数：  
> 尖括号<>    →   必选参数  
> 方括号[]    →   可选参数  
> `string`→字符串，`bool`→布尔型  
> 如果需要在`string`参数输入以数字开头，请用引号`""`将参数包起来  

<details>
  <summary>命令详解 [点我展开]</summary>

> 注意: 插件默认注册的顶层命令为`tps`, 如有修改请将下文的`tps`换成你修改后的顶层命令

- 家 命令

`/tps home` 家园传送点GUI（玩家）

`/tps home add <name: string>` 添加一个家（玩家）

`/tps home del <name: string>` 删除一个家（玩家）

`/tps home go <name: string>` 前往家（玩家）

`/tps home list` 列出所有家（玩家）

- 公共传送点命令

`/tps warp` 公共传送点GUI（玩家）

`/tps warp add <name: string>` 添加一个公共传送点（权限组允许）（玩家）

`/tps warp del <name: string>` 删除一个公共传送点（权限组允许）（玩家）

`/tps warp go <name: string>` 前往公共传送点（玩家）

`/tps warp list` 列出所有公共传送点（玩家）

- Tpa命令

`/tps tpa` 打开Tpa GUI（玩家）

`/tps tpa accept` 接受一个Tpa请求（玩家）

`/tps tpa deny` 拒绝一个Tpa请求（玩家）

`/tps tpa here <player: target>` 发起Tpa将目标玩家传送到我这（玩家）

`/tps tpa to <player: target>` 发起Tpa传送到目标玩家（玩家）

- 数据库命令

`/tps leveldb del <键1> [键2]` 删除数据库指定键下的数据（控制台）

`/tps leveldb export` 导出当前数据库的所有数据（控制台）

`/tps leveldb import [旧数据模式: boolean]` 将 导出的数据/旧版本数据 导入数据库（控制台）

`/tps leveldb list [键1] [键2]` 列出所有键（控制台）

- 控制台命令

`/tps reload` 重载配置文件（控制台）

`/tps op <玩家名` 添加插件管理员（控制台）

`/tps deop <玩家名>` 删除插件管理员（控制台）

- 其他

`/tps` 和 `/tps menu`打开主菜单（玩家）

`/tps mgr` 打开管理GUI（插件OP）

`/tps back` 返回死亡点GUI（玩家）

`/tps death` 查询死亡信息（玩家）

`/tps pr` 打开Pr GUI（玩家）

`/tps rule` 打开规则配置（玩家）

`/tps tpr` 随机传送GUI（玩家）

</details>

## 配置文件

- Config.json

> "bds\plugins\PPOUI\LSE-TPSystem\Config.json"

```json
{
    "Command": {
        "Command": "tps", // 要注册的命令
        "Describe": "TPSystem Command" // 命令描述
    },
    "Money": {
        "Enable": false, // 是否启用经济
        "MoneyType": "llmoney", // 经济类别  "llmoney" 或 "score"
        "ScoreType": "", // 计分板经济 存储经济的计分板
        "MoneyName": "金币" // 经济名称
    },
    "Tpa": {
        "Enable": true, // 是否启用Tpa
        "Money": 0, // tpa消耗的经济
        "CacheExpirationTime": 30000, // 缓存有效时间（毫秒）
        "CacheCheckFrequency": 5000 // 缓存检查频率 单位:毫秒（小于等于0 则关闭） 异步
    },
    "Home": {
        "Enable": true,
        "CreatHomeMoney": 0, // 创建家 经济
        "GoHomeMoney": 0, // 前往家 经济
        "EditNameMoney": 0, // 编辑家-名称 经济
        "EditPosMoney": 0, // 编辑加-坐标 经济
        "DeleteHomeMoney": 0, // 删除家 经济
        "MaxHome": 10 // 最大家园数量
    },
    "Warp": {
        "Enable": true,
        "GoWarpMoney": 0 // 前往公共传送点 经济
    },
    "Death": {
        "Enable": true,
        "sendGoDeathGUI": true, // 死亡后立即发送返回死亡点GUI
        "GoDeathMoney": 0, // 前往死亡点 经济
        "MaxDeath": 5 // 最大存储死亡信息数量
    },
    "Tpr": {
        "Enable": true,
        "randomRange": { // 随即范围
            "min": 100, // 最小值
            "max": 1000 // 最大值
        },
        "Dimension": { // 维度配置
            "Overworld": true, // 主世界
            "TheNether": true, // 地狱
            "TheEnd": true // 末地
        },
        "restrictedArea": { // 区域限制配置 依赖ZoneCheck API 
            "Enable": true, // 是否开启
            "Type": "Circle", // 圆Circle 方Square
            "Pos": { // 中心坐标
                "x": 0,
                "z": 0,
                "radius": 10
            }
        },
        "Money": 0 // 消耗经济
    },
    "Pr": {
        "Enable": true,
        "SendRequestMoney": 0, // 创建请求 经济
        "DeleteRequestMoney": 0 // 删除请求 经济
    },
    "Rule": { // 玩家规则 默认配置
        "deathPopup": true, // 死亡后立即发送返回弹窗
        "allowTpa": true, // 允许对xx发送tpa请求
        "tpaPopup": true // tpa弹窗
    },
    "Debug": true // debug模式 此项默认关闭，并隐藏
}
```

- formJSON.json

> "bds\plugins\PPOUI\LSE-TPSystem\data\formJSON.json"  
> 这是`/tps menu`表单的配置文件，支持子表单，类型请看Ts定义

<details>
  <summary>formJSON类型定义 [点我展开]</summary>

```typescript
interface formJSON_Structure_Item {
    name: string;
    image: string;
    type: "cmd" | "subform";
    open: string | Array<formJSON_Structure_Item>;
}
```

</details>

```json
[
    {
        "name": "家园传送",
        "image": "textures/ui/village_hero_effect",
        "type": "cmd",
        "open": "tps home"
    },
    {
        "name": "公共传送",
        "image": "textures/ui/icon_best3",
        "type": "cmd",
        "open": "tps warp"
    },
    {
        "name": "玩家传送",
        "image": "textures/ui/icon_multiplayer",
        "type": "cmd",
        "open": "tps tpa"
    },
    {
        "name": "死亡传送",
        "image": "textures/ui/friend_glyph_desaturated",
        "type": "cmd",
        "open": "tps back"
    },
    {
        "name": "随机传送",
        "image": "textures/ui/mashup_world",
        "type": "cmd",
        "open": "tps tpr"
    },
    {
        "name": "个人设置",
        "image": "textures/ui/icon_setting",
        "type": "cmd",
        "open": "tps rule"
    }
]
```

## API接口

### 事件系统

> 依赖 Listener 模块  
> 下载地址: gitee.com/minimouse0/listenapi  
> 本插件名: `LSE-TPSystem`

`"TPARequestSendEvent"` -TPA请求发送

- 返回
  - sender: `Player`  
    请求发送者
  - time: `Date`  
    请求创建时间
  - reciever: `Player`  
    请求目标
  - type: `tpa | tpahere`  
    请求类别
  - lifespan: `number`  
    请求有效期

## 迁移指南

> 注意：迁移指南仅限`0.7.0`版本 到 `当前版本`  
> 如果你的版本地狱`0.7.0`迁移到最新版（1.0.0）可能出现未知问题

1. 在要升级本插件的服务端上输入命令`/tps db tojson`导出数据库

2. 把`Home、Warp、Death、PlayerSeting、MergeRequest`这5个文件放到一个临时目录下  

3. 将旧版本插件的文件删除（一定要删干净）  
bds/plugins/TpSystem.js  
bds/plugins/PPOUI/TpSystem

4. 参考上面的安装教程，安装新版本插件，启动服务器生成配置文件后关闭服务器

5. 将刚刚导出的5个文件，放到`"bds\plugins\PPOUI\LSE-TPSystem\import"`文件夹下

6. 启动服务器，输入`/tps leveldb import true`命令导入数据

## 自助构建

`npm run dist` 构建插件  
`npm run dev` 开发构建  
`npm run lint` 检查代码  
`npm run lint:fix` 检查并修复

> 注意: 单独clone本仓库无法编译，请clone工作区再编译

## 其他信息

### 目录结构

```floder
LSE-TPSystem-202401132115.zip
├── PPOUI
│   └── LSE-TpSystem
│       ├── leveldb        //插件数据库(此文件夹十分重要！请不要删除此文件夹下的文件！)
│       ├── dist          //插件核心依赖
│       ├── export         //数据库导出目录
│       ├── import         //数据库导入目录
│       ├── lang           //语言文件目录
│       ├── data           //其他数据文件
│       └── Config.json    //配置文件
├── LSE-TpSystem.js       //入口文件
└── README.md
```
