// copy llse-modules/src/pdv.ts to this
interface _PDVType {
    [pdv: string]: any;
}

/* export */ class PDV {
    constructor() {}

    private _regx: RegExp = /%(\w+)%/gm;
    private _pdvs: _PDVType = {};

    set PDVS(pdv: _PDVType) {
        this._pdvs = pdv;
    }

    private hasOwnProperty_PDVS = (key: string) => {
        return Object.prototype.hasOwnProperty.call(this._pdvs, key);
    };

    regPDV(pdv: string, value: any) {
        if (this.hasOwnProperty_PDVS(pdv)) return false;
        this._pdvs[pdv] = value;
        return true;
    }

    replacePDV(text: string, obj?: any): string {
        return text.replace(this._regx, (match, key) => {
            if (this.hasOwnProperty_PDVS(key)) {
                return typeof this._pdvs[key] === "function" ? this._pdvs[key](obj) : this._pdvs[key];
            }
            return match;
        });
    }

    listPDV() {
        return Object.keys(this._pdvs);
    }
}

// end copy

interface ConfigType {
    time: number;
    sidebar: {
        title: string;
        content: {
            [text: string]: number;
        };
    };
}

const pdv = new PDV();
const display = new Map();
let config: ConfigType,
    timeStrat = new Date().getTime(),
    timeEnd = new Date().getTime(),
    mcTick = 0;

class configFile {
    private static filePath = `.\\plugins\\PPOUI\\Sidebar\\`;
    static load() {
        if (!file.exists(this.filePath + "config.json"))
            this.write({
                time: 1000,
                sidebar: {
                    title: " ",
                    content: {
                        "%tps%": 0,
                    },
                },
            } as ConfigType);
        // read
        config = JSON.parse(file.readFrom(this.filePath + "config.json"));
    }
    static write(newData?: ConfigType) {
        return file.writeTo(this.filePath + "config.json", JSON.stringify(newData || {}, null, "\t"));
    }
}

class onEvent {
    static onTick() {
        mcTick += 1; // tick +1
        if (mcTick === 20) {
            mcTick = 0;
            timeEnd = timeStrat;
            timeStrat = new Date().getTime();
        }
    }
    static onJoin(player: Player) {
        if (player.xuid) {
            display.set(player.xuid, 114514);
        }
    }
    static onLeft(player: Player) {
        if (display.has(player.xuid)) {
            display.delete(player.xuid);
        }
    }
    static regEvent() {
        mc.listen("onJoin", onEvent.onJoin);
        mc.listen("onLeft", onEvent.onLeft);
        mc.listen("onTick", onEvent.onTick);
    }
}

// @ts-ignore
function regCommand() {
    try {
        const cmd = mc.newCommand(`sidebar`, "开启/关闭 侧边栏", PermType.Any);
        cmd.overload([]);
        cmd.setCallback((_, ori, out) => {
            if (!ori.player) return;
            const { player } = ori;
            if (display.has(player.xuid)) {
                onEvent.onLeft(player);
                player.removeSidebar();
                out.success(`[SideBar] 关闭侧边栏成功！`);
            } else {
                onEvent.onJoin(player);
                out.success(`[SideBar] 开启侧边栏成功！`);
            }
        });
        cmd.setup();
    } catch (e) {
        logger.error(e);
    }
}

function sidebarCore() {
    const allPlayers = mc.getOnlinePlayers();
    const playersLength = allPlayers.length;

    const { title, content } = config.sidebar;
    let sidebarContent = JSON.stringify(content);

    let index = 0;
    while (index < playersLength) {
        const player = allPlayers[index++];
        if (!display.has(player.xuid)) continue;
        player.removeSidebar();
        sidebarContent = pdv.replacePDV(sidebarContent, player); // update pdv
        // @ts-ignore
        player.setSidebar(title, JSON.parse(sidebarContent));
    }
}

// plugin end

const biome_zh_CN: {
    [key: string]: string;
} = {
    ocean: "§b海洋§r",
    plains: "§a平原§r",
    desert: "§e沙漠§r",
    forest: "§a森林§r",
    river: "§b河流",
    hell: "§c下界荒地§r",
    the_end: "§d末地§r",
    frozen_river: "§b冻河§r",
    beach: "§e沙滩§r",
    jungle: "§2丛林§r",
    deep_ocean: "§b深海§r",
    roofed_forest: "§0黑§2森林§r",
    savanna: "§6热带§a草原§r",
    savanna_plateau: "§6热带§a高原§r",
    warm_ocean: "§e暖水§b海洋§r",
    deep_warm_ocean: "§e暖水§b深海§r",
    lukewarm_ocean: "§e温水§b海洋§r",
    deep_lukewarm_ocean: "§e温水§b深海§r",
    cold_ocean: "§b冷水海洋§r",
    deep_cold_ocean: "§b冷水深海§r",
    frozen_ocean: "§b冻洋§r",
    deep_frozen_ocean: "§b冰冻深海§r",
    bamboo_jungle: "§a竹林§r",
    sunflower_plains: "§6向日葵§a平原§r",
    soulsand_valley: "§c灵魂沙峡谷§r",
    crimson_forest: "§c绯红森林§r",
    warped_forest: "§c诡异森林§r",
    basalt_deltas: "§c玄武岩三角洲§r",
    meadow: "§a草甸§r",
    deep_dark: "§d深暗之域§r",
};

function loadPlugin() {
    // 在这里定义预定义变量(轻量应用场景)
    pdv.PDVS = {
        tps: () => ((1000 * 20) / (timeStrat - timeEnd)).toFixed(1),
        ping: (pl: Player) => pl.getDevice().avgPing,

        // player
        handitdamage: (pl: Player) => {
            const { damage, maxDamage, count } = pl.getHand();
            const dmg = maxDamage - damage;
            return dmg || count || "-1";
        },
        handitname: (pl: Player) => pl.getHand().name || "air",
        biome: (pl: Player) => {
            const b = pl.getBiomeName();
            return biome_zh_CN[b] || b;
        },
        entity: () => mc.getAllEntities().filter((i) => !i.isPlayer).length,
    };

    configFile.load();
    onEvent.regEvent();
    mc.listen("onServerStarted", () => {
        regCommand();
    });
    setInterval(sidebarCore, config.time);
}

loadPlugin();
