interface initDataType {
    isAutoRespawn: boolean; // 自动重生
    isAutoOnline: boolean; //自动上线
    isInvincible: boolean; //是否无敌
    onlinePos: IntPos | FloatPos; //上线坐标
    bindPlayer: string; //绑定玩家
    bagGUIDKey: string;
}

interface SQL_insertRow extends initDataType {
    name: string;
}

const _LoopTypeList = ["attack", "destroy", "item"] as const;
type LoopTypes = (typeof _LoopTypeList)[number];

const _SetPropertysList = ["isInvincible", "isAutoRespawn", "isAutoOnline"] as const;
type Propertys = (typeof _SetPropertysList)[number];
