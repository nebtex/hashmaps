import { HashMap, ObjectWithHash } from './HashMap';
import { Lambda, IObservableArray, IMap, IMapWillChange, observable, ObservableMap, IInterceptor, IMapChange } from 'mobx';
import * as objectHash from 'object-hash';

const ObservableMapMarker = {};

interface IInterceptable<T> {
  intercept(handler: IInterceptor<T>): Lambda;
}

interface IListenable {
  observe(handler: (change: any, oldValue?: any) => void, fireImmediately?: boolean): Lambda;
}

export class ObservableHashMap<K extends ObjectWithHash, V> implements IMap<K, V>, IInterceptable<IMapWillChange<V>>, IListenable {
  $mobx = ObservableMapMarker;
  @observable internalMap: ObservableMap<V>
  @observable keyMap: ObservableMap<K>

  constructor() {
    this.internalMap = observable.map<V>();
    this.keyMap = observable.map<K>();
  }

  entries(){
    const map = new Map<number, [K,V]>();
    let counter = 0;
    this.keyMap.forEach((keyItem, hash) => {
        map.set(counter, [keyItem, this.internalMap.get(hash)]);
        counter++;
    });
    return map.values();
  }

  clear() {
    this.internalMap.clear();
    this.keyMap.clear();
  }

  get size(): number {
    return this.internalMap.size;
  }

  forEach(callbackfn:{(value?:V, index?: K, map?:IMap<K,V>):void}, thisArg?: any){
      this.keyMap.forEach((keyItem, hash) => {
          callbackfn(this.internalMap.get(hash), keyItem, this);
      });
  }

  delete(key:K) {
    if(this.has(key)){
      const hash = key.hash ? key.hash() : objectHash(key);        
      
      this.internalMap.delete(hash);
      this.keyMap.delete(hash);
      return true;
    }
    return false;
  }

  set(key: K, value: V) {
    const hash = key.hash ? key.hash() : objectHash(key);
    this.keyMap.set(hash, key);
    this.internalMap.set(hash, value);
    return this;
  }

  observe(listener: (changes: IMapChange<V>) => any) {
    return (this.internalMap as ObservableMap<V>).observe(listener)
  }

  intercept(handler: IInterceptor<IMapWillChange<V>>) {
    return (this.internalMap as ObservableMap<V>).intercept(handler)
  }

  get(key:K) {
    const hash = key.hash ? key.hash() : objectHash(key);
    return this.internalMap.get(hash);
  }

  values(): IterableIterator<V> {
      return this.internalMap.values() as IterableIterator<V>;
  }

  keys(): IterableIterator<K> {
      return this.keyMap.values() as IterableIterator<K>;
  }

  has(key: K): boolean {
      const hash = key.hash ? key.hash() : objectHash(key);        
      return this.internalMap.has(hash)
  }
}