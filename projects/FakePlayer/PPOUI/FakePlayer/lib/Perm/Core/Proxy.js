import { _Perm_Object } from "../index.js";

/**
 * @author engsr6982
 */
export class proxyObject {
    static keys() {
        return Object.keys(_Perm_Object);
    }
    static values() {
        return Object.values(_Perm_Object).map(({ value }) => value);
    }
    static names() {
        return Object.values(_Perm_Object).map(({ name }) => name);
    }

    static keyToObject(key) {
        const perm = _Perm_Object[key];
        return {
            name: perm.name,
            value: perm.value,
            key: key,
        };
    }

    static nameToObject(name) {
        const key = Object.keys(_Perm_Object).find((key) => _Perm_Object[key].name === name);
        if (key) {
            return {
                name: _Perm_Object[key].name,
                value: _Perm_Object[key].value,
                key: key,
            };
        }
    }

    static valueToObject(value) {
        const key = Object.keys(_Perm_Object).find((key) => _Perm_Object[key].value === value);
        if (key) {
            return {
                name: _Perm_Object[key].name,
                value: _Perm_Object[key].value,
                key: key,
            };
        }
    }
}
