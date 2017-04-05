/// <reference types='jest' />
import HashMap, { ObjectWithHash } from '../HashMap';

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

  it('should return all the values', () => {
    //@TODO: How to test this?
  });

  it('should delete an item', () => {
    const testObjectWithHash = new TestClassWithHash('testname');
    hashMap.set(testObjectWithHash, {phoneNumber: '333-22-333', email: 'test@gmail.com'});
    hashMap.set(new TestClassWithHash('testname1'), {phoneNumber: '333-12-333', email: 'test@gmail.com'});
    expect(hashMap.size).toBe(2);

    hashMap.delete(testObjectWithHash);
    expect(hashMap.size).toBe(1);
  });
});