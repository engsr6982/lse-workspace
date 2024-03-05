import { time } from "../../../LSE-Modules/src/Time.js";
import { config } from "../utils/data.js";
import { leveldb } from "../utils/leveldb.js";
import { convertPosToVec3, convertVec3ToPos, formatVec3ToString, hasOwnProperty_, sendMessage } from "../utils/util.js";
import { money_Instance } from "../include/money.js";

function initListen() {
    if (config.Death.Enable) {
        mc.listen("onPlayerDie", (player) => {
            if (player.isSimulatedPlayer() || !player || !player.pos) return; // 过滤模拟玩家
            deathCore_Instance.addDeathInfo(player.realName, convertPosToVec3(player.blockPos));
            sendMessage(player, `已记录本次死亡信息 ${formatVec3ToString(player.blockPos)}`);
        });
        logger.info(`玩家死亡事件已注册！`);
    }
}

class DeathCore {
    constructor() {
        initListen();
    }

    addDeathInfo(realName: string, vec3: Vec3) {
        const d = leveldb.getDeath();

        if (!hasOwnProperty_(d, realName)) {
            d[realName] = []; // 初始化玩家数据
        }

        // 在首位插入数据
        d[realName].unshift({
            ...vec3,
            time: time.formatDateToString(new Date()),
        });

        // 检查数量，并清除最后一次信息
        if (d[realName].length > config.Death.MaxDeath) {
            d[realName].pop();
        }

        // 保存数据
        return leveldb.setDeath(d);
    }

    goDeath(player: Player, index: number = 0) {
        const d = leveldb.getDeath();

        if (d[player.realName].length === 0) {
            sendMessage(player, "你还没有死亡点信息！");
        }

        if (money_Instance.deductPlayerMoney(player, config.Death.GoDeathMoney)) {
            player.teleport(convertVec3ToPos(d[player.realName][index]))
                ? sendMessage(player, "传送成功！")
                : sendMessage(player, "传送失败！");
        }
    }
}

export const deathCore_Instance = new DeathCore();
