# UMenu - Ultra Menu

插件特性：

- 支持注册扩展，实现更多功能  
- 扩展支持事件，自定义拦截菜单回调等  
- 支持运行javascript代码  
- 完善的扩展注册机制（支持热加载、重载等）  
- 自定义各个配置  
- 支持${name}获取玩家信息  
- 支持#{name}获取按钮信息  

## 命令系统
>
> 注意：  
> <>为必选参数, []为可选参数。输入命令时请勿加上<>或[]

```bash
/umenu                                      打开菜单
/umenu reload                               重载配置文件
/umenu extension list [扩展名|扩展Type]      列出所有已加载扩展 / 查看指定扩展详细信息  
/umenu extension load <文件名>              热加载一个扩展  文件名示例：registerType.js
/umenu extension reload [扩展名|扩展Type]    热重载所有扩展 / 热重载指定扩展
/umenu extension unload <扩展名|扩展Type>    卸载一个扩展
```

## 配置文件

<details>
<summary>点我展开</summary>

- 路径: ./plugins/UMenu/Config.json

```json
{
    "entryFile": "main.json", // 默认入口文件
    "listen": {
        "enable": true, // 是否监听事件
        "listenItem": "minecraft:clock" // 监听的物品
    },
    "command": {
        "command": "umenu", // 要注册的命令
        "describe": "" // 命令描述
    },
    "money": {
        "enable": true, // 是否开启经济
        "moneyType": "llmoney", // 经济类型 score 或 llmoney
        "scoreType": "", // 计分板
        "moneyName": "金币" // 经济名称
    }
}
```

</details>

## 表单参数解释

<details>
<summary>点我展开默认表单文件解释</summary>

```json
{
    "title": "UMenu表单模板", // 表单标题（可选
    "content": [ // 内容  数组就随机显示 字符串就直接显示 （可选
        "你好 ${realName}",
        "玩家:${realName}"
    ],
    "buttons": [
        {
            "name": "cmd", // 按钮名称（可选
            "describe": "执行命令 消耗经济:#{money} ", // 按钮描述（可选  #{money} 的作用是获取当前按钮消耗的经济 也就是1
            "image": "textures/ui/color_plus", //图片（可选
            "money": 1, // 经济（可选
            "permission": [ // 权限（可选，去掉默认所有人有权限
                "any", // any所有人 op管理员 whitelist白名单 blacklist黑名单
                [] // 如果填写 黑/白名单 这里写玩家名
            ],
            "type": "cmd", // 按钮功能类别
            "run": "say 114514" // 运行的东西（这个根据 type决定
        },
        {
            "name": "Form",
            "describe": "一个普普通通按钮",
            "image": "",
            "money": 0,
            "permission": [
                "any",
                []
            ],
            "type": "form",
            "run": "form1.json" // 要打开的子表单 要写后缀
        },
        {
            "name": "Tell",
            "describe": "一个普普通通按钮",
            "image": "",
            "money": 0,
            "permission": [
                "any",
                []
            ],
            "type": "tell",
            "run": "你好啊，陌生人"
        },
        {
            "name": "Eval",
            "describe": "一个普普通通按钮",
            "image": "",
            "money": 0,
            "permission": [
                "any",
                []
            ],
            "type": "eval",
            "run": ".EvalTest.js" // 要执行的脚本要写后缀
        },
        {
            "name": "subform",
            "describe": "一个普普通通按钮",
            "image": "",
            "money": 0,
            "permission": [
                "any",
                []
            ],
            "type": "subform",
            "run": {
                "title": "",
                "content": "${name}",
                "buttons": [
                    {
                        "name": "返回",
                        "describe": "#{name} ",
                        "image": "textures/ui/color_plus",
                        "money": 0,
                        "permission": [
                            "any",
                            []
                        ],
                        "type": "cmd",
                        "run": "umenu"
                    }
                ]
            }
        },
        {
            "name": "ModalForm",
            "describe": "一个普普通通按钮",
            "image": "",
            "money": 0,
            "permission": [
                "any",
                []
            ],
            "type": "modalform",
            "run": {
                "title": "UMenu 模式表单",
                "content": "我是内容",
                "button1": {
                    "name": "确认",
                    "money": 0,
                    "permission": [
                        "any",
                        []
                    ],
                    "type": "cmd",
                    "run": "msg @a 我点了确认"
                },
                "button2": {
                    "name": "取消",
                    "money": 0,
                    "permission": [
                        "any",
                        []
                    ],
                    "type": "tell",
                    "run": "表单已放弃"
                }
            }
        },
        {
            "name": "ContentForm",
            "describe": "一个普普通通按钮",
            "image": "",
            "money": 0,
            "permission": [
                "any",
                []
            ],
            "type": "contentform",
            "run": {
                "title": "UMenu ContentForm表单",
                "content": "这是内容表单 玩家${name}",
                "close": {
                    "money": 0,
                    "permission": [
                        "any",
                        []
                    ],
                    "type": "tell",
                    "run": "表单已放弃"
                },
                "submit": {
                    "money": 0,
                    "permission": [
                        "any",
                        []
                    ],
                    "type": "tell",
                    "run": "表单提交成功"
                }
            }
        },
        {
            "name": "Tag",
            "describe": "需要tag打开此功能",
            "image": "",
            "money": 0,
            "permission": [
                "any",
                []
            ],
            "type": "tag",
            "run": {
                "tag": "test",
                "withtag": {
                    "type": "tell",
                    "run": "你拥有TAG：test"
                },
                "notag": {
                    "type": "tell",
                    "run": "你没有TAG：test"
                }
            }
        }
    ]
}
```

