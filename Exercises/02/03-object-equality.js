function objectsEqual(objA, objB) {
  if (Object.keys(objA).length !== Object.keys(objB).length) return false;

  for (let key in objA) {
    if (!objB.hasOwnProperty(key)) return false;

    if (objA[key] !== objB[key]) return false;
  }

  return true;
}

console.log(objectsEqual({a: 'foo'}, {a: 'foo'}));                      // true
console.log(objectsEqual({a: 'foo', b: 'bar'}, {a: 'foo'}));            // false
console.log(objectsEqual({}, {}));                                      // true
console.log(objectsEqual({a: 'foo', b: undefined}, {a: 'foo', c: 1}));  // false