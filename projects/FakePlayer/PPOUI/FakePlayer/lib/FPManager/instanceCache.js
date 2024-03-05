
class instanceCache {
    constructor() {}

    example = {};

    size() {
        return Object.keys(this.example).length;
    }

    has(key) {
        const s = this.example.hasOwnProperty(key);
        logger.debug(`检查缓存: ${key} => ${s}`);
        return s;
    }

    get(key) {
        if (this.has(key)) {
            return this.example[key];
        }
        return null;
    }

    delete(key) {
        if (this.has(key)) {
            logger.debug(`删除缓存: ${key}`);
            this.example[key] = null;
            delete this.example[key];
            logger.debug(`缓存数量: ${this.size()}`);
            return true;
        }
        return false;
    }

    set(key, value) {
        if (!this.has(key)) {
            logger.debug(`写入缓存：${key} => ${value}`);
            this.example[key] = value;
            logger.debug(`缓存数量: ${this.size()}`);
            return value;
        }
        return null;
    }
}

/**@type {import("./tab").FP_cache} */
export const cache = new instanceCache();
