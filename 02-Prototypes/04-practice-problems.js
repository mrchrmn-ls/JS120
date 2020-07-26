function assignProperty(obj, key, val) {
  if (obj.hasOwnProperty(key)) {
    obj[key] = val;
  } else if (Object.getPrototypeOf(obj) !== Object.prototype) {
    assignProperty(Object.getPrototypeOf(obj), key, val);
  } else {
    return undefined;
  }
}

let fooA = { bar: 1 };
let fooB = Object.create(fooA);
let fooC = Object.create(fooB);

assignProperty(fooC, "bar", 2);
console.log(fooA.bar); // 2
console.log(fooC.bar); // 2

assignProperty(fooC, "qux", 3);
console.log(fooA.qux); // undefined
console.log(fooC.qux); // undefined
console.log(fooA.hasOwnProperty("qux")); // false
console.log(fooC.hasOwnProperty("qux")); // false

const testObject = {
  check: function () {
    console.log(this);
  }
};

testObject.check();

function logContext() {
  console.log("My context is this: " + this);
}

logContext();

function nestedFunction() {
  logContext();
}

nestedFunction();

logContext.call(testObject);