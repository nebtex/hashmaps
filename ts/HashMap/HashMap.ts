export interface ObjectWithHash {
    hash(): string
}

export default class HashMap<K extends ObjectWithHash, V> {
    private internalMap: Map<string, V>;
    private keyMap: Map<string, K>;

    constructor() {
        this.internalMap = new Map<string, V>();
        this.keyMap = new Map<string, K>();
    }

    set(key: K, value: V) {
        this.internalMap.set(key.hash(), value);
        this.keyMap.set(key.hash(), key);
    }

    get(key: K): V {
        return this.internalMap.get(key.hash());
    }

    clear() {
        this.internalMap.clear();
        this.keyMap.clear();
    }

    has(key: K): boolean {
        return this.internalMap.has(key.hash())
    }

    get size(): number {
        return this.internalMap.size;
    }

    values(): IterableIterator<V> {
        return this.internalMap.values()
    }

    delete(key: K) {
        this.internalMap.delete(key.hash());
        this.keyMap.delete(key.hash());
    }

    forEach(callBack:{(value?:V, key?: K, hashMap?:HashMap<K,V>):void}){
        this.keyMap.forEach((keyItem, hash) => {
            callBack(this.internalMap.get(hash), keyItem, this);
        });
    }
}