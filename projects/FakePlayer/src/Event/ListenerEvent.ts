import { Listener } from "../modules/listenAPI.js";
import { pluginInformation } from "../utils/GlobalVars.js";

Listener.init(pluginInformation.name);

// 假人执行模拟操作
export const onDummySimulationOperation = new Listener("onDummySimulationOperation");

// 假人看向坐标
export const onDummyLookPos = new Listener("onDummyLookPos");

// 上下限
export const onDummyOnline = new Listener("onDummyOnline");
export const onDummyOffline = new Listener("onDummyOffline");
export const onDummyTryRespawn = new Listener("onDummyTryRespawn");
