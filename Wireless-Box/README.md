# Wireless Box - 无线箱子

这个插件属于是把自己奇奇怪怪的想法做出来了

插件功能：
1. 远程操作箱子、木桶之类的容器方块
2. 支持远程拿取、放入箱子
3. 潜行点击箱子可获取此箱子绑定玩家
4. 全GUI操作

## 配置文件  
无

## 命令  
/box

## 注意事项
本插件未对接任何领地、箱子商店！所以只要添加后，可以绕过领地之类的限制！   
请使用API接口监听添加箱子事件，拦截玩家添加在他人领地内的箱子！

## API接口   
注意：本插件的数据类型与LLSE-JS数据类型相同    
参数前面如果有？代表此参数为可选参数   

### 基础接口  

`WirelessBox_addBox` - 给指定玩家添加一个箱子   
参数:   
- xuid: `String`   
    - 要添加玩家的XUID   
- pos: `IntPos`   
    - 箱子坐标   
- ?name: `String`   
    - 箱子别名

返回：`Boolean`    
    - 是否添加成功   

`WirelessBox_deleteBox` - 删除指定玩家箱子  
参数:    
- xuid: `String`   
    - 要删除玩家的XUID   
- pos: `IntPos`   
    - 箱子坐标  

返回：`Boolean`    
    - 是否删除成功   

`WirelessBox_getPlayerAllBox` - 获取指定玩家所有箱子  
参数:    
- xuid: `String`   
    - 玩家的XUID   

返回: `Array`   
    - 所有箱子  [object, object, ...]

`WirelessBox_getPlayerBox` - 获取指定玩家指定箱子 
参数:    
- xuid: `String`   
    - 要删除玩家的XUID   
- pos: `IntPos`   
    - 箱子坐标  

返回: `Array`   
    - 所有箱子  [object]

`WirelessBox_getBoxInPos` - 通过坐标获取箱子  
参数:    
- pos: `IntPos`   
    - 箱子坐标  

返回: `Array`   
    - 所有箱子  [object]

`WirelessBox_isBoxBound` - 箱子是否已被绑定  
参数:    
- pos: `IntPos`   
    - 箱子坐标      

返回：`Boolean`    
    - 是否被绑定   

### 事件接口   

#### 模板   
本模板以iLand领地作为示例   
```javascript
// 导入 Listener 模块   下载地址: gitee.com/minimouse0/listenapi
import { Listener } from "./plugins/lib/listenAPI.js";

// 导入iLand接口
const ILAPI_PosGetLand = ll.imports("ILAPI_PosGetLand");
const ILAPI_GetOwner = ll.imports("ILAPI_GetOwner");

// 监听      被监听插件名    本插件名               要监听的事件       回调函数
Listener.on("WirelessBox", "ListenEventTemplate", "onWirelessAddBox", result => {
    // 通过iland接口查询领地信息
    const id = ILAPI_PosGetLand(result.box, true);
    // 判断是否未返回领地id
    if (id != -1) {
        // 通过返回的领地id查询添加箱子的玩家是否为领地主人
        if (ILAPI_GetOwner(id) != result.player.xuid) {
            result.player.tell("当前箱子在他人领地内！");
            return false;// 返回false 拦截此次事件

            // 当然，你也要监听iLand创建领地事件，防止已添加的箱子被他人圈入领地内
        }
    }
});
```

`onWirelessAddBox` - 玩家添加箱子   
返回Object:   
- player: `Player`   
    - 触发此次事件的玩家   
- box: `IntPos`   
    - 被绑定箱子坐标  
- name: `String`   
    - 箱子别名   

拦截事件:  
函数返回`false`  

`onWirelessDeleteBox` - 玩家删除箱子    
返回Object:   
- player: `Player`   
    - 触发此次事件的玩家   
- index: `Number`   
    - 箱子在配置文件中的索引   
- box: `Object`   
    - 保存的箱子对象   

拦截事件:  
函数返回`false`  

`onWirelessEditBox` - 玩家重命名箱子别名      
返回Object:    
- player: `Player`   
    - 触发此次事件的玩家      
- oldName: `String`   
    - 旧名称   
- newName: `String`   
    - 新名称   
- index: `Number`   
    - 箱子在配置文件中的索引   
- box: `Object`   
    - 保存的箱子对象   

拦截事件:  
函数返回`false`  
