module.exports = {
    name: "console_Cmd",
    introduce: "cmd执行后台命令",
    version: [1, 0, 0],
    otherInformation: {
        Author: "PPOUI",
    },

    type: "consolecmd",
    entry: function (player, button) {
        return mc.runcmd(button.run);
    },
};
