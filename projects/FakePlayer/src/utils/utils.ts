import { dummyExample } from "../FPManager/example.js";

export function pos2Object(pos: IntPos | FloatPos) {
    return {
        x: pos.x,
        y: pos.y,
        z: pos.z,
        dim: pos.dim,
        dimid: pos.dimid,
    };
}

export function parsePos(obj: { x: number; y: number; z: number; dimid: number }) {
    return new FloatPos(obj.x, obj.y, obj.z, obj.dimid);
}

export function stringifyExample(example: dummyExample) {
    const pos = pos2Object(example.onlinePos);
    const json = JSON.parse(JSON.stringify(example));
    json["onlinePos"] = pos;
    return json;
}
