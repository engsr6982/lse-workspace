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
    // 根据dts.name名称去重

    const nameMap = new Map<string, boolean>();
    const newDts: typeof dts = [];
    for (const item of dts) {
        if (nameMap.has(item.name)) continue;
        nameMap.set(item.name, true);
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
            dts.push(tmp);
            save();
            pl.tell(`Added: ${name}`);
        });
    }
});
