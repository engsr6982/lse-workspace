export function posToObject(pos) {
    return {
        x: pos.x,
        y: pos.y,
        z: pos.z,
        dim: pos.dim,
        dimid: pos.dimid,
    };
}

export function parsePos(obj) {
    logger.debug(obj);
    return new FloatPos(obj.x, obj.y, obj.z, obj.dimid);
}

export function stringifyExample(example) {
    const pos = posToObject(example.OnlinePos);
    const json = JSON.parse(JSON.stringify(example));
    json["OnlinePos"] = pos;
    return json;
}
