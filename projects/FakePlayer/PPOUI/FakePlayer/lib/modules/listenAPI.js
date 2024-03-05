//listenAPI - 小鼠同学版权所有 2023.4.7
let eventCatalog = {};
let serverStarted = false;
let tryrereg = [];
/**
 * LSE插件间监听器类
 */
export class Listener {
    /**
     *
     * @param {string} name 事件名
     */
    constructor(name) {
        this.listenerList = [];
        eventCatalog[name] = this;
        //ll.export(this.regListenTest,namespace,name)
    }
    /**
     * 初始化当前插件的所有监听器
     * @param {string} pluginname 本插件的插件名
     */
    static init(pluginname) {
        ll.export(
            (namespace, name) => {
                let obj = eventCatalog[name];
                let newlistener = ll.import(namespace, name);
                let i; //因为for i报错i is not defined
                for (i in obj.listenerList) {
                    if (obj.listenerList[i].namespace == namespace && obj.listenerList[i].name == name) {
                        obj.listenerList.splice(i, 1);
                        break;
                    }
                } //相同名称，导出函数相同
                obj.listenerList.push({
                    callback: newlistener,
                    namespace: namespace,
                    name: name,
                });
                eventCatalog[name] = obj;
                //需要测试
            },
            pluginname,
            "EventListener",
        );
    }
    /**
     * 监听事件
     * @param {string} listenedPluginName 要监听的插件名
     * @param {string} pluginName 当前插件的插件名
     * @param {string} eventname 要监听的事件名
     * @param {function} callback 回调函数，返回一个布尔可作为判断是否要拦截事件
     */
    static on(listenedPluginName, pluginName, eventname, callback) {
        if (!serverStarted && !ll.listPlugins().includes(listenedPluginName)) {
            //logger.warn("监听器注册失败，被监听插件可能未加载完毕，服务器开启后将再次尝试注册")
            tryrereg.push({
                listenedPluginName: listenedPluginName,
                pluginName: pluginName,
                eventname: eventname,
                callback: callback,
            });
            return;
        }
        ll.import(listenedPluginName, "EventListener")(pluginName, eventname);
        ll.export(callback, pluginName, eventname);
    }
    /**
     * 执行监听的插件的回调函数
     * @param {any} arg 回调函数传入的参数，因作者技术有限目前最多支持10个，后面所有变量均可作为可选，如有需要可修改源码此处参数
     * @returns {boolean} 监听此事件的插件是否要拦截此事件（至少一个插件返回了false）
     */
    exec(args, ...args2) {
        //开始执行监听
        let returned = true;
        let i;
        for (i in this.listenerList) {
            if (this.listenerList[i].callback != undefined && ll.hasExported(this.listenerList[i].namespace, this.listenerList[i].name)) {
                if (this.listenerList[i].callback(args, args2) == false) {
                    returned = false;
                }
            }
        }
        return returned;
    }
}
mc.listen("onServerStarted", () => {
    serverStarted = true;
    tryrereg.forEach((currentValue) => {
        if (ll.listPlugins().includes(currentValue.listenedPluginName)) {
            Listener.on(currentValue.listenedPluginName, currentValue.pluginName, currentValue.eventname, currentValue.callback);
        } else {
            logger.error("监听器注册失败，被监听插件未加载");
        }
    });
});
