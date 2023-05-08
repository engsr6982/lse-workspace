import { Game_Cache } from "./Cache.js"

// 监听进服
mc.listen('onJoin', (player) => {
    if (Game_Cache.GameStatus) {

    }
});
// 退出事件
mc.listen('onLeft', (player) => {

})
