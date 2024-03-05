import { changeTime } from "../plugins/changeTime.js";
import { crashClient_UI } from "../plugins/crashClient.js";
import { gameRule_UI } from "../plugins/gamerule.js";
import { kick_UI } from "../plugins/kick.js";
import { kill_UI } from "../plugins/kill.js";
import { modifyWeather } from "../plugins/modifyWeather.js";
import { playerCmd_UI } from "../plugins/player_cmd.js";
import { playerTalk_UI } from "../plugins/player_talk.js";
import { playerInfo_UI } from "../plugins/playerinfo.js";

export const pluginManager: { [key: string]: (player: Player) => void } = {
    "0x0": kick_UI,
    "0x1": kill_UI,
    "0x2": playerTalk_UI,
    "0x3": playerCmd_UI,
    "0x4": crashClient_UI,
    "0x5": playerInfo_UI,
    "0x6": modifyWeather,
    "0x7": changeTime,
    "0x8": null,
    "0x9": gameRule_UI,
    "0x10": null,
    "0x11": null,
    "0x12": null,
    "0x13": null,
    "0x14": null,
    "0x15": null,
    "0x16": null,
    "0x17": null,
    "0x18": null,
    "0x19": null,
    "0x20": null,
    "0x21": null,
};
