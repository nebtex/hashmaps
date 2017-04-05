import * as objectHash from 'object-hash';

export interface ObjectWithHash {
    hash?: {():string}
}

export default class HashMap<K extends ObjectWithHash, V> {
    private internalMap: Map<string, V>;
    private keyMap: Map<string, K>;

    constructor() {
        this.internalMap = new Map<string, V>();
        this.keyMap = new Map<string, K>();
    }

    set(key: K, value: V) {
        const hash = key.hash ? key.hash() : objectHash(key);
        this.internalMap.set(hash, value);
        this.keyMap.set(hash, key);
    }

    get(key: K): V {
        const hash = key.hash ? key.hash() : objectHash(key);
        return this.internalMap.get(hash);
    }

    clear() {
        this.internalMap.clear();
        this.keyMap.clear();
    }

    has(key: K): boolean {
        const hash = key.hash ? key.hash() : objectHash(key);        
        return this.internalMap.has(hash)
    }

    get size(): number {
        return this.internalMap.size;
    }

    entries(): IterableIterator<[K, V]> {
        const map = new Map<number, [K,V]>();
        let counter = 0;
        this.keyMap.forEach((keyItem, hash) => {
            map.set(counter, [keyItem, this.internalMap.get(hash)]);
            counter++;
        });
        return map.values();
    }

    values(): IterableIterator<V> {
        return this.internalMap.values()
    }

    delete(key: K) {
        const hash = key.hash ? key.hash() : objectHash(key);        
        this.internalMap.delete(hash);
        this.keyMap.delete(hash);
    }

    forEach(callBack:{(value?:V, key?: K, hashMap?:HashMap<K,V>):void}){
        this.keyMap.forEach((keyItem, hash) => {
            callBack(this.internalMap.get(hash), keyItem, this);
        });
    }
}