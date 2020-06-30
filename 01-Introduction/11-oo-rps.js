const rlsync = require('readline-sync');

const choices = ["rock", "paper", "scissors"];


function getRnd(array) {
  return array[Math.floor(Math.random() * array.length)];
}


function createPlayer() {
  return {
    move: null
  };
}


function createComputer() {
  let playerObject = createPlayer();

  let computerObject = {
    choose() {
      this.move = getRnd(choices);
    }
  };

  return Object.assign(playerObject, computerObject);
}


function createHuman() {
  let playerObject = createPlayer();

  let humanObject = {
    choose() {
      let choice;
        
      while(true) {
        choice = rlsync.question("Please choose 'rock', 'paper' or 'scissors': \n");
        if (choices.includes(choice)) break;
        console.log("\nSorry, invalid choice.");
      }

      this.move = choice;
    }
  }

  return Object.assign(playerObject, humanObject);
}


function createMove() {
  return {

  };
}


function createRule() {
  return {

  };
}


function compare(move1, move2) {

}


const RPSGame = {
  human: createHuman(),
  computer: createComputer(),

  displayWelcomeMessage() {
    console.log("Welcome to Rock, Paper, Scissors!");
  },

  displayGoodbyeMessage() {
    console.log("Thank you for playing Rock, Paper, Scissors. Goodbye!");
  },

  displayWinner() {
    let humanMove = this.human.move;
    let computerMove = this.computer.move;

    console.log(`You chose: ${humanMove}`);
    console.log(`Computer chose: ${computerMove}`);

    if (humanMove === computerMove) {
      console.log("Tie!");
    } else if ((humanMove === "rock" && computerMove === "scissors") ||
               (humanMove === "paper" && computerMove === "rock") ||
               (humanMove === "scissors" && computerMove === "paper")) {
      console.log("You win!");
    } else {
      console.log("Computer wins!");
    }
  },

  playAgain() {
    return rlsync.question("Play again (y/n)\n").toLowerCase()[0] === "y";
  },

  play() {
    this.displayWelcomeMessage();
    while(true) {
      this.human.choose();
      this.computer.choose();
      this.displayWinner();
      if (!this.playAgain()) break;  
    }

    this.displayGoodbyeMessage();
  },
};

RPSGame.play();