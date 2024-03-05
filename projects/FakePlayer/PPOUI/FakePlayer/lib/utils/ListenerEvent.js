import { Listener } from "../modules/listenAPI.js";
import { PLUGIN_INFO } from "./cache.js";

// 初始化事件功能
Listener.init(PLUGIN_INFO.Name);

export const onDummySimulationOperation = new Listener("onDummySimulationOperation");

export const onDummyLookPos = new Listener("onDummyLookPos");
