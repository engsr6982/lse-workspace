// LiteLoader-AIDS automatic generated
/// <reference path="c:\Users\Administrator\Documents\aids/dts/HelperLib-master/src/index.d.ts"/> 

const PLUGIN_INFO = {
    name: 'Block-Race',
    introduction: '',
    version: [0, 0, 1],
    MineBBS_URL: '',
    filepath: `.\\plugins\\PPOUI\\Block-Race\\`,
    debugger: false
};
{
    ll.registerPlugin(
        /* name */ PLUGIN_INFO.name,
        /* introduction */ PLUGIN_INFO.introduction,
        /* version */ PLUGIN_INFO.version,
        /* otherInformation */ {
            "名称": PLUGIN_INFO.name
        }
    );
    logger.warn('警告：插件不稳定测试中！ 请勿用于生产环境！后果自负！');
    if (file.exists('.\\plugins\\PPOUI\\debug')) {
        PLUGIN_INFO.debugger = true;
        logger.setTitle(`${PLUGIN_INFO.name} Debug`);
        logger.setLogLevel(5);
    }
}

/**
 * 消息类
 */
class Message {
    /**
     * 广播任务完成消息
     * @param {String} team 队伍
     * @param {String} playername 玩家名
     * @param {String} difficulty 难度
     * @param {String} taskname 任务名
     */
    static BroadcastTaskMessage(team, playername, difficulty, taskname) {
        mc.broadcast(`[√] ${team}队员 [${playername}] 完成了目标 [${difficulty} | ${taskname}]`);
    }
    /**
     * 发送消息
     * @param {Object} player 玩家
     * @param {String} message [消息]
     */
    static sendMessage(player, message = `表单已放弃！`) {
        let header = `[${PLUGIN_INFO.name}]`;
        if (PLUGIN_INFO.debugger) {
            header = `[${PLUGIN_INFO.name} Debug]`;
        }
        player.tell(`${header} ${message}`);
    }
    /**
     * 批量发送侧边栏
     * @param {Array} player 玩家对象 [pl, pl, pl, ...]
     * @param {String} title 标题
     * @param {Object} data 内容
     * @returns 
     */
    static sendPlayerSidebar(player = [], title = '', data = null) {
        if (player.length == 0) {
            throw new Error(`Player parameter is empty! The length of player is ${player.length}.`);
        }
        if (data == null) {
            throw new Error('Data is null.');
        }
        player.forEach(pl => {
            pl.setSidebar(title, data);
        })
        return true;
    }
    /**
     * 批量发送物品栏上方消息
     * @param {Array} player 玩家对象 [pl, pl, ...]
     * @param {String} message 消息
     * @returns 
     */
    static sendItemMessage(player = [], message) {
        if (player.length == 0) {
            throw new Error(`Player parameter is empty! The length of player is ${player.length}.`);
        }
        if (message == null) {
            throw new Error(`message is null`);
        }
        player.forEach(pl => {
            pl.tell(message, 5);
        })
        return true;
    }
}

/**
 * 表单类
 */
class Forms {
    static Team(player, team_4 = false) {
        if (!player) {
            throw new Error('player is ' + player);
        }
        const Team = ['红队', '蓝队', '黄队', '绿队'];
        const fm = mc.newSimpleForm()
        fm.setTitle('§e选择队伍');
        fm.setContent(`选择并加入一个队伍`);
        fm.addButton(`【${Team[0]}】`);
        fm.addButton(`【${Team[1]}】`);
        if (team_4) {
            fm.addButton(`【${Team[2]}】`);
            fm.addButton(`【${Team[3]}】`);
        }
        player.sendForm(fm, (player, id) => {
            if (!player) {
                return Message.sendMessage(player);
            }
            player.addTag(Team[id]);
            Message.sendMessage(player, '你已加入' + Team[id]);
        })
    }
}

/**
 * 功能类
 */
