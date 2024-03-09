
import { insertFP } from "../utils/SQL.js";
import { _filePath } from "../utils/cache.js";

export function update() {
    const old_data = _filePath + "data\\Save_SimulatedPlayer.json";
    if (file.exists(old_data)) {
        const json = JSON.parse(file.readFrom(old_data));
        json.forEach((fp_old) => {
            const fp = {
                Name: fp_old.Name,
                isInvincible: fp_old.Invincible,
                isAutoResurrection: fp_old.AutoResurrection,
                BindPlayer: fp_old.BindPlayer,
                isAutoOnline: fp_old.AutoOnline,
                OnlinePos: fp_old.OnlinePos,
                Bag: "",
            };
            insertFP(fp);
        });
        file.rename(old_data, old_data + ".bak");
        logger.info("数据转换完成！");
    }
}
