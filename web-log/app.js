// LiteLoader-AIDS automatic generated
/// <reference path="c:\Users\Administrator\Documents\aids/dts/HelperLib-master/src/index.d.ts"/> 
console.log('作者： PPOUI\n', 'https://www.minebbs.com/resources/authors/ppoui.33900/');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const log4js = require('log4js');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const progress = require('progress');
const app = express();
const logger = log4js.getLogger('WEB LOG');

const FilePath = `.\\plugins\\PPOUI\\Web_Log\\`;

if (!File.exists(FilePath + 'Config.json')) {
    File.writeTo(FilePath + 'Config.json', JSON.stringify({
        "listenPort": 60012,
        "logLevel": "info",
        "logSaveDays": 7
    }, null, '\t'));
}
let Config;
let InitializationStatus = false;

try {
    Config = JSON.parse(File.readFrom(FilePath + 'Config.json'));
    InitializationStatus = true;
} catch (e) {
    throw new Error('\n格式化配置文件出错\n' + e);
}

// 配置log4js
log4js.configure({
    appenders: {
        file: {
            type: 'dateFile',
            filename: 'logs/WebLog/api',
            pattern: 'yyyy-MM-dd.log',
            alwaysIncludePattern: true,
            keepFileExt: true,
            numBackups: Config.logSaveDays
        },
        out: { type: 'stdout' }
    },
    categories: {
        default: {
            appenders: ['file', 'out'],
            level: Config.logLevel
        }
    }
})

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// 使用log4js中间件
app.use(log4js.connectLogger(logger, {
    level: 'auto',
    format: (req, res, format) => format(`:remote-addr - :method :url HTTP/:http-version :status :content-length ":referrer" ":user-agent"`)
}));

app.use(express.static(path.resolve('./plugins/nodejs/web-log/public')));
app.get('/', (req, res) => {
    res.sendFile('index.html', { root: path.resolve('./plugins/nodejs/web-log/public') });
})

// 获取文件列表
app.post('/api/list', (req, res) => {
    const dirPath = path.join('./logs');
    fs.readdir(dirPath, (err, files) => {
        if (err) {
            logger.error(`获取文件列表失败：${err}`);
            res.json({ success: false, message: '获取文件列表失败' });
        } else {
            let Cache = [];
            for (let i = 0; i < files.length; i++) {
                if (files[i].endsWith('.csv')) {
                    Cache.push(files[i]);
                }
            }
            logger.info(`共获取到${Cache.length}个CSV文件`);
            res.json({ success: true, files: Cache });
        }
    });
});

// 加载csv文件
app.post('/api/load', (req, res) => {
    const filename = req.body.filename;
    const filePath = path.join('./logs', filename);
    const rows = [];
    let totalRows = 0;

    _run();
    async function _run() {
        // 统计文件总行数
        fs.createReadStream(filePath).on('data', chunk => {
            totalRows += chunk.toString().split('\n').length - 1;
        }).on('end', () => {
            const progressBar = new progress('[:bar] :percent :file :txt', {
                complete: '=',
                incomplete: ' ',
                width: 50,
                total: totalRows
            });

            // 逐行读取csv文件并生成进度条
            fs.createReadStream(filePath)
                .on('error', err => {
                    logger.error(`读取文件失败：${err}`);
                    res.json({ success: false, message: '读取文件失败' });
                })
                .pipe(csv())
                .on('headers', headers => {
                    //logger.info(`文件头部：${JSON.stringify(headers)}`);
                    logger.info(`开始处理文件： ${filename}\n`);
                })
                .on('data', row => {
                    rows.push(row);
                    progressBar.tick({ file: filename, txt: "处理中..." });
                })
                .on('end', () => {
                    console.log('\n')
                    logger.info(`处理文件完成  共：${rows.length} 行数据`);
                    if (rows.length == 0) {
                        return res.json({ success: false, message: '处理文件失败！' });
                    }

                    res.json({
                        success: true,
                        filename: filename,
                        headers: Object.keys(rows[0]),
                        rows: rows.map(row => Object.values(row))
                    });
                });
        });
    }
});

// 下载csv文件
app.get('/api/download', (req, res) => {
    const filename = req.query.filename;
    const filePath = path.join('./logs', filename);
    res.download(filePath, filename, err => {
        if (err) {
            logger.error(`下载文件失败：${err}`);
        } else {
            logger.info(`下载文件成功：${filename}`);
        }
    });
});

// 启动服务
function StartServer() {
    if (InitializationStatus) {
        const Server = app.listen(Config.listenPort, () => {
            logger.info('服务已启动, 监听端口：' + Config.listenPort, `\n访问页面 -> http://localhost:${Config.listenPort}`);
        });
        Server.on('error', (err) => {
            if (err.code == 'EADDRINUSE') {
                logger.error(`启动Web_Log服务失败  端口号：${Config.listenPort} 已被占用！请尝试更换其他端口！`);
                Server.close();
            } else {
                logger.error(err)
            }
        })
    } else {
        logger.error('初始化错误！ 无法启动Web_Log服务')
    }
}
StartServer();

// 监听未捕获的promise错误
process.on("unhandledRejection", (reason, promise) => {
    logger.error('Unhandled Rejection at:', promise, 'reason:', reason)
});
// 遇到错误不终止进程
process.on('uncaughtException', function (err) {
    logger.error('Caught exception: ' + err);
});