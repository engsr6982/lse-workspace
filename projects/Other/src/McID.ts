let className = "";

const dts: {
    name: string;
    type: string;
    id: number;
    aux: number;

    class: string;
    icon: string | null;
}[] = [];

function save() {
    // 根据 dts.id、dts.type、dts.aux 去重
    // 最少保留一个原版物品
    const map = new Map<string, boolean>();
    const newDts: typeof dts = [];
    for (const item of dts) {
        const key = JSON.stringify({ id: item.id, type: item.type, aux: item.aux });
        if (map.has(key)) continue;
        map.set(key, true);
        newDts.push(item);
    }
    dts.length = 0;
    dts.push(...newDts);

    file.writeTo("./MCID.json", JSON.stringify(dts, null, 4));
}

const fd = new Map<string, boolean>();

mc.listen("onUseItemOn", (pl, it, bl) => {
    const { realName } = pl;
    if (fd.get(realName)) return;
    if (bl.type === "minecraft:redstone_block") {
        fd.set(realName, true);
        setTimeout(() => {
            fd.delete(realName);
        }, 250);

        const { name, type, id, aux } = it;
        const fm = mc.newCustomForm();
        fm.addLabel(`name: ${name}\ntype: ${type}\nid: ${id}\naux: ${aux}\nclass: ${className}`);
        fm.addInput("class", "string", className);

        if (pl.isSneaking) {
            pl.getInventory()
                .getAllItems()
                .forEach((im) => {
                    if (im.name === "" || im.type === "") return;
                    const tmp = {
                        name: im.name,
                        type: im.type,
                        id: im.id,
                        aux: im.aux,
                        class: className,
                        // @ts-ignore
                        icon: null,
                    };
                    dts.push(tmp);
                    save();
                    im.setNull();
                    pl.refreshItems();
                    pl.tell(`Added: ${im.name}`);
                    logger.warn(`Added: ${im.name}`);
                });
            pl.refreshItems();
        } else {
            pl.sendForm(fm, (pl, dt) => {
                if (!dt) return;
                if (dt[1] === "") return;
                className = dt[1];
                const tmp = {
                    name: name,
                    type: type,
                    id: id,
                    aux: aux,
                    class: className,
                    // @ts-ignore
                    icon: null,
                };
                if (tmp.name === "") return;
                dts.push(tmp);
                save();
                pl.getHand().setNull();
                pl.refreshItems();
                pl.tell(`Added: ${name}`);
                logger.warn(`Added: ${name}`);
            });
        }
    }
});

// mc.listen("onInventoryChange", (pl) => {
//     const inv = pl.getInventory();
//     const playerAllItem = inv.getAllItems();
//     // 检查玩家背包是否有重复的物品, 有则删除
//     // 此事件只要移动物品就会触发，所以需要遍历所有物品
//     // 清除物品后，再次移动物品，会触发onInventoryChange事件
//     // 清除物品后需要刷新玩家背包，否则显示的物品数量会不正确
//     for (let i = 0; i < playerAllItem.length; i++) {
//         const item = playerAllItem[i];
//         if (item.name === "" || item.isNull()) continue;
//         for (let j = 0; j < playerAllItem.length; j++) {
//             const item2 = playerAllItem[j];
//             if (item.name === "" || item.isNull()) continue;
//             if (i === j) continue;
//             if (item.name === item2.name) {
//                 item2.setNull();
//                 pl.refreshItems();
//                 pl.tell(`Removed: ${item.name}`);
//                 colorLog("green", `Removed: ${item.name}`);
//             }
//         }
//     }
//     pl.refreshItems();
// });
