module.exports = {
    name: "subform",
    introduce: "子表单扩展",
    version: [1, 0, 0],
    otherInformation: {
        Author: "PPOUI",
    },

    type: "subform",
    entry: function (player, button) {
        globalThis.UMenuApi.UMenu.main(player, button.run);
    },
};
