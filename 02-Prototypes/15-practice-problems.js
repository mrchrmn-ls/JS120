let turk = {
  firstName: 'Christopher',
  lastName: 'Turk',
  occupation: 'Surgeon',
  getDescription() {
      return this.firstName + ' ' + this.lastName + ' is a '
                                  + this.occupation + '.';
  }
};

function logReturnValWithContext(func, context) {
  let returnVal = func.call(context);
  console.log(returnVal);
}

logReturnValWithContext(turk.getDescription, turk);

let turkDescription = turk.getDescription.bind(turk);

function logReturnVal(func) {
  let returnVal = func();
  console.log(returnVal);
}

logReturnVal(turkDescription);

const TESgames = {
  titles: ['Arena', 'Daggerfall', 'Morrowind', 'Oblivion', 'Skyrim'],
  seriesTitle: 'The Elder Scrolls',
  listGames: function() {
    this.titles.forEach(title => {
      console.log(this.seriesTitle + ': ' + title);
    });
  }
};

TESgames.listGames();

let foo = {
  a: 0,
  incrementA: function() {
    let increment = () => {
      this.a += 1;
    };

    increment();
  }
};

foo.incrementA();
foo.incrementA();
foo.incrementA();

console.log(foo.a);

let cat = {
  name: 'Pudding',
  colors: 'black and white',
  identify() {
    let report = function() {
      console.log(`${this.name} is a ${this.colors} cat.`);
    };
    report();
  },
};

cat.identify();
// Expected output: Pudding is black and white.