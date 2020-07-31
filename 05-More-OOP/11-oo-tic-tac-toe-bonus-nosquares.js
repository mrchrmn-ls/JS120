const rlsync = require("readline-sync");


// -----------------------------------
class Help {
  static joinOr(arr, delimiter = ", ", word = "or ") {
    if (arr.length === 2) {
      return `${arr[0]} ${word}${arr[1]}`;
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


// -----------------------------------
class Board {
  static EMPTY_SQUARE_SYMBOL = " ";
  static SIZE = 9;
  static CENTRE_SQUARE = "5";
  static WINNING_SQUARES = [
    [1, 2, 3], [4, 5, 6], [7, 8, 9], // rows
    [1, 4, 7], [2, 5, 8], [3, 6, 9], // columns
    [1, 5, 9], [3, 5, 7]             // diagonals
  ];

  constructor(layout) {
    this.layout = layout;
    this.squares = {};
    for (let number = 1; number <= Board.SIZE; number += 1) {
      this.squares[number] = Board.EMPTY_SQUARE_SYMBOL;
    }
  }

  // eslint-disable-next-line max-lines-per-function, max-statements
  display() {
    let self = this;

    function displayNumber(number) {
      if (self.squareIsEmpty(number)) {
        return number;
      } else {
        return Board.EMPTY_SQUARE_SYMBOL;
      }
    }

    function display123row() {
      return `      ${self.squares[1]}   |   ${self.squares[2]}   |   ${self.squares[3]}          ${displayNumber(1)}   ${displayNumber(2)}   ${displayNumber(3)}`;
    }

    function display789row() {
      return `      ${self.squares[7]}   |   ${self.squares[8]}   |   ${self.squares[9]}          ${displayNumber(7)}   ${displayNumber(8)}   ${displayNumber(9)}`;
    }

    console.log(`          |       |       `);
    console.log(this.layout === "p" ? display123row() : display789row());
    console.log(`          |       |       `);
    console.log(`   -------+-------+-------`);
    console.log(`          |       |`);
    console.log(`      ${this.squares[4]}   |   ${this.squares[5]}   |   ${this.squares[6]}          ${displayNumber(4)}   ${displayNumber(5)}   ${displayNumber(6)}`);
    console.log(`          |       |       `);
    console.log(`   -------+-------+-------`);
    console.log(`          |       |       `);
    console.log(this.layout === "n" ? display123row() : display789row());
    console.log(`          |       |       \n`);
  }

  getSquaresWith(symbol) {
    return Object.keys(this.squares)
                 .filter(key => this.squares[key] === symbol);
  }

  emptySquaresNumbers() {
    return this.getSquaresWith(Board.EMPTY_SQUARE_SYMBOL);
  }

  squareIsEmpty(number) {
    return this.squares[number] === Board.EMPTY_SQUARE_SYMBOL;
  }

  setSquare(number, symbol) {
    this.squares[number] = symbol;
  }

  clearSquare(number) {
    this.squares[number] = Board.EMPTY_SQUARE_SYMBOL;
  }

  hasWinner(symbol) {
    let winnerFound = false;

    Board.WINNING_SQUARES.forEach(arr => {
      if (arr.every(number => this.getSquaresWith(symbol)
                                  .includes(number.toString()))) {
        winnerFound = true;
      }
    });

    return winnerFound;
  }

  getPossibleWinningMoveFor(symbol) {
    let empties = this.emptySquaresNumbers();

    for (let index = 0; index < empties.length; index += 1) {
      this.setSquare(empties[index], symbol);

      if (this.hasWinner(symbol)) {
        this.clearSquare(empties[index]);
        return empties[index];
      } else {
        this.clearSquare(empties[index]);
      }
    }

    return false;
  }

  isFull() {
    return this.emptySquaresNumbers().length === 0;
  }

  reset() {
    for (let number in this.squares) {
      this.clearSquare(number);
    }
  }
}


// -----------------------------------
class Player {
  constructor() {
    this.score = 0;
  }

  resetScore() {
    this.score = 0;
  }

  incrementScore(amount) {
    this.score += amount;
  }
}


class Human extends Player {
  static SYMBOL = "X";

  constructor() {
    super();
    this.symbol = Human.SYMBOL;
    this.name = "You";
  }

  getMove(board) {
    console.log(`Pick an empty square:`);
    let number = Help.getValidAnswer(board.emptySquaresNumbers());
    board.setSquare(number, Human.SYMBOL);
  }
}


class Computer extends Player {
  static SYMBOL = "O";

  constructor() {
    super();
    this.symbol = Computer.SYMBOL;
    this.name = "Computer";
  }

  getMove(board) {
    let number = Help.getRnd(board.emptySquaresNumbers());

    if (board.emptySquaresNumbers().includes(Board.CENTRE_SQUARE)) {
      number = Board.CENTRE_SQUARE;
    }

    let blockingMove = board.getPossibleWinningMoveFor(Human.SYMBOL);
    number = blockingMove || number;

    let winningMove = board.getPossibleWinningMoveFor(Computer.SYMBOL);
    number = winningMove || number;

    board.setSquare(number, Computer.SYMBOL);

  }
}


// -----------------------------------
class TTTGame {
  static GAMES_TO_WIN = 3;

  constructor() {
    this.board = new Board(this.chooseControlLayout());
    this.human = new Human();
    this.computer = new Computer();
    this.currentPlayer = this.askForFirstPlayer();
    this.gameNumber = 1;
  }

  chooseControlLayout() {
    console.clear();
    console.log("Let's play Tic Tac Toe!\n");
    console.log("Please choose your control layout to place your moves:\n");
    console.log("     7  8  9                  1  2  3");
    console.log("     4  5  6        or        4  5  6");
    console.log("     1  2  3                  7  8  9\n");
    console.log("[n]umerical keypad            [p]hone\n");

    let layout = Help.getValidAnswer(["p", "n"]);
    return layout;
  }

  askForFirstPlayer() {
    console.clear();
    console.log("Let's play Tic Tac Toe!\n");
    console.log("Who should begin the first game? Chose [h]uman, [c]omputer or [r]andom.");

    let firstPlayer;
    let answer = Help.getValidAnswer(["h", "c", "r"]);

    switch (answer) {
      case "h":
        firstPlayer = this.human;
        break;
      case "c":
        firstPlayer = this.computer;
        break;
      case "r":
        firstPlayer = Math.random() < 0.5 ? this.human : this.computer;
    }

    return firstPlayer;
  }

  displayScore() {
    console.clear();
    console.log("Let's play Tic Tac Toe!\n");
    console.log(`This is game ${this.gameNumber}. The first to reach ${TTTGame.GAMES_TO_WIN} points wins.\n`);
    console.log(`YOU (${Human.SYMBOL})   ${this.human.score} : ${this.computer.score}   (${Computer.SYMBOL}) COMPUTER \n`);
  }

  displayScoreAndBoard() {
    this.displayScore();
    this.board.display();
  }

  displayWinner() {
    switch (this.currentPlayer) {
      case this.human:
        console.log("You have won this game.\n");
        break;
      case this.computer:
        console.log("The computer won this game.\n");
    }
  }

  displayMatchWinner() {
    let matchWinner = (this.human.score > this.computer.score) ? "human" : "computer";

    switch (matchWinner) {
      case "human":
        console.log("CONGRATULATIONS!\nYou have won the match!\n");
        break;
      case "computer":
        console.log("SORRY,\nbut the computer won this match.\n");
    }
  }

  setNextPlayer() {
    return (this.currentPlayer === this.human) ? this.computer : this.human;
  }

  playAgain() {
    console.log("Do you want to play again? (y/n)");
    let input = Help.getValidAnswer(["y", "n"]);
    return input === "y";
  }

  resetMatch() {
    this.human.resetScore();
    this.computer.resetScore();
    this.gameNumber = 1;
    this.board.reset();
  }

  // eslint-disable-next-line max-lines-per-function, max-statements
  play() {
    while (true) { // match loop

      while (true) { // game loop

        while (true) { // move loop

          this.displayScoreAndBoard();
          this.currentPlayer.getMove(this.board);

          if (this.board.hasWinner(this.currentPlayer.symbol)) {
            this.displayScoreAndBoard();
            this.displayWinner();
            this.currentPlayer.incrementScore(1);
            break;

          } else if (this.board.isFull()) {
            this.displayScoreAndBoard();
            console.log("The board is full, nobody won this game.\n");
            break;
          }

          this.currentPlayer = this.setNextPlayer();
        }

        if ((this.computer.score < TTTGame.GAMES_TO_WIN) &&
            (this.human.score < TTTGame.GAMES_TO_WIN)) {

          this.gameNumber += 1;
          this.board.reset();
          this.currentPlayer = this.setNextPlayer();
          console.log(`Next game's first player: ${this.currentPlayer.name}.`);
          rlsync.question("Press Enter to proceed to the next round.");
          continue;

        } else {
          this.displayScoreAndBoard();
          this.displayMatchWinner();
        }

        break;
      }

      if (this.playAgain()) {
        this.resetMatch();
        continue;
      }

      break;
    }
  }
}

let game = new TTTGame();

game.play();