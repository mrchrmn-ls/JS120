function Father () {
  this.age = 68;
}

Father.prototype.tellOldStory = function() {
  console.log("When I was your age...");
};


function Son () {
  Father.call(this);
}

Son.prototype = Object.create(Father.prototype);
Son.prototype.constructor = Son;

Son.prototype.tellNewStory = function() {
    console.log("The other night...");
  };

let marc = new Son();

marc.tellOldStory();
marc.tellNewStory();
console.log(marc);