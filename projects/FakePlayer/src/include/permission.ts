import { _filePath } from "../utils/cache.js";
import PermissionGroup from "./Core/Permission.js";
import PermGroup_Form from "./GUI/Form.js";

// 权限值定义
export const _Perm_Object = {
    //! 注意数据结构
    AddingDummies: {
        name: "添加假人",
        value: "add",
    },
    DeleteDummy: {
        name: "删除假人",
        value: "delete",
    },
    EditDummy: {
        name: "编辑假人",
        value: "edit",
    },
    OnlineDummy: {
        name: "上线假人",
        value: "online",
    },
    LaunchAllDummies: {
        name: "上线所有",
        value: "onlineall",
    },
    OfflineDummy: {
        name: "下线假人",
        value: "offonline",
    },
    AllDummiesOffline: {
        name: "下线所有",
        value: "offonlineall",
    },
    DummyTransmission: {
        name: "假人传送",
        value: "tp",
    },
    DummySpeaking: {
        name: "假人说话",
        value: "talkas",
    },
    DummyCommand: {
        name: "假人命令",
        value: "cmd",
    },
    ViewingDummies: {
        name: "查看假人",
        value: "list",
    },
    SimulateOrientation: {
        name: "模拟朝向",
        value: "lookpos",
    },
    SimulatedDamage: {
        name: "模拟破坏",
        value: "block",
    },
    SimulatedAttack: {
        name: "模拟攻击",
        value: "attack",
    },
    SimulateTheUseOfItems: {
        name: "使用物品",
        value: "item",
    },
    CloseSimulationOperation: {
        name: "关闭模拟操作",
        value: "offoperation",
    },
    CloseAllSimulationOperations: {
        name: "关闭所有模拟操作",
        value: "offoperationall",
    },
    DummyBackpack: {
        name: "假人背包",
        value: "bag",
    },
};

/** 权限组实例 */
export const perm = new PermissionGroup(_filePath + "data\\Perm.json", true);

/** 权限组GUI */
export const perm_Form = new PermGroup_Form(`.\\plugins\\PPOUI\\FakePlayer\\lib\\Perm\\GUI\\Lang`);

/** 权限组GUI表单标题 */
export const GUI_Title = "欢迎";
