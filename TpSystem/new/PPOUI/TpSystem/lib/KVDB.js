import { _filePath, db } from "./cache.js";

const jsonpath = _filePath + 'json\\';

export default class KVDBTransformation {
    _Home = jsonpath + 'Home.json';
    _Warp = jsonpath + 'Warp.json';
    _Death = jsonpath + 'Death.json';
    _PlayerSeting = jsonpath + 'PlayerSeting.json';
    _MergeRequest = jsonpath + 'MergeRequest.json';

    todb() {
        try {
            db.set('Home', JSON.parse(file.readFrom(this._Home)));
            db.set('Warp', JSON.parse(file.readFrom(this._Warp)));
            db.set('Death', JSON.parse(file.readFrom(this._Death)));
            db.set('PlayerSeting', JSON.parse(file.readFrom(this._PlayerSeting)));
            db.set('MergeRequest', JSON.parse(file.readFrom(this._MergeRequest)));
            return true;
        } catch (e) {
            logger.error(e);
        }
    }

    tojson() {
        try {
            file.writeTo(this._Home, JSON.stringify(db.get('Home'), null, '\t'));
            file.writeTo(this._Warp, JSON.stringify(db.get('Warp'), null, '\t'));
            file.writeTo(this._Death, JSON.stringify(db.get('Death'), null, '\t'));
            file.writeTo(this._PlayerSeting, JSON.stringify(db.get('PlayerSeting'), null, '\t'));
            file.writeTo(this._MergeRequest, JSON.stringify(db.get('MergeRequest'), null, '\t'));
            return true;
        } catch (e) {
            logger.error(e);
        }
    }
}