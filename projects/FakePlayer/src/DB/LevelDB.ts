import { _filePath } from "../utils/config.js";

const KVDB_Path = _filePath + "data\\KVDB_Bag";

export const levelDB = new KVDatabase(KVDB_Path);
