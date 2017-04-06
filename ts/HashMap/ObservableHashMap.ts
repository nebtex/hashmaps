import { HashMap, ObjectWithHash } from './HashMap';
import { IInterceptable, IMapWillChange, observable, ObservableMap, IInterceptor, IMapChange, IListenable } from 'mobx';
import * as objectHash from 'object-hash';

const ObservableMapMarker = {};

export class ObservableHashMap<K extends ObjectWithHash, V> extends HashMap<K, V> implements IInterceptable<IMapWillChange<V>>, IListenable{
  $mobx = ObservableMapMarker;
  interceptors:any = null;
  changeListeners:any = null;

  constructor() {
    super()
    this.internalMap = observable.map<V>() as ObservableMap<V>;
  }

  set(key: K, value: V) {
    const hash = key.hash ? key.hash() : objectHash(key);
    this.keyMap.set(hash, key);
    return this.internalMap.set(hash, value);
  }

  observe(listener: (changes: IMapChange<V>) => any) {
    return (this.internalMap as ObservableMap<V>).observe(listener) 
  }

  intercept(handler: IInterceptor<IMapWillChange<V>>) {
    return (this.internalMap as ObservableMap<V>).intercept(handler)
  }
}