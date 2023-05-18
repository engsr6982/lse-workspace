// LiteLoader-AIDS automatic generated
/// <reference path="c:\Users\Administrator\Documents\aids/dts/HelperLib-master/src/index.d.ts"/> 

import {
    _filePath, __init,
    Config, Home, Warp, Death, PlayerSeting, MergeRequest, MainUI
} from '../lib/cache.js';

const filePath = _filePath + 'data\\';

export class FileOperation {
    // 配置文路径
    static _Config = filePath + 'Config.json';
    static _Home = filePath + 'Home.json';
    static _Warp = filePath + 'Warp.json';
    static _Death = filePath + 'Death.json';
    static _PlayerSeting = filePath + 'PlayerSeting.json';
    static _MergeRequest = filePath + 'MergeRequest.json';
    static _MainUI = _filePath + 'GUI\\MainUI.json';

    /**检查文件 */
    static async auditFile() {
        if (!file.exists(this._Config)) file.writeTo(this._Config, JSON.stringify(__init.Config, null, '\t'));
        if (!file.exists(this._Home)) file.writeTo(this._Home, '{}');
        if (!file.exists(this._Warp)) file.writeTo(this._Warp, '[]');
        if (!file.exists(this._Death)) file.writeTo(this._Death, '{}');
        if (!file.exists(this._PlayerSeting)) file.writeTo(this._PlayerSeting, '{}');
        if (!file.exists(this._MergeRequest)) file.writeTo(this._MergeRequest, '[]');
        if (!file.exists(this._MainUI)) file.writeTo(this._MainUI, JSON.stringify(__init.MainUI, null, '\t'));
    }

    /**读取文件 */
    static async readFile() {
        try {
            this.auditFile();
            Config = JSON.parse(file.readFrom(this._Config));
            Home = JSON.parse(file.readFrom(this._Home));
            Warp = JSON.parse(file.readFrom(this._Warp));
            Death = JSON.parse(file.readFrom(this._Death));
            PlayerSeting = JSON.parse(file.readFrom(this._PlayerSeting));
            MergeRequest = JSON.parse(file.readFrom(this._MergeRequest));
            MainUI = JSON.parse(file.readFrom(this._MainUI));
        } catch (e) {
            throw new Error(e);
        }
    }

    /**保存文件 */
    static async saveFile() {
        try {
            file.writeTo(this._Config, JSON.stringify(Config, null, '\t'));
            file.writeTo(this._Home, JSON.stringify(Home, null, '\t'));
            file.writeTo(this._Warp, JSON.stringify(Warp, null, '\t'));
            file.writeTo(this._Death, JSON.stringify(Death, null, '\t'));
            file.writeTo(this._PlayerSeting, JSON.stringify(PlayerSeting, null, '\t'));
            file.writeTo(this._MergeRequest, JSON.stringify(MergeRequest, null, '\t'));
            file.writeTo(this._MainUI, JSON.stringify(MainUI, null, '\t'));
            this.readFile();
        } catch (e) {
            throw new Error(e);
        }
    }
}