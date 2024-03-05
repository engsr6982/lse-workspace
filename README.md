# LSE JavaScript Plugins Workspace

> [!IMPORTANT]  
> 你是否在寻找其他的旧插件？  
> 它们已经被归档到了`main-v2`分支

## 编译

1. 克隆并进入仓库

```bash
git clone --depth=1 https://github.com/engsr6982/LSE-workspace.git
cd LSE-workspace
```

2. 安装依赖并执行编译  

```bash
pnpm install
npm run dist
```

3. 打包插件（可选）

```bash
npm run pack ./projects/LSE-OPTools/dist
```

## 创建新插件

新插件的目录结构应和`LSE-TPSystem`一样

```file
LSE-workspace
    │ ...
    └─projects
        └─LSE-TPSystem
            │  .gitignore
            │  package.json
            │  tsconfig.json
            └─src
                └─index.ts
```

所有代码文件均应该放在`src`下

`src`下应有一个名为`index.ts`的入口文件

创建好仓库后，子模块应添加到`projects`下
