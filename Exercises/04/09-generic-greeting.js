class Cat {
  constructor(name) {
    this.name = name;
  }

  static genericGreeting() {
    console.log("Hello, I'm a cat!");
  }

  personalGreeting() {
    console.log(`Meeow! I am ${this.name}`);
  }
}

let kitty = new Cat("Sophie");
Cat.genericGreeting();
kitty.personalGreeting();