class Mod {
    /**
     * 随机ID
     * @param {Number} num 长度
     * @returns 
     */
    static RandomID(num = 10) {
        let str = '';
        const char = '1234567890QWERTYUIOPASDFGHJKLZXCVBNM';
        for (let i = 0; i < num; i++) {
            let index = Math.floor(Math.random() * char.length);
            str += char[index];
        }
        return str;
    }
    /**
     * 保存对局数据
     */
    static SaveCache() {
        logger.info('保存对局数据...');
        try {
            const Time = system.getTimeStr();
            const Cache_JSON = JSON.stringify(Game_Cache, null, '\t');
            if (file.writeTo(PLUGIN_INFO.filepath + `Cache\\${Time + this.RandomID(6)}.json`, Cache_JSON)) {
                logger.info('保存成功！');
            }
        } catch (e) {
            logger.error(`保存失败！\n` + e);
        }
    }
}

/**
 * 游戏缓存
 */
let Game_Cache = {
    GameStatus: false,//游戏状态
    TargetScore: 0,//目标分数
    WinningTeam: "",//胜利队伍
    Team: {
        Red: {
            Roll: 1,//可轮换词条次数
            Score: 0,//当前分数
            Player: {
                "Steve": {
                    Score: 0,//贡献分数
                    CompletedEntry: 0//完成词条
                }
            },//队伍玩家
            MissionEntry: [],//任务词条
            RecordPoint: {
                "test": {
                    x: 0,
                    y: 0,
                    z: 0,
                    dimid: 0
                }
            },//队伍记录点
            Chest: {}//队伍箱子
        },
        Blue: {
            Roll: 1,
            Score: 0,
            Player: {},
            MissionEntry: [],
            RecordPoint: {},
            Chest: {}
        },
        Yellow: {
            Roll: 1,
            Score: 0,
            Player: {},
            MissionEntry: [],
            RecordPoint: {},
            Chest: {}
        },
        Green: {
            Roll: 1,
            Score: 0,
            Player: {},
            MissionEntry: [],
            RecordPoint: {},
            Chest: {}
        }
    },
    QuitPlayer: []//退出玩家
};



/* 监听事件 */
{
    // 监听进服
    mc.listen('onJoin', (player) => {
        if (Game_Cache.GameStatus) {

        }
    });
    // 退出事件
    mc.listen('onLeft', (player) => {

    })
}

/* 注册命令 */
{
    /* 注册顶层 */
    const Command = mc.newCommand(`br`, `方块竞速`, PermType.Any);

    // br save
    Command.setEnum('save', ['save']);
    Command.mandatory('action', ParamType.Enum, 'save', 'save', 1);
    Command.overload(['save']);

    // br reload
    Command.setEnum('Reload', ['reload']);
    Command.mandatory('action', ParamType.Enum, 'Reload', 'Reload', 1);
    Command.overload(['Reload']);

    // br join <red|blue|yellow|green>
    Command.setEnum('joinm', ['join']);
    Command.setEnum('teamm', ['red', 'blue', 'yellow', 'green']);
    Command.mandatory('action', ParamType.Enum, 'joinm', 'joinm', 1);
    Command.mandatory('team', ParamType.Enum, 'teamm', 'teamm', 1);
    Command.overload('joinm', 'teamm');

    // br roll <int>
    Command.setEnum('roll', ['roll']);
    Command.mandatory('action', ParamType.Enum, 'roll', 'roll', 1);
    Command.mandatory('int', ParamType.Int);
    Command.overload(['roll', 'int']);

    // br record <add|del|tp> <text>
    Command.setEnum('record', ['record']);
    Command.mandatory('action', ParamType.Enum, 'record','record',1);
    Command.setEnum('rtypem', ['add', 'del', 'tp']);
    Command.mandatory('record_type', ParamType.Enum, 'rtypem', 'rtypem',1);
    Command.mandatory('record_name', ParamType.RawText);
    Command.overload(['record', 'rtypem', 'record_name']);

    // br tp <player>
    Command.setEnum('tp', ['tp']);
    Command.mandatory('action', ParamType.Enum, 'tp', 'tp',1);
    Command.mandatory('player', ParamType.Player);
    Command.overload(['tp', 'player']);

    Command.setCallback((_, ori, out, res) => {
        logger.debug(JSON.stringify(res));
        switch (res.action) {
        }
    })
    Command.setup()
    mc.listen('onServerStarted', () => {
        mc.runcmd('/? br')
    })
}

