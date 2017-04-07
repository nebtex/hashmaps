/// <reference types='jest' />
import { ObservableHashMap } from '../ObservableHashMap';
import { autorun, isObservable } from 'mobx';

class TestClassWithHash {
  name:string;
  constructor(name) {
    this.name = name;
  }

  hash() : number {
    var hash = 0, i, chr;
    if (this.name.length === 0) return hash;
    for (i = 0; i < this.name.length; i++) {
      chr   = this.name.charCodeAt(i);
      hash  = ((hash << 5) - hash) + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return Number(hash);
  }
}

describe('ObservableHashMap', () => {
  let hashMap:ObservableHashMap<any, any>;

  beforeEach(() => {
    hashMap = new ObservableHashMap();
  });

  it('should be observable', () => {
    expect(isObservable(hashMap)).toBe(true);
  });

  it('should set/get correctly an item', () => {
    let disposer = autorun(() => {
      switch(hashMap.size){
        case 1:
          expect(hashMap.get({a:1, b:2})).toBe(80);          
        break;
        case 2:
          expect(hashMap.get({a:1, b:2})).toBe(80);        
          expect(hashMap.get({a:1, b:3})).toBe(90);
        break;
        case 3:
          expect(hashMap.get({a:1, b:2})).toBe(80);        
          expect(hashMap.get({a:1, b:3})).toBe(90);
          expect(hashMap.get({a:1, b:5})).toBe(70);
        break
      }
    });
    
    hashMap.set({a:1, b:2}, 80);
    hashMap.set({a:1, b:3}, 90);
    hashMap.set({a:1, b:5}, 70);
  });

  it('should clear its items', () => {
    hashMap.set({a:1, b:2}, 80);
    hashMap.set({a:1, b:3}, 90);
    hashMap.set({a:1, b:5}, 70);

    let counter = 0;
    let disposer = autorun(() => {
      // the first time this runs the hashMap size is equal to 3
      if(counter)
        expect(hashMap.size).toBe(0);
      
      counter++;
    });

    hashMap.clear();
  });

  it('should return a correct value when an item exists or not', () => {
    expect(hashMap.has({a:4})).toBe(false);
    hashMap.set({a:3}, 343);
    expect(hashMap.has({a:3})).toBe(true);
  });

  it('should return all the values as iterable', () => {
    const keys = [
      new TestClassWithHash('testname'), 
      new TestClassWithHash('testname1'), 
      new TestClassWithHash('testname2')
    ];

    const values = [
      {phoneNumber: '333-22-331', email: 'test@gmail.com'},
      {phoneNumber: '333-22-323', email: 'test1@gmail.com'},
      {phoneNumber: '333-22-313', email: 'test2@gmail.com'}
    ];
    
    keys.forEach((key, index) => {
      hashMap.set(key, values[index]);
    });

    const obtainedValues = hashMap.values();
    expect(obtainedValues.next().value).toEqual(values[0]);
    expect(obtainedValues.next().value).toEqual(values[1]);
    expect(obtainedValues.next().value).toEqual(values[2]);
  });

  it('should return all the keys as iterable', () => {
    const keys = [
      new TestClassWithHash('testname'), 
      new TestClassWithHash('testname1'), 
      new TestClassWithHash('testname2')
    ];

    const values = [
      {phoneNumber: '333-22-331', email: 'test@gmail.com'},
      {phoneNumber: '333-22-323', email: 'test1@gmail.com'},
      {phoneNumber: '333-22-313', email: 'test2@gmail.com'}
    ];
    
    keys.forEach((key, index) => {
      hashMap.set(key, values[index]);
    });

    const obtainedValues = hashMap.keys();
    expect(obtainedValues.next().value).toEqual(keys[0]);
    expect(obtainedValues.next().value).toEqual(keys[1]);
    expect(obtainedValues.next().value).toEqual(keys[2]);

  });

  it('should delete an item', () => {
    hashMap.set({a:1, b:2}, 80);
    hashMap.set({a:1, b:3}, 90);
    hashMap.set({a:1, b:5}, 70);

    let counter = 0;
    let disposer = autorun(() => {
      // the first time this runs the hashMap size is equal to 3
      if(counter)
        expect(hashMap.size).toBe(2);
      
      counter++;
    });

    hashMap.delete({a:1, b:5});
  });

  it('should iterate over all items and returns value, key and itself with forEach method', () => {
    const keys = [
      new TestClassWithHash('testname'), 
      new TestClassWithHash('testname1'), 
      new TestClassWithHash('testname2')
    ];

    const values = [
      {phoneNumber: '333-22-331', email: 'test@gmail.com'},
      {phoneNumber: '333-22-323', email: 'test1@gmail.com'},
      {phoneNumber: '333-22-313', email: 'test2@gmail.com'}
    ];
    
    keys.forEach((key, index) => {
      hashMap.set(key, values[index]);
    });
    
    let counter = 0;

    hashMap.forEach((value, key, callBackHashMap) => {
      expect(JSON.stringify(value)).toBe(JSON.stringify(values[counter]));
      expect(key.hash()).toBe(keys[counter].hash());
      expect(hashMap).toBe(callBackHashMap);
      counter++;
    });
    expect(counter).toBe(hashMap.size);
  });

  it('should return all its entries', () => {
    const keys = [
      new TestClassWithHash('testname'), 
      new TestClassWithHash('testname1'), 
      new TestClassWithHash('testname2')
    ];

    const values = [
      {phoneNumber: '333-22-331', email: 'test@gmail.com'},
      {phoneNumber: '333-22-323', email: 'test1@gmail.com'},
      {phoneNumber: '333-22-313', email: 'test2@gmail.com'}
    ];
    
    keys.forEach((key, index) => {
      hashMap.set(key, values[index]);
    });
    
    let counter = 0;

    hashMap.forEach((value, key, callBackHashMap) => {
      expect(JSON.stringify(value)).toBe(JSON.stringify(values[counter]));
      expect(key.hash()).toBe(keys[counter].hash());
      expect(hashMap).toBe(callBackHashMap);
      counter++;
    });
    expect(counter).toBe(hashMap.size);
  });
});