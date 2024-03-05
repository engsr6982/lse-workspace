import { config } from "../utils/data.js";
import { leveldb } from "../utils/leveldb.js";
import { hasOwnProperty_ } from "../utils/util.js";

class RuleManager {
    constructor() {}

    hasPlayerRule(realName: string) {
        const r = leveldb.getRule();
        return hasOwnProperty_(r, realName);
    }

    initPlayerRule(realName: string) {
        const r = leveldb.getRule();
        if (this.hasPlayerRule(realName)) return;

        r[realName] = config.Rule;
        return leveldb.setRule(r);
    }

    updateRule(realName: string, newRule: levelDB_and_Config_Rule_Structure_Item) {
        const allRules = leveldb.getRule();

        allRules[realName] = newRule;

        return leveldb.setRule(allRules);
    }

    getPlayerRule(realName: string): levelDB_and_Config_Rule_Structure_Item {
        const r = leveldb.getRule();
        if (!this.hasPlayerRule(realName)) return null;
        return r[realName];
    }
}

export const ruleCore_Instance = new RuleManager();
