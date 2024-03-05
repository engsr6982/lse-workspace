interface _Listen_Item {
    event: string;
    callback: (...args: any) => any;
    id: string;
}

type _Listen_Cache = Array<_Listen_Item>;

export default class VirtualListener {
    constructor() {
        // 用于保存监听信息的数组
        this.listen_event = [];
    }

    listen_event: _Listen_Cache;

    /**
     * 监听事件
     * @param event 事件名
     * @param callback 回调函数
     * @returns 监听器ID  用于取消事件
     */
    listen(event: string, callback: () => any): string {
        // 回调函数必须是一个函数类型
        if (typeof callback !== "function") {
            throw new Error("Callback must be a function.");
        }
        const id = this.RandomID(10);
        // 保存监听信息到数组
        this.listen_event.push({
            event,
            callback,
            id,
        });
        return id;
    }

    /**
     * 触发事件，调用监听器的回调函数，并返回是否发送成功
     * @param event 事件名
     * @param args 事件参数
     * @returns 是否发送成功
     */
    send(event: string, ...args: any): boolean {
        try {
            // 查找匹配的监听器
            const listeners = this.listen_event.filter((listener) => listener.event === event);
            // 如果没有监听器匹配，则发送失败
            if (listeners.length === 0) {
                return false;
            }
            // 遍历监听器，调用回调函数并检查返回值
            for (let i = 0; i < listeners.length; i++) {
                const result = listeners[i].callback(...args);
                // 如果有回调函数返回false，则停止继续调用后续的回调函数
                if (result === false) {
                    return false;
                }
            }
            // 所有回调函数均成功执行，返回true
            return true;
        } catch (e) {
            // 发生异常，发送失败
            return null;
        }
    }

    /**
     * 随机ID
     * @returns ID
     */
    RandomID(num = 16, char = "QWERTYUIOPASDFGHJKLZXCVBNM0192837465") {
        let str = "";
        for (let i = 0; i < num; i++) {
            const index = Math.floor(Math.random() * char.length);
            str += char[index];
        }
        return str;
    }

    /**
     * 删除事件
     * @param {String} id 事件ID
     * @returns {Boolean} 是否删除成功
     */
    delete(id: string): boolean {
        try {
            const index = this.listen_event.findIndex((i) => i.id == id);
            if (index === -1) {
                return false;
            }
            this.listen_event.splice(index, 1);
            return true;
        } catch (e) {
            return false;
        }
    }
}

// Usage:
// const tps = new VirtualListener();

// // 添加事件监听器
// const eveid = tps.listen("add", (data) => {
//     console.log(`Received data: ${data}`);
//     if (data == "Hello, world! (10)") {
//         const deleve = tps.delete(eveid);
//         console.log(`取消事件: ${deleve ? "success" : "fail"}`);
//     }
// });

// // 持续触发事件
// let i = 0;
// setInterval(() => {
//     const success = tps.send("add", `Hello, world! (${i})`);
//     // console.log(`Send event "add" (${i}): ${success ? 'success' : 'fail'}`);
//     i++;
// }, 1000);
