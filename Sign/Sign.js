// LiteLoader-AIDS automatic generated
/// <reference path="c:\Users\Administrator\Documents\aids/dts/HelperLib-master/src/index.d.ts"/> 

logger.setLogLevel(5);

mc.listen("onUseItemOn", (pl, it, block, side, pos) => {
    logger.debug(pl, it, block, side, pos);
    // 获取方块实体数据
    const entity = block.getBlockEntity();
    // 获取实体NBT
    const nbt = entity.getNbt();
    logger.debug(nbt.toString(4))
    // 获取文本信息
    const text_nbt = nbt.getTag("FrontText");
    // "FrontText": {
    //     "IgnoreLighting": 0,                 //是否被荧光墨囊染色
    //     "PersistFormatting": 1,              //未知
    //     "SignTextColor": -16777216,          //告示牌文本使用的颜色
    //     "Text": "你好\n星期六\n老刘\n草泥马"   //文本内容
    //     "TextOwner": "2535450953541983"      //写下告示牌文本的玩家的XUID
    // }
    // 转为Object
    const text = text_nbt.toObject();
})

