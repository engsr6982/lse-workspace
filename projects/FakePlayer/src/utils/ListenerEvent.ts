import { Listener } from "../modules/listenAPI.js";
import { pluginInformation } from "./cache.js";

// 初始化事件功能
Listener.init(pluginInformation.name);

export const onDummySimulationOperation = new Listener("onDummySimulationOperation");

export const onDummyLookPos = new Listener("onDummyLookPos");
