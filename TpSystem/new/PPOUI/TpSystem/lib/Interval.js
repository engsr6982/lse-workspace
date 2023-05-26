import { Time_Mod } from "./Time.js";
import { DeathInvincible } from "./cache.js";


export async function RegInterval() {
    // 检查无敌时间
    setInterval(() => {
        if (DeathInvincible.length == 0) return;
        for (let i = 0; i < DeathInvincible.length; i++) {
            if (Time_Mod.CheckTime(DeathInvincible[i].end)) {
                DeathInvincible.splice(i, 1);
            }
        }
    }, 5 * 1000);// 5秒检查一次

}