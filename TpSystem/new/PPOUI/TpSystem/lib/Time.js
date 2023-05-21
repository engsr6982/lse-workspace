

export class Time_Mod {
    /**
     *  根据传入日期时间判断
     * @param {String} time 日期  2023-01-01 10:30:20
     * @returns Boolean true到期 false未到期
     */
    static CheckTime(time) {
        logger.debug(new Date(time).getTime() <= new Date().getTime());
        if (new Date(time).getTime() <= new Date().getTime()) {
            return true;
        }
        else {
            return false;
        }
    }
    /**
     * 获取结束时间
     * @param {number} time 时间（单位：秒或分钟）
     * @param {string} [unit='minute'] 时间单位，可选值为 'second' 或 'minute'，默认为 'minute'
     * @returns {string} 格式化后的结束时间字符串
     */
    static getEndTimes(time, unit = 'minute') {
        const date = new Date(Date.now() + time * (unit === 'second' ? 1000 : 60000));
        const y = date.getFullYear();
        const m = (date.getMonth() + 1).toString().padStart(2, '0');
        const d = date.getDate().toString().padStart(2, '0');
        const h = date.getHours().toString().padStart(2, '0');
        const i = date.getMinutes().toString().padStart(2, '0');
        const s = date.getSeconds().toString().padStart(2, '0');
        return `${y}-${m}-${d} ${h}:${i}:${s}`;
    }
}
