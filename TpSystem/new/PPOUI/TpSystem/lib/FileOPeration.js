// LiteLoader-AIDS automatic generated
/// <reference path="c:\Users\X\Documents\aids/dts/HelperLib-master/src/index.d.ts"/> 

import { _filePath } from '../lib/cache.js';

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

    static async readFile() {
        try {

        } catch (e) {
            throw new Error(e); 
        }
    }

    static async saveFile() {

    }
}