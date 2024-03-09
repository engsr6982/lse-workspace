import { _filePath } from "../../utils/cache.js";

const KVDB_Path = _filePath + "data\\KVDB_Bag";

export const kvdb = new KVDatabase(KVDB_Path);
