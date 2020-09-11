const towMixin = {
  tow: function() {
    return "I can tow a trailer!";
  }
};

class Truck {}

class Car {}

Object.assign(Truck.prototype, towMixin);

let truck = new Truck();
console.log(truck.tow());