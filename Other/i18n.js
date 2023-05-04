function createI18n() {
    const i18n = {
        messages: {}, // 存储所有可用的翻译文本
        /**
         * 从指定路径读取并解析翻译文件
         * @param {String} path 翻译文件的路径
         */
        load(path, json) {
            if (json == '' || json == null || json == undefined) json = {};
            if (path == '' || path == null || path == undefined) return false;
            if (!File.exists(path)) {
                File.writeTo(path, JSON.stringify(json, null, '\t'));
            }
            try {
                this.messages = JSON.parse(File.readFrom(path));
            } catch (e) {
                logger.error(e);
            }
        },
        /**
         * 获取指定 key 的翻译数据
         * @param {String} key 翻译数据的键名
         * @param {Object} values 占位符对应实际值的对象
         * @returns {String} 翻译结果
         */
        tr(key, values) {
            const message = this.messages[key];
            if (!message) {
                return key;
            }
            return this.interpolate(message, values);
        },
        /**
         * 将翻译文本中的占位符替换为实际值
         * @param {String} message 翻译文本
         * @param {Object} values 实际值
         * @returns {String} 替换后的翻译文本
         */
        interpolate(message, values) {
            if (!values) {
                return message;
            }
            return message.replace(/\{([^}]+)\}/g, (match, p1) => {
                return values[p1] !== undefined ? values[p1] : match;
            });
        },
    };
    return i18n;
}

// 创建 i18n 实例
const i18n = createI18n();

// 读取翻译文件
i18n.load('.\\test.json', { "111": "{0} 666" });

// 使用翻译数据
log(i18n.tr('111', { 0: 'John' })); // 输出 'Hello, John!'