module.exports = {
    name: "b.js",
    entry: main,
};

function main() {
    return true;
}

globalThis.onEvent("formcallback", (f) => {
    // logger.warn(f);
    console.warn(f);
});
