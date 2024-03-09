
export default class CsvLogger {
    /**
     * 实例化CsvLogger
     * @param {String} path 存放CSV日志到文件夹 .\\logs\\
     * @param {String} fileName CSV文件名  log.csv  或 log_%Y%-%M%-%D%.csv
     * @param {String} header CSV文件第一行内容
     */
    constructor(path, fileName, header = "") {
        this._path = path;
        this._fileName = fileName;
        this._header = header;
        this._openName = null;
        this._openFile = this._path + this._openName;
        this.checkFileName();
    }

    /**
     * 获取日期字符串
     * @returns 2021-6-10
     */
    getTimeStr() {
        const t = system.getTimeObj();
        return {
            Str: `${t.Y}-${t.M}-${t.D}`,
            Y: t.Y,
            M: t.M,
            D: t.D,
        };
    }

    /**
     * 检查文件名是否需要更新
     */
    checkFileName() {
        const dateStr = this.getTimeStr();
        const name = this._fileName.replace(/%Y%/, dateStr.Y).replace(/%M%/, dateStr.M).replace(/%D%/, dateStr.D);
        if (name !== this._openName) {
            this._openName = name;
            this._openFile = this._path + this._openName;
            // 如果有header，写入header
            if (this._header && !file.exists(this._openFile)) {
                this.write(this._header);
            }
        }
    }

    /**
     * 写入一行日志
     * @param {String} msg 日志内容
     */
    write(msg) {
        this.checkFileName();
        file.writeLine(this._openFile, msg);
    }
}
