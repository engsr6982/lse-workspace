module.exports = {
    name: "tell",
    introduce: "发送文本扩展",
    version: [1, 0, 0],
    otherInformation: {
        Autor: "PPOUI",
    },

    type: "tell",
    entry: function (player, button) {
        return player.tell(button.run);
    },
};
