const rlsync = require('readline-sync');

const WINNING_SCORE = 5;

const MINIMUM_MOVES = 6;

const RECENCY_BIAS = 12;
// this many recent moves are considered

const WEAPONS = {
  r: {
    name: "Rock",
    beats: ["s"]
  },
  p: {
    name: "Paper",
    beats: ["r"]
  },
  s: {
    name: "Scissors",
    beats: ["p"]
  }
};

let weaponNames = Object.values(WEAPONS)
                        .map(weapon => weapon.name);


class Help {
  static joinOr(arr, delimiter = ", ", word = "or ") {
    if (arr.length === 2) {
      return `${arr[0]} ${word} ${arr[1]}`;
    }

    let result = "";
    for (let index = 0; index < arr.length - 1; index += 1) {
      result += arr[index] + delimiter;
    }

    result += word + arr[arr.length - 1];
    return result;
  }

  static getValidAnswer(allowedAnswers) {
    let answer = rlsync.question("> ").trim().toLowerCase();

    while (!allowedAnswers.includes(answer)) {
      console.log(`Please enter ${Help.joinOr(allowedAnswers)}.`);
      answer = rlsync.question("> ").trim().toLowerCase();
    }

    return answer;
  }

  static getRnd(array) {
    return array[Math.floor(Math.random() * array.length)];
  }
}


class Player {
  constructor() {
    this.choice = null;
    this.score = 0;
  }

  incrementScore() {
    this.score += 1;
  }

  resetScore() {
    this.score = 0;
  }
}


class Computer extends Player {
  constructor() {
    super();
    this.name = "Computer";
    this.recencyBias = RECENCY_BIAS;
  }

  weaponsThatBeat(weapon) {
    let beaters = [];
    for (let key in WEAPONS) {
      if (WEAPONS[key].beats.includes(weapon)) {
        beaters.push(key);
      }
    }
    return beaters;
  }

  choose(game) {
    let humanChoices = game.history.humanChoices;
    let length = humanChoices.length;
    let rounds = game.history.rounds;

    if (rounds[rounds.length - 1] === 0) {
      this.choice = Help.getRnd(["p", "p", "p", "r", "s"]);
      // bias towards paper because rock is most common human first move

    } else if (length === 1) {
      this.choice = Help.getRnd(Object.keys(WEAPONS));

    } else if (humanChoices[length - 1] === humanChoices[length - 2] &&
               humanChoices[length - 1] !== humanChoices[length - 3]) {
      this.choice = humanChoices[length - 1];
      // three in a row are statistically unlikely

    } else if (length < MINIMUM_MOVES) {
      this.choice = Help.getRnd(Object.keys(WEAPONS));

    } else {
      let likelyHumanChoice = length < this.recencyBias ?
                    Help.getRnd(humanChoices) :
                    Help.getRnd(humanChoices.slice(length - this.recencyBias));
      this.choice = Help.getRnd(this.weaponsThatBeat(likelyHumanChoice));
    }
  }
}


class Human extends Player {
  constructor() {
    super();
    this.name = "You";
  }

  choose() {
    console.log(`Choose one of ${Help.joinOr(weaponNames).toLowerCase()}`);
    console.log(`by entering ${Help.joinOr(Object.keys(WEAPONS))}.`);

    this.choice = Help.getValidAnswer(Object.keys(WEAPONS));
  }
}


class History {
  constructor() {
    this.humanChoices = [];
    this.computerChoices = [];
    this.winners = [];
    this.rounds = [0];
  }

  updateRound(game) {
    this.humanChoices.push(game.human.choice);
    this.computerChoices.push(game.computer.choice);
    this.winners.push(game.roundWinner ? game.roundWinner.name : "Tie");
    this.rounds[this.rounds.length - 1] += 1;
  }

  updateMatch() {
    this.rounds.push(0);
  }

  printRow(index) {
    console.log(`${WEAPONS[this.humanChoices[index]].name.padEnd(8)} | ` +
                `${WEAPONS[this.computerChoices[index]].name.padEnd(8)} | ` +
                `${this.winners[index]}`);
  }

  display() {
    let counter = 0;

    console.clear();
    console.log("\nMatch 1");
    console.log("YOU      | COMPUTER | WINNER");
    console.log("---------+----------+---------");
    for (let match = 0; match < this.rounds.length - 1; match += 1) {
      for (let round = 0; round < this.rounds[match]; round += 1) {
        this.printRow(counter);
        counter += 1;
      }

      console.log(`\nMatch ${2 + match}`);
      console.log("---------+----------+---------");
    }

    for (let round = 0; round < this.rounds[this.rounds.length - 1]; round += 1) {
      this.printRow(counter);
      counter += 1;
    }
    console.log();
  }

}


class RPSGame  {
  constructor() {
    this.human = new Human();
    this.computer = new Computer();
    this.history = new History();
    this.roundWinner = null;
    this.matchWinner = null;
  }

  displayWelcomeMessage() {
    console.clear();
    console.log(`Welcome to ${Help.joinOr(weaponNames, ", ", "")}!`);
    console.log(`The first to win ${WINNING_SCORE} rounds wins the match!\n`);
  }

  displayScores() {
    console.log(`>>> YOU   ${this.human.score} : ${this.computer.score}   COMPUTER <<<\n`);
  }

  displayChoices() {
    console.clear();
    console.log(`You chose: ${WEAPONS[this.human.choice].name}`);
    console.log(`Computer chose: ${WEAPONS[this.computer.choice].name}\n`);
  }

  displayMatchWinner() {
    console.log("=========================================");
    switch (this.matchWinner.name) {
      case "You":
        console.log("CONGRATULATIONS! You have won this match.");
        break;
      case "Computer":
        console.log("Sorry, the computer has won this match.");
    }
    console.log("=========================================\n");
  }

  displayGoodbyeMessage() {
    console.log(`\nThank you for playing ${Help.joinOr(weaponNames, ", ", "")}. Goodbye!`);
  }

  setRoundWinner() {
    if (this.human.choice === this.computer.choice) {
      this.roundWinner = null;

    } else if (WEAPONS[this.human.choice].beats
                                         .includes(this.computer.choice)) {
      this.roundWinner = this.human;

    } else {
      this.roundWinner = this.computer;
    }
  }

  setMatchWinner() {
    this.matchWinner = this.human.score === WINNING_SCORE ?
                       this.human : this.computer;
  }

  resetMatch() {
    this.human.resetScore();
    this.computer.resetScore();
    this.roundWinner = null;
    this.matchWinner = null;
  }

  playAgain() {
    console.log("Play again (y/n)?");
    return Help.getValidAnswer(["y", "n"]) === "y";
  }

// eslint-disable-next-line max-lines-per-function, max-statements
  play() {
    while (true) {
      this.displayWelcomeMessage();
      this.displayScores();

      while (this.human.score < WINNING_SCORE &&
             this.computer.score < WINNING_SCORE) {

        this.human.choose();
        this.computer.choose(this);
        this.setRoundWinner();

        this.history.updateRound(this);
        this.history.display();

        if (this.roundWinner) this.roundWinner.incrementScore();
        this.displayScores();
      }

      this.history.updateMatch();

      this.setMatchWinner();
      this.displayMatchWinner();

      this.resetMatch();

      if (!this.playAgain()) break;
    }

    this.displayGoodbyeMessage();
  }
}


let game = new RPSGame();
game.play();