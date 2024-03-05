/* eslint-disable complexity */
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

function getTimestamp() {
    const date = new Date();
    const y = date.getFullYear();
    const m = (date.getMonth() + 1).toString().padStart(2, "0");
    const d = date.getDate().toString().padStart(2, "0");
    const h = date.getHours().toString().padStart(2, "0");
    const i = date.getMinutes().toString().padStart(2, "0");
    return `${y}-${m}-${d}-${h}-${i}`;
}

function copyBuildDir(src, dest) {
    fs.mkdirSync(dest, { recursive: true });
    const entries = fs.readdirSync(src, { withFileTypes: true });

    for (let entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
            copyBuildDir(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
    console.log(`Copy [${src}] to [${dest}]`);
}

function runPack() {
    try {
        const workspacePath = path.join(__dirname, "../"); // "...\\llse-workspace\\"
        const targetBuildPath = (() => {
            if (!process.argv[2].endsWith(".js")) {
                return path.resolve(process.argv[2]); // "...\\llse-workspace\\projects\\LSE-OPTools\\dist"
            } else {
                let ret;
                let f = "../";
                for (let i = 0; i < 5; i++) {
                    const t = path.join(path.resolve(process.argv[2]), f);
                    if (t.endsWith("dist\\") || t.endsWith("dist/")) {
                        ret = t;
                        break;
                    } else {
                        f = f + "../";
                    }
                }
                return ret;
            }
        })();
        const tempPath = path.join(__dirname, "../.temp"); // "...\\llse-workspace\\.temp"
        const package = path.basename(path.dirname(targetBuildPath)); // "LSE-OPTools"
        const tempBuildPath = path.join(tempPath, "PPOUI", package, "dist"); // "...\\llse-workspace\\.temp\\PPOUI\\LSE-OPTools\\dist"
        const entryFile = process.argv[2].endsWith(".js") ? path.basename(path.resolve(process.argv[2])) : "index.js";

        // init
        fs.existsSync(path.join(tempPath, package)) ? fs.rmSync(path.join(tempPath), { recursive: true, force: true }) : undefined;
        fs.existsSync(path.join(tempPath, package)) ? undefined : fs.mkdirSync(path.join(tempPath, package), { recursive: true });

        // 复制dist文件夹
        entryFile === "index.js" ? copyBuildDir(targetBuildPath, tempBuildPath) : copyBuildDir(targetBuildPath, tempPath);

        // README.md
        const README_Path = path.join(targetBuildPath, "../", "README.md"); // "...\\llse-workspace\\projects\\LSE-OPTools\\README.md"
        if (fs.existsSync(README_Path)) {
            const target_README_Path = path.join(tempPath, package, "README.md"); // "...\\llse-workspace\\.temp\\README.md"
            fs.copyFileSync(README_Path, target_README_Path);
            console.log(`Copy [${README_Path}] to [${target_README_Path}]`);
        }

        // index.js
        let indexPath = null;
        (() => {
            if (!indexPath && fs.existsSync(path.join(tempBuildPath, entryFile))) indexPath = path.join(tempBuildPath, entryFile);
            if (!indexPath && fs.existsSync(path.join(tempBuildPath, package, entryFile)))
                indexPath = path.join(tempBuildPath, package, entryFile);
            if (
                !indexPath &&
                fs.existsSync(path.join(tempBuildPath, package, "src")) &&
                fs.existsSync(path.join(tempBuildPath, package, "src", entryFile))
            )
                indexPath = path.join(tempBuildPath, package, "src", entryFile);

            if (entryFile != "index.js") {
                if (fs.existsSync(path.join(tempPath, entryFile))) indexPath = path.join(tempPath, entryFile);
                if (fs.existsSync(path.join(tempPath, package, entryFile))) indexPath = path.join(tempPath, package, entryFile);
            }
        })();

        // 找不到index.js
        if (indexPath == null) {
            throw new Error("index.js not found");
        } else {
            if (entryFile === "index.js") {
                const writePath = path.join(tempPath, package, entryFile);
                const jsContent = `import * as _114514 from ".\\plugins\\${path.relative(tempPath, indexPath)}";`.replace(/\\/g, "/");
                if (!fs.existsSync(path.join(writePath, "../"))) {
                    fs.mkdirSync(path.join(writePath, "../"), { recursive: true });
                }
                fs.writeFileSync(writePath, jsContent);
                console.log(`创建文件: ${entryFile}`);
            } else {
                if (fs.existsSync(path.join(tempPath, entryFile)) && !fs.existsSync(path.join(tempPath, package, entryFile))) {
                    fs.renameSync(path.join(tempPath, entryFile), path.join(tempPath, package, entryFile));
                }
            }
        }

        // 创建manifest.json
        const manifestPath = path.join(tempPath, package, `manifest.json`);
        fs.writeFileSync(
            manifestPath,
            JSON.stringify(
                {
                    entry: entryFile,
                    name: package,
                    type: "lse-quickjs",
                    dependencies: [
                        {
                            name: "legacy-script-engine-quickjs",
                        },
                    ],
                },
                null,
                4,
            ),
        );

        // 打包为zip
        const zipName = `${package}-${getTimestamp()}.zip`;
        console.log(`确定Zip文件名：${zipName}`);

        // 先切换到.temp目录再执行打包命令
        process.chdir(tempPath);
        console.log(`进入文件夹：${tempPath}`);

        // 进行打包
        const targetFile = (() => {
            const cac = [];
            const all = fs.readdirSync(path.join(tempPath), { withFileTypes: true });
            for (let it of all) {
                it.isDirectory() ? cac.push(`${it.name}/*`) : cac.push(it.name);
            }
            return cac.join(" ");
        })();
        execSync(`7z a ${zipName} ${targetFile}`);
        console.log(`打包Zip成功: ${zipName}`);

        // 返回上级目录
        process.chdir(workspacePath); // 改变当前工作目录
        console.log(`进入文件夹：${workspacePath}`);

        // 移动文件
        if (process.platform === "win32") {
            execSync(`move ${workspacePath}.temp\\${zipName} ${workspacePath}${zipName}`);
        } else if (process.platform === "linux") {
            execSync(`mv ${workspacePath}.temp/${zipName} ${workspacePath}${zipName}`);
        }
        console.log(`移动文件 ${zipName} 成功`);

        // 删除.temp文件夹
        const deleteTempPath = path.join(__dirname, "../.temp"); // "...\\llse-workspace\\.temp"
        fs.rmSync(deleteTempPath, { recursive: true, force: true });
        console.log(`删除 .temp 文件夹成功: ${deleteTempPath}`);
    } catch (err) {
        console.error(`Fail in Pack: ${err}\n${err.stack}`);
        process.exit(1);
    }
}

(function () {
    if (process.argv[2]) {
        if (process.platform === "win32") execSync(`chcp 65001`); // UTF-8
        runPack();
    } else {
        console.error(`targetPath not input`);
        process.exit(1);
    }
})();
