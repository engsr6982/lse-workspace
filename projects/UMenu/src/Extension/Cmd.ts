module.exports = {
    name: "runcmd",
    introduce: "玩家执行命令",
    version: [1, 0, 0],
    otherInformation: {
        author: "PPOUI",
    },

    type: "cmd",
    entry: (player: Player, button: ButtonJson) => {
        return player.runcmd(button.run);
    },
};
