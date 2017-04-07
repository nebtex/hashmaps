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
  @observable keys: IObservableArray<K>
  @observable keyMap: ObservableMap<K>

  constructor() {
    this.internalMap = observable.map<V>() as ObservableMap<V>;
  }

  entries(){

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