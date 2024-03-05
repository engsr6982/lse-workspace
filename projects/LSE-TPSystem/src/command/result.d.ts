interface commandResult {
    action: "home" | "warp" | "reload" | "leveldb" | "tpa" | "death" | "pr" | "rule" | "back" | "tpr" | "menu" | "mgr" | "op" | "deop";
    home?: "list" | "go" | "add" | "del";
    warp?: "list" | "go" | "add" | "del";
    tpa?: "deny" | "accept" | "to" | "here";
    leveldb: "import" | "export" | "list" | "del";
    name?: string;
    key?: string;
    key2?: string;
    key_m?: string;
    isOldData?: boolean;
    player?: Array<Player>;
}
