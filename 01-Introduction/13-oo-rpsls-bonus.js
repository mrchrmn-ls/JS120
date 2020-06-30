const WINNING_SCORE = 5;

const WEAPONS = {
  r: {
    name: "Rock",
    beats: ["ss", "l"]
  },
  p: {
    name: "Paper",
    beats: ["r", "s"]
  },
  ss: {
    name: "Scissors",
    beats: ["p", "l"]
  },
  l: {
    name: "Lizard",
    beats: ["s", "p"]
  },
  s: {
    name: "Spock",
    beats: ["r", "ss"]
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


const Display = {
  welcomeMessage() {
    console.clear();
    console.log(`Welcome to ${Help.joinOr(weaponNames, ", ", "")}!`);
    console.log(`The first to win ${WINNING_SCORE} rounds wins the match!`);
  },

  promptToChoose() {
    console.log();
    console.log(`Choose one of ${Help.joinOr(weaponNames).toLowerCase()}`);
    console.log(`by entering ${Help.joinOr(Object.keys(WEAPONS))}.`);
  },

  scores(game) {
    console.log();
    console.log(`>>> PLAYER   ${game.human.score} : ${game.computer.score}   COMPUTER <<<`);
  },

  choices(game) {
    console.clear();
    console.log(`You chose: ${WEAPONS[game.human.choice].name}`);
    console.log(`Computer chose: ${WEAPONS[game.computer.choice].name}`);
  },

  roundWinner(game) {
    console.log();

    if (!game.roundWinner) {
      console.log("It's a tie.\n");
      return;
    }

    switch (game.roundWinner.name) {
      case "human":
        console.log(`${WEAPONS[game.human.choice].name} beats ${WEAPONS[game.computer.choice].name}!`);
        console.log("You win this round.");
        break;
      case "computer":
        console.log(`${WEAPONS[game.computer.choice].name} beats ${WEAPONS[game.human.choice].name}!`);
        console.log("The computer wins this round.");
    }
  },

  matchWinner(winner) {
    console.log();
    switch (winner.name) {
      case "human":
        console.log("CONGRATULATIONS! You have won this match.");
        break;
      case "computer":
        console.log("Sorry, the computer has won this match.");
    }
  },

  goodbyeMessage() {
    console.log("Thank you for playing Rock, Paper, Scissors. Goodbye!");
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
      name: "computer",

      choose(history) {
        let likelyHumanChoice;

        if (history.choices.length === 0) {
          this.choice = Help.getRnd(["p", "p", "p", "r", "s"]);
        } else if (history.choices.length === 1) {
          this.choice = Help.getRnd(Object.keys(WEAPONS));
        } else if (history.choices[0] === history.choices[1]) {
          this.choice = history.choices[0];
        } else {
          likelyHumanChoice = Help.getRnd(history.choices);
          this.choice = Help.getRnd(Help.weaponsThatBeat(likelyHumanChoice));
        }
      }
    };
    return Object.assign(playerObject, computerObject);
  },

  human() {
    let playerObject = this.player();

    let humanObject = {
      name: "human",

      choose() {
        Display.promptToChoose();

        this.choice = Help.getValidAnswer(Object.keys(WEAPONS));
      }
    };
    return Object.assign(playerObject, humanObject);
  },

  history() {
    return {
      choices: [],

      update(choice) {
        this.choices.unshift(choice);
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
    if (this.human.score === WINNING_SCORE) {
      this.matchWinner = this.human;
    } else {
      this.matchWinner = this.computer;
    }
  },

  resetMatch() {
    this.human.resetScore();
    this.computer.resetScore();
    this.roundWinner = null;
    this.matchWinner = null;
  },

  playAgain() {
    console.log();
    console.log("Play again (y/n)?");
    return Help.getValidAnswer(["y", "n"]) === "y";
  },

// eslint-disable-next-line max-lines-per-function, max-statements
  play() {
    while (true) {
      Display.welcomeMessage();

      while (this.human.score < WINNING_SCORE &&
             this.computer.score < WINNING_SCORE) {

        Display.scores(this);

        this.human.choose();
        this.computer.choose(this.history);
        console.log(this.computer.choice);
        Display.choices(this);

        this.setRoundWinner();
        Display.roundWinner(this);

        if (this.roundWinner) this.roundWinner.incrementScore();
        this.history.update(this.human.choice);
      }

      Display.scores(this);

      this.setMatchWinner();
      Display.matchWinner(this.matchWinner);

      this.resetMatch();

      if (!this.playAgain()) break;
    }

    Display.goodbyeMessage();
  },
};


RPSGame.play();