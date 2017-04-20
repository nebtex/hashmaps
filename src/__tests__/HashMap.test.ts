import { HashMap, ObjectWithHash } from '../HashMap';
import test from 'ava';

class TestClassWithHash {
  name:string;
  constructor(name:string) {
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

let hashMap:HashMap<any, any>;
let testObjectWithHash:TestClassWithHash;

test.beforeEach(t => {
  hashMap = new HashMap();
});

test('set/get correctly an item', t => {
    const testObjectWithHash = new TestClassWithHash('testname');
    const value = {phoneNumber: '333-22-333', email: 'test@gmail.com'}
    hashMap.set(testObjectWithHash, value);
    t.is(hashMap.size, 1);

    const obtainedValue = hashMap.get(testObjectWithHash);
    t.is(JSON.stringify(obtainedValue), JSON.stringify(value));
});

test('clear its items', t => {
    hashMap.set(new TestClassWithHash('testname'), {phoneNumber: '333-22-331', email: 'test@gmail.com'});
    hashMap.set(new TestClassWithHash('testname1'), {phoneNumber: '333-22-323', email: 'test1@gmail.com'});
    hashMap.set(new TestClassWithHash('testname2'), {phoneNumber: '333-22-313', email: 'test2@gmail.com'});
    t.is(hashMap.size, 3);

    hashMap.clear();
    t.is(hashMap.size, 0);
});

test('return a correct value when an item exists or not', t => {
    const otherObjectWithHash = new TestClassWithHash('pepe');
    t.is(hashMap.has(otherObjectWithHash), false);

    const testObjectWithHash = new TestClassWithHash('testname');    
    const value = {phoneNumber: '333-22-333', email: 'test@gmail.com'}
    hashMap.set(testObjectWithHash, value);
    t.is(hashMap.has(testObjectWithHash), true);
});

test('return all the values as iterable', t => {
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
    t.is(obtainedValues.next().value, values[0]);
    t.is(obtainedValues.next().value, values[1]);
    t.is(obtainedValues.next().value, values[2]);
});

test('return all the keys as iterable', t => {
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
    t.is(obtainedValues.next().value, keys[0]);
    t.is(obtainedValues.next().value, keys[1]);
    t.is(obtainedValues.next().value, keys[2]);
});

test('delete an item', t => {
  const testObjectWithHash = new TestClassWithHash('testname');
  hashMap.set(testObjectWithHash, {phoneNumber: '333-22-333', email: 'test@gmail.com'});
  hashMap.set(new TestClassWithHash('testname1'), {phoneNumber: '333-12-333', email: 'test@gmail.com'});
  t.is(hashMap.size, 2);

  hashMap.delete(testObjectWithHash);
  t.is(hashMap.size, 1);
});

test('iterate over all items and returns value, key and itself with forEach method', t => {
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
    t.is(JSON.stringify(value), JSON.stringify(values[counter]));
    t.is(key.hash(), keys[counter].hash());
    t.is(hashMap, callBackHashMap);
    counter++;
  });
  t.is(counter, hashMap.size);
});

test('return all its entries', t => {
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
  t.is(JSON.stringify(entries.next().value), JSON.stringify([keys[0], values[0]]));
  t.is(JSON.stringify(entries.next().value), JSON.stringify([keys[1], values[1]]));
  t.is(JSON.stringify(entries.next().value), JSON.stringify([keys[2], values[2]]));
});

test('set an item correctly when key value does not have a hash function', t => {
  const hashMap = new HashMap<any, number>()
  hashMap.set({a:1, b:2}, 80)
  t.is(hashMap.get({a:1, b:2}), 80);
});

test('hash function should return the correct value', t => {
  t.is(hashMap.hash([1,2,3]), '1/2/3');
  t.is(hashMap.hash([15,24,1]), '15/24/1');
  t.is(hashMap.hash([1,12,124]), '1/12/124');
});