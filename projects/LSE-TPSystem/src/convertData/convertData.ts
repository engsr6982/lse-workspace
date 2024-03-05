import { hasOwnProperty_ } from "../utils/util.js";

export function convertData(oldData: _oldDatabase): {
    death: levelDB_Death_Structure;
    home: levelDB_Home_Structure;
    pr: levelDB_Pr_Structure;
    rule: levelDB_Rule_Structure;
    warp: levelDB_Warp_Structure;
} {
    log("开始转换数据...");

    // 死亡点
    const death_Structure: levelDB_Death_Structure = {};
    if (hasOwnProperty_(oldData, "Death")) {
        for (const playerName in oldData.Death) {
            death_Structure[playerName] = oldData.Death[playerName].map((death) => ({
                ...death,
                time: death.time,
            }));
        }
        log("完成 Death > levelDB_Death_Structure 转换");
    }

    // 家园
    const home_Structure: levelDB_Home_Structure = {};
    if (hasOwnProperty_(oldData, "Home")) {
        for (const playerName in oldData.Home) {
            home_Structure[playerName] = oldData.Home[playerName].map((home) => {
                return {
                    ...home,
                    createdTime: "",
                    modifiedTime: "",
                };
            });
        }
        log("完成 Home > levelDB_Home_Structure 转换");
    }

    let pr_Structure: levelDB_Pr_Structure = [];
    if (hasOwnProperty_(oldData, "MergeRequest")) {
        pr_Structure = oldData.MergeRequest.map((request) => ({
            guid: request.guid,
            playerRealName: request.player,
            time: request.time,
            data: {
                ...request.data,
                name: request.data.name,
            },
        }));
        log("完成 MergeRequest > levelDB_Pr_Structure 转换");
    }

    // 玩家设置
    const rule_Structure: levelDB_Rule_Structure = {};
    if (hasOwnProperty_(oldData, "PlayerSeting")) {
        for (const playerName in oldData.PlayerSeting) {
            rule_Structure[playerName] = {
                deathPopup: oldData.PlayerSeting[playerName].DeathPopup,
                allowTpa: true,
                tpaPopup: true,
            };
        }
        log("完成 PlayerSeting > levelDB_Rule_Structure 转换");
    }

    // 公共点数据
    const warp_Structure: levelDB_Warp_Structure = [];
    if (hasOwnProperty_(oldData, "Warp")) {
        for (const warp of oldData.Warp) {
            warp_Structure.push({
                ...warp,
                createdTime: "",
                modifiedTime: "",
            });
        }
        log("完成 Warp > levelDB_Warp_Structure 转换");
    }

    return {
        death: death_Structure,
        home: home_Structure,
        pr: pr_Structure,
        rule: rule_Structure,
        warp: warp_Structure,
    };
}
