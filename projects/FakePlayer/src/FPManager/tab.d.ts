interface initDataType {
    isAutoRespawn: boolean; // 自动重生
    isAutoOnline: boolean; //自动上线
    isInvincible: boolean; //是否无敌
    onlinePos: IntPos | FloatPos; //上线坐标
    bindPlayer: string; //绑定玩家
    bagGUIDKey: string;
}
