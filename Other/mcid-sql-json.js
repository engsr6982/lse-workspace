// LiteLoader-AIDS automatic generated
/// <reference path="c:\Users\Administrator\Documents\aids/dts/HelperLib-master/src/index.d.ts"/> 

const FileName = 'mcid-2023-04-14-wp';

const ID = new JsonConfigFile('./plugins/' + FileName + '.json', JSON.stringify({ "id": [] }));

let Anti_shaking = true;

const Category = "";

mc.listen('onUseItemOn', function (player, item, block, side, pos) {
    if (!Anti_shaking) return;
    if (!item.name) return;
    log(item.name);
    if (block.type == 'minecraft:redstone_block') {
        let ID_TMP = ID.get('id');
        const i = ID_TMP.length - 1;
        const fm = mc.newCustomForm();

        if (ID_TMP.length == 0) {
            // 无数据
            fm.setTitle(`§l§a${item.name}`);
            fm.addLabel('');
        } else {
            // 有数据
            if (item.name == ID_TMP[i].name && item.aux == ID_TMP[i].dv && item.type == ID_TMP[i].id) {
                // 判断重复
                fm.setTitle(`§l§c${item.name}`);
                fm.addLabel(`§c"name": ${ID_TMP[i].name}\n"id": ${ID_TMP[i].id}\n"dv": ${ID_TMP[i].dv}\n"type": ${ID_TMP[i].type}\n"path": ${ID_TMP[i].path}\n"img": ${ID_TMP[i].img}`);
            } else {
                fm.setTitle(`§l§a${item.name}`);
                fm.addLabel(`§a"name": ${ID_TMP[i].name}\n"id": ${ID_TMP[i].id}\n"dv": ${ID_TMP[i].dv}\n"type": ${ID_TMP[i].type}\n"path": ${ID_TMP[i].path}\n"img": ${ID_TMP[i].img}`);
            }
        }

        fm.addInput('名称', "String", item.name);
        Anti_shaking = false;
        player.sendForm(fm, (pl, dt) => {
            Anti_shaking = true;
            if (!dt) return;
            if (!dt[1]) return;
            const tmp = {
                "name": dt[1],
                "id": item.type,
                "dv": item.aux,
                "type": Category,
                "path": "todo",
                "img": "todo1"
            }
            ID_TMP.push(tmp);
            if (ID.set('id', ID_TMP)) {
                pl.tell('完成！', 5)
            }
        })
    }
})


/**
 * 此插件方便制作mcid 数据库
 * 高级（偷懒）使用方法
 * 在服务端根目录找到“.\resource_packs\vanilla”文件夹
 * 替换“en_US.lang”为“zh_CN.lang”即可自动补全中文名
 */