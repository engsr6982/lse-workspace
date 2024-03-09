/**
 * 检查是否需要进行版本更新
 * @param {string} url 远程版本号所在的URL
 * @param {Array<number>} version 当前版本号，形如 [0, 1, 0, 1]
 */
export async function BegCheckUpdate(pluginName, url, version) {
    // 发送HTTP GET请求获取远程版本号
    try {
        network.httpGet(url, (status, result) => {
            if (status === 200) {
                _callback(result);
            } else {
                logger.error(`请求失败 ${status}  ${url}`);
            }
        });
    } catch (e) {
        logger.error(`${e}\n${e.stack}`);
    }

    async function _callback(result) {
        const ver = await matchString(result);
        if (ver === null) {
            logger.error(`匹配版本号失败！ 请检查MineBBS版本号是否按要求设置! 格式: x.x.x`);
            return;
        }
        const bool = await checkVersion(ver, version);
        if (bool === null) {
            logger.error(`版本号错误！ MineBBS版本格式: x.x.x  插件格式: [x,x,x]`);
            return;
        }
        if (bool) {
            logger.warn(`检测到插件<${pluginName}>新版本，当前版本: ${version}  最新版本: ${ver} \n下载地址： ${url}`);
        }
    }
}

/**
 * 从HTML代码中匹配出版本号
 * @param {string} str 包含版本号的HTML代码
 * @returns {Promise<string>} 匹配到的版本号
 */
async function matchString(str) {
    const regex = /<span class="u-muted">([\d\.]+)<\/span>/;
    const match = str.match(regex);
    return match ? match[1] : null;
}

/**
 * 检查版本号
 * @param {*} nversion 新版本号  0.2.0
 * @param {*} lversion 当前版本号  0,1,0
 * @returns boolean 是否需要更新
 */
async function checkVersion(nversion, lversion) {
    try {
        // logger.debug(nversion, "/", lversion);
        // 检查是否为数组
        if (!Array.isArray(nversion)) {
            nversion = nversion.split(".");
        }
        if (!Array.isArray(lversion)) {
            lversion = lversion.split(",");
        }
        // 限制长度
        lversion.length = 3;
        // logger.debug(nversion, "/", lversion);
        // 检查长度
        if (nversion.length !== 3 || lversion.length !== 3) {
            return null;
        }
        // logger.debug(nversion, "/", lversion);
        // 匹配每一个版本号
        for (let i = 0; i < nversion.length; i++) {
            if (nversion[i] > lversion[i]) {
                return true;
            }
        }
        return false;
    } catch (e) {
        logger.error(`${e}\n${e.stack}`);
    }
}
