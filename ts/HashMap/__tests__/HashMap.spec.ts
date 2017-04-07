/// <reference types='jest' />
import { HashMap, ObjectWithHash } from '../HashMap';

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

describe('HashMap', () => {
  let hashMap:HashMap<any, any>;
  let testObjectWithHash:TestClassWithHash;

  beforeEach(() => {
    hashMap = new HashMap();
  });

  it('should set/get correctly an item', () => {
    const testObjectWithHash = new TestClassWithHash('testname');
    const value = {phoneNumber: '333-22-333', email: 'test@gmail.com'}
    hashMap.set(testObjectWithHash, value);
    expect(hashMap.size).toBe(1);

    const obtainedValue = hashMap.get(testObjectWithHash);
    expect(JSON.stringify(obtainedValue)).toBe(JSON.stringify(value));
  });

  it('should clear its items', () => {
    hashMap.set(new TestClassWithHash('testname'), {phoneNumber: '333-22-331', email: 'test@gmail.com'});
    hashMap.set(new TestClassWithHash('testname1'), {phoneNumber: '333-22-323', email: 'test1@gmail.com'});
    hashMap.set(new TestClassWithHash('testname2'), {phoneNumber: '333-22-313', email: 'test2@gmail.com'});
    expect(hashMap.size).toBe(3);

    hashMap.clear();
    expect(hashMap.size).toBe(0);
  });

  it('should return a correct value when an item exists or not', () => {
    const otherObjectWithHash = new TestClassWithHash('pepe');
    expect(hashMap.has(otherObjectWithHash)).toBe(false);

    const testObjectWithHash = new TestClassWithHash('testname');    
    const value = {phoneNumber: '333-22-333', email: 'test@gmail.com'}
    hashMap.set(testObjectWithHash, value);
    expect(hashMap.has(testObjectWithHash)).toBe(true);
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
    const testObjectWithHash = new TestClassWithHash('testname');
    hashMap.set(testObjectWithHash, {phoneNumber: '333-22-333', email: 'test@gmail.com'});
    hashMap.set(new TestClassWithHash('testname1'), {phoneNumber: '333-12-333', email: 'test@gmail.com'});
    expect(hashMap.size).toBe(2);

    hashMap.delete(testObjectWithHash);
    expect(hashMap.size).toBe(1);
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
    
    const entries = hashMap.entries();
    expect(entries.next().value).toEqual([keys[0], values[0]]);
    expect(entries.next().value).toEqual([keys[1], values[1]]);
    expect(entries.next().value).toEqual([keys[2], values[2]]);
  });

  it('should set an item correctly when key value does not have a hash function', () => {
    const hashMap = new HashMap<any, number>()
    hashMap.set({a:1, b:2}, 80)
    expect(hashMap.get({a:1, b:2})).toBe(80)
  });
});