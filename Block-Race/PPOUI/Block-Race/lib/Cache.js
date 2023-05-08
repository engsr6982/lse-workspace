export const PLUGIN_INFO = {
    name: 'Block-Race',
    introduction: '',
    version: [0, 0, 1],
    MineBBS_URL: '',
    filepath: `.\\plugins\\PPOUI\\Block-Race\\`,
    debugger: false
};
/**
 * 游戏缓存
 */
export let Game_Cache = {
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
