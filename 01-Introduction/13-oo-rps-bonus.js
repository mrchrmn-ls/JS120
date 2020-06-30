const WINNING_SCORE = 5;


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


const rlsync = require('readline-sync');


const Help = {
  joinOr(arr, delimiter = ", ", word = "or ") {
    if (arr.length === 2) {
      return `${arr[0]} ${word} ${arr[1]}`;
    }

    let result = "";
    for (let index = 0; index < arr.length - 1; index += 1) {
      result += arr[index] + delimiter;
    }

    result += word + arr[arr.length - 1];
    return result;
  },

  getValidAnswer(allowedAnswers) {
    let answer = rlsync.question("> ").trim().toLowerCase();

    while (!allowedAnswers.includes(answer)) {
      console.log(`Please enter ${Help.joinOr(allowedAnswers)}.`);
      answer = rlsync.question("> ").trim().toLowerCase();
    }

    return answer;
  },

  getRnd(array) {
    return array[Math.floor(Math.random() * array.length)];
  },

  weaponsThatBeat(weapon) {
    let beaters = [];
    for (let key in WEAPONS) {
      if (WEAPONS[key].beats.includes(weapon)) {
        beaters.push(key);
      }
    }
    return beaters;
  }
};


const Create = {
  player() {
    return {
      choice: null,
      score: 0,

      incrementScore() {
        this.score += 1;
      },

      resetScore() {
        this.score = 0;
      }
    };
  },

// eslint-disable-next-line max-lines-per-function, max-statements
  computer() {
    let playerObject = this.player();

    let computerObject = {
      name: "Computer",
      recencyBias: 10,
      // how many previous human moves to take into account

      choose(game) {
        let humanChoices = game.history.humanChoices;
        let length = humanChoices.length;
        let rounds = game.history.rounds;

        if (rounds[rounds.length - 1] === 0) {
          this.choice = Help.getRnd(["p", "p", "p", "r", "s"]);
          // bias towards paper for first move

        } else if (length === 1) {
          this.choice = Help.getRnd(Object.keys(WEAPONS));
          // random choice for second move

        } else if (humanChoices[length - 1] === humanChoices[length - 2] &&
                   humanChoices[length - 1] !== humanChoices[length - 3]) {
          this.choice = humanChoices[length - 1];
          // three in a row are statistically unlikely

        } else if (length < 6) {
          this.choice = Help.getRnd(Object.keys(WEAPONS));
          // random choice until enough moves in history

        } else {
          let likelyHumanChoice = length < this.recencyBias ?
                                  Help.getRnd(humanChoices) :
                                  Help.getRnd(humanChoices.slice(length - this.recencyBias));
          this.choice = Help.getRnd(Help.weaponsThatBeat(likelyHumanChoice));
          // computer favours weapons that beat human's more common choice.
        }
      }
    };
    return Object.assign(playerObject, computerObject);
  },

  human() {
    let playerObject = this.player();

    let humanObject = {
      name: "You",

      choose() {
        console.log(`Choose one of ${Help.joinOr(weaponNames).toLowerCase()}`);
        console.log(`by entering ${Help.joinOr(Object.keys(WEAPONS))}.`);

        this.choice = Help.getValidAnswer(Object.keys(WEAPONS));
      }
    };
    return Object.assign(playerObject, humanObject);
  },

// eslint-disable-next-line max-lines-per-function, max-statements
  history() {
    return {
      humanChoices: [],
      computerChoices: [],
      winners: [],
      rounds: [0],

      updateRound(game) {
        this.humanChoices.push(game.human.choice);
        this.computerChoices.push(game.computer.choice);
        this.winners.push(game.roundWinner ? game.roundWinner.name : "Tie");
        this.rounds[this.rounds.length - 1] += 1;
      },

      updateMatch() {
        this.rounds.push(0);
      },

// eslint-disable-next-line max-lines-per-function, max-statements
      display() {
        let counter = 0;
        console.clear();
        console.log("\nMatch 1");
        console.log("YOU      | COMPUTER | WINNER");
        console.log("---------+----------+---------");
        for (let match = 0; match < this.rounds.length - 1; match += 1) {
          for (let round = 0; round < this.rounds[match]; round += 1) {
            console.log(`${WEAPONS[this.humanChoices[counter]].name.padEnd(8)} | ` +
            `${WEAPONS[this.computerChoices[counter]].name.padEnd(8)} | ` +
            `${this.winners[counter]}`);
            counter += 1;
          }

          console.log(`\nMatch ${2 + match}`);
          console.log("---------+----------+---------");
        }

        for (let round = 0; round < this.rounds[this.rounds.length - 1]; round += 1) {
          console.log(`${WEAPONS[this.humanChoices[counter]].name.padEnd(8)} | ` +
                      `${WEAPONS[this.computerChoices[counter]].name.padEnd(8)} | ` +
                      `${this.winners[counter]}`);
          counter += 1;
        }
        console.log();
      }
    };
  }
};


const RPSGame = {
  human: Create.human(),
  computer: Create.computer(),
  history: Create.history(),
  roundWinner: null,
  matchWinner: null,

  displayWelcomeMessage() {
    console.clear();
    console.log(`Welcome to ${Help.joinOr(weaponNames, ", ", "")}!`);
    console.log(`The first to win ${WINNING_SCORE} rounds wins the match!\n`);
  },

  displayScores() {
    console.log(`>>> YOU   ${this.human.score} : ${this.computer.score}   COMPUTER <<<\n`);
  },

  displayChoices() {
    console.clear();
    console.log(`You chose: ${WEAPONS[this.human.choice].name}`);
    console.log(`Computer chose: ${WEAPONS[this.computer.choice].name}\n`);
  },

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
  },

  displayGoodbyeMessage() {
    console.log(`\nThank you for playing ${Help.joinOr(weaponNames, ", ", "")}. Goodbye!`);
  },

  setRoundWinner() {
    if (this.human.choice === this.computer.choice) {
      this.roundWinner = null;

    } else if (WEAPONS[this.human.choice].beats
                                         .includes(this.computer.choice)) {
      this.roundWinner = this.human;

    } else {
      this.roundWinner = this.computer;
    }
  },

  setMatchWinner() {
    this.matchWinner = this.human.score === WINNING_SCORE ?
                       this.human : this.computer;
  },

  resetMatch() {
    this.human.resetScore();
    this.computer.resetScore();
    this.roundWinner = null;
    this.matchWinner = null;
  },

  playAgain() {
    console.log("Play again (y/n)?");
    return Help.getValidAnswer(["y", "n"]) === "y";
  },

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
  },
};


RPSGame.play();