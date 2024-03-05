// Usage:
// new checkJSONElements(__init.Config, Config, true).check().then(newConfig => {
//     FileOperation.setConfig(newConfig).saveFile();
// }).catch(e => {
//     logger.error(`${e}\n${e.stack}`);
// });

export default class checkJSONElements {
    /**
     * 实例化检查器
     * @param {Object} standard  标准配置文件
     * @param {Object} current 当前配置文件
     * @param {Boolean} log 是否打印信息
     */
    constructor(standard, current, log = false) {
        this.standard = standard;
        this.current = current;
        this.log = log;
    }

    toString() {
        JSON.stringify(this.standard);
    }

    async _getMissingAttributes(callback) {
        try {
            const cache = [];
            await _check(this.standard, this.current, "");
            callback(cache);
            async function _check(standard, current, parentKey) {
                try {
                    for (const key in standard) {
                        if (!standard.hasOwnProperty(key)) continue;
                        const value = standard[key];
                        if (Object.prototype.toString.call(value) == "[object Object]") {
                            // 如果是对象，则递归检查
                            // 如果当前配置文件没有该属性，则传递一个空对象
                            await _check(value, current[key] || {}, parentKey + "." + key);
                        } else {
                            // 如果不是对象，则检查是否存在于当前配置文件中
                            if (!(key in current)) {
                                // 如果不存在，将缺少的属性添加到缓存中
                                cache.push({
                                    father: parentKey, // 父键（可能没有）
                                    ConfigurationItem: key, // 配置项
                                    ConfigurationItemValue: value, // 配置项值
                                });
                            }
                        }
                    }
                } catch (e) {
                    logger.error(`${e}\n${e.stack}`);
                }
            }
        } catch (e) {
            logger.error(`${e}\n${e.stack}`);
        }
    }

    async _setNestedProperty(path, value) {
        try {
            const keys = path.split(".");
            let current = this.current;

            for (let i = 0; i < keys.length; i++) {
                const key = keys[i];

                if (i === keys.length - 1) {
                    current[key] = value;
                } else {
                    current[key] = current[key] || {};
                    current = current[key];
                }
            }
        } catch (e) {
            logger.error(`${e}\n${e.stack}`);
        }
    }

    async check() {
        try {
            await this._getMissingAttributes((newConfig) => {
                if (newConfig.length == 0 && this.log) {
                    logger.info(`配置文件检查通过`);
                    return null;
                }
                newConfig.forEach((i) => {
                    let path = i.father + "." + i.ConfigurationItem;
                    if (path.startsWith(".")) {
                        path = path.slice(1);
                    }
                    this._setNestedProperty(path, i.ConfigurationItemValue);
                    this.log ? logger.warn(`[Check] 补充缺失属性 > ${path}: ${i.ConfigurationItemValue}`) : null;
                });
            });
            return this.current;
        } catch (err) {
            logger.error(`[Check] ${err}\n${err.stack}`);
        }
    }
}