</details>

插件本身不提供任何Type，所有的Type都通过扩展来提供  
插件默认提供11个扩展  

```log
umenu extension list
15:49:51.553 INFO [UMenu] UMenu 扩展列表
                            插件名  type   版本     文件名
15:49:51.553 INFO [UMenu] - runcmd <cmd> [v1.0.0] (Cmd.js)
15:49:51.553 INFO [UMenu]   玩家执行命令
15:49:51.553 INFO [UMenu] - console_Cmd <consolecmd> [v1.0.0] (ConsoleCmd.js)
15:49:51.553 INFO [UMenu]   cmd执行后台命令
15:49:51.553 INFO [UMenu] - contentForm <contentform> [v1.0.0] (ContentForm.js)
15:49:51.553 INFO [UMenu]   内容表单
15:49:51.553 INFO [UMenu] - Eval_JavaScript <eval> [v1.0.0] (Eval.js)
15:49:51.553 INFO [UMenu]   代码运行支持
15:49:51.553 INFO [UMenu] - form <form> [v1.0.0] (Form.js)
15:49:51.553 INFO [UMenu]   多表单扩展
15:49:51.553 INFO [UMenu] - modalform <modalform> [v1.0.0] (ModalForm.js)
15:49:51.553 INFO [UMenu]   模式表单扩展
15:49:51.553 INFO [UMenu] - UMenu-MoneyApi <umenu_inside_moneyapi> [v1.0.0] (MoneyApi.js)
15:49:51.553 INFO [UMenu]   UMenu经济支持扩展
15:49:51.553 INFO [UMenu] - ButtonPermissionCheck <ButtonPermissionCheck> [v1.0.0] (PermissionCheck.js)
15:49:51.553 INFO [UMenu]   按钮权限检查
15:49:51.553 INFO [UMenu] - subform <subform> [v1.0.0] (SubForm.js)
15:49:51.553 INFO [UMenu]   子表单扩展
15:49:51.553 INFO [UMenu] - tag <tag> [v1.0.0] (Tag.js)
15:49:51.553 INFO [UMenu]   Tag检测
15:49:51.553 INFO [UMenu] - tell <tell> [v1.0.0] (Tell.js)
15:49:51.553 INFO [UMenu]   发送文本扩展
15:49:51.553 INFO [UMenu]
15:49:51.553 INFO [UMenu] * 共计[11]个扩展 使用命令"umenu extension <type|name>"来获取更多信息
```

### 详解

> 参数过多，无法理解？  
> 部分参数在UMenu内部为可选参数，请阅读下面详细解释

- 构成UMenu表单文件的最小单元(完整)  

```json
{
    "title": "UMenu表单模板",
    "content": [
        "随机内容1，你好玩家：${realName}",
        "随机内容2"
    ],
    // "content": "也可以这么写",
    "buttons": [
        {
            "name": "返回",
            "describe": "",
            "image": "",
            "money": 0,
            "permission": [
                "any",
                []
            ],
            "type": "form",
            "run": "main.json"
        }
    ]
}
```

- 构成UMenu按钮的最小单元

```json
{
    "name": "返回",
    "image": "",
    "type": "form",
    "run": "main.json"
}
```

> 是的，你没看错。按钮必须的参数只有这4个，其余的均为功能增强  
> 比如`permission`配置，决定按钮的权限  
> `money`决定按钮消耗的经济  
> `describe`就是`name`的换行显示
>  
> 对于`${}`和`#{}`功能分别是：  
> \$开头 获取变量，如`${name}${realName}`分别是获取玩家名和玩家真名  
> #开头 获取按钮的值，如`#{name}`就是获取按钮`name`的值

## 扩展系统

### 安装扩展

1. 把扩展js放入./plugins/UMenu/Extension目录下
2. 重启服务器或使用热加载命令 加载扩展

安装成功UMenu会输出绿色提示

```log
13:48:52 INFO [UMenu] Loading extension [registerType.js] succeeded
```

### 开发扩展

查看仓库projects/UMenu/include文件夹下的类型声明文件，和默认提供的11个扩展的写法开发

### 扩展API

> [!tip]  
> 如可访问API接口？  
> UMenu把内部定义的接口导出到`globalThis.UMenuApi`全局对象上  
> 请不要尝试重写、修改`UMenu`导出的全局接口，这可能导致插件异常  
> API接口定义见`GlobalThis.d.ts`类型文件  

#### API: onEvent

> [!tip]  
> 监听示例  
>
> ```js
> globalThis.UMenuApi.onEvent("onConfigChange", () => {
>       log("配置文件更改!");
> });
> ```

`onConfigChange` - 配置文件更改  

- 拦截：
  - 不可拦截

`onUMenuFormCallBack` - 主表单回调  

- 返回值  
  - player: `Player`  
    玩家
  - button: `ButtonJson`  
    被按下的按钮对象
- 拦截：
  - 函数返回false

## Eval执行代码模版

```js

// 注意： 请不要修改主函数 main的命名
function main(realName, button) {
    const player = mc.getPlayer(realName);
    // 例如：发送一条广播
    mc.broadcast("UMenu");
    // 或者：发送本次被点击按钮的Type
    player.tell(button.type);
}

```
