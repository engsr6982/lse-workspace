/**
 * 检查是否需要进行版本更新
 * @param pluginName 插件名称
 * @param url MineBBS资源URL地址
 * @param version 当前版本号，形如 [0, 1, 0, 1]
 */
export async function BegCheckUpdate(pluginName: string, url: string, version: Array<number>) {
    // 发送HTTP GET请求获取html页面文件
    try {
        network.httpGet(url, (status, result) => {
            if (status === 200) {
                _callback(result);
            } else {
                logger.error(`The request failed ${url} : ${status}`);
            }
        });
    } catch (e) {
        logger.error(`${e}\n${e.stack}`);
    }

    async function _callback(result: string) {
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
 * @param str 包含版本号的HTML代码
 * @returns 匹配到的版本号
 */
async function matchString(str: string): Promise<string> {
    // eslint-disable-next-line no-useless-escape
    const regex = /<span class="u-muted">([\d\.]+)<\/span>/;
    const match = str.match(regex);
    return match ? match[1] : null;
}

/**
 * 检查版本号
 * @param nversion 新版本号  0.2.0
 * @param lversion 当前版本号  0,1,0
 * @returns 是否需要更新
 */
async function checkVersion(nversion: string | Array<number>, lversion: string | Array<number>): Promise<boolean> {
    try {
        // logger.debug(nversion, "/", lversion);
        // 检查是否为数组不是则转为数组
        // @ts-ignore
        const _n: Array<number> = Array.isArray(nversion) ? (nversion as Array<number>) : (nversion as string).split(".");
        // @ts-ignore
        const _l: Array<number> = Array.isArray(lversion) ? (lversion as Array<number>) : (lversion as string).split(",");

        _l.length = 3; // 限制长度

        // logger.debug(nversion, "/", lversion);
        // 检查长度
        if (_n.length !== 3 || _l.length !== 3) {
            return null;
        }
        // logger.debug(nversion, "/", lversion);
        // 匹配每一个版本号
        for (let i = 0; i < _n.length; i++) {
            if (_n[i] > _l[i]) {
                return true;
            }
        }
        return false;
    } catch (e) {
        logger.error(`${e}\n${e.stack}`);
    }
}
