import { _filePath } from "./cache.js";

const KVDB_Path = _filePath + "data\\KVDB_Bag";

export const kvdb = new KVDatabase(KVDB_Path);
