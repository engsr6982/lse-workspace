import { Game_Cache } from "./Cache.js";
import { Message } from "./Message.js";

// 游戏逻辑处理
export class Game_API {
    static init_ok = false;
    static ID = null;
    static Team = 2;

    /**
     * 初始化
     * @returns 
     */
    static async init() {
        if (!Game_Cache.GameStatus) {
            return;
        }
        this.ID = setInterval(() => {
            let Player_Obj = [];
            mc.getOnlinePlayers().forEach(Player => {
                if (!Player.isSimulatedPlayer()) {
                    Player_Obj.push(Player.realName);
                }
            });
            // 检查玩家数量
            if (Player_Obj.length > 1) {
                // 满足条件
                this.init_ok = true;
                if (Player_Obj.length >= 4) {
                    this.Team = 4;
                }
                // 启动游戏
                this.Start();
            } else {
                Message.sendItemMessage(Player_Obj, '人数不足！最低要求：2人');
            }
        }, 1000);
    }

    /**
     * 启动游戏
     */
    static async Start() {
        let count = 30;
        const ID = setInterval(() => {
            
        }, 1000);
    }

    static async on(Event, Callback) {
        switch (Event) {
            case "":
                break;
            default:
                return logger.error("参数错误");
        }
    }


}