import * as objectHash from 'object-hash';
import { ObservableMap } from 'mobx';

export interface ObjectWithHash {
    hash?: {():string}
}

export class HashMap<K extends ObjectWithHash, V> {
    protected internalMap: Map<string, V>;
    protected keyMap: Map<string, K>;

    constructor() {
        this.internalMap = new Map<string, V>();
        this.keyMap = new Map<string, K>();
    }

    set(key: K, value: V) {
        const hash = key.hash ? key.hash() : objectHash(key);
        this.internalMap.set(hash, value);
        this.keyMap.set(hash, key);
        return this;
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
        return this.internalMap.values();
    }

    keys(): IterableIterator<K> {
        return this.keyMap.values();
    }

    delete(key: K) {
        const hash = key.hash ? key.hash() : objectHash(key);        
        this.internalMap.delete(hash);
        return this.keyMap.delete(hash);
    }

    forEach(callBack:{(value?:V, key?: K, hashMap?:HashMap<K,V>):void}){
        this.keyMap.forEach((keyItem, hash) => {
            callBack(this.internalMap.get(hash), keyItem, this);
        });
    }
}