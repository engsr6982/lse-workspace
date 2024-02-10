// LiteLoader-AIDS automatic generated
/// <reference path="c:\Users\Administrator\Documents\aids/dts/HelperLib-master/src/index.d.ts"/> 

import { boxCore } from "./core.js";

ll.exports(function (xuid, pos, name) {
    return boxCore.addBox(xuid, pos, name);
}, "WirelessBox_addBox");

ll.exports(function (xuid, pos) {
    return boxCore.deleteBox(xuid, pos);
}, "WirelessBox_deleteBox");

ll.exports(function (xuid) {
    return boxCore.getPlayerAllBox(xuid);
}, "WirelessBox_getPlayerAllBox");

ll.exports(function (xuid, pos) {
    return boxCore.getPlayerBox(xuid, pos);
}, "WirelessBox_getPlayerBox");

ll.exports(function (pos) {
    return boxCore.getBoxInPos(pos);
}, "WirelessBox_getBoxInPos");

ll.exports(function (pos) {
    return boxCore.isBoxBound(pos);
}, "WirelessBox_isBoxBound");

