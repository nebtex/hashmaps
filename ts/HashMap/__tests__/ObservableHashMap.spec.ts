/// <reference types='jest' />
import { ObservableHashMap } from '../ObservableHashMap';
import { autorun, observable, isObservable } from 'mobx'

describe('ObservableHashMap', () => {
  let hashMap:ObservableHashMap<any, any>;

  beforeEach(() => {
    hashMap = new ObservableHashMap();
  });

  it('should be observable', () => {
    expect(isObservable(hashMap)).toBe(true);
  });

  it('should set/get correctly an item', () => {
    let disposer = autorun(() => console.log(hashMap.entries()));
    
    hashMap.set({a:1, b:2}, 80);
    hashMap.set({a:1, b:3}, 80);
    hashMap.set({a:1, b:5}, 80);
  });
});