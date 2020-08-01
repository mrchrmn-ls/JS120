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


//------------------------------------
class Deck {
  static SUIT_SYMBOLS = {
    Clubs: "\u2663",
    Spades: "\u2660",
    Hearts: "\u2665",
    Diamonds: "\u2666"
  };

  static CARD_VALUES = {
    2: "2",
    3: "3",
    4: "4",
    5: "5",
    6: "6",
    7: "7",
    8: "8",
    9: "9",
   10: "10",
    J: "10",
    Q: "10",
    K: "10",
    A: "11"
  };

  constructor() {
    this.cards = [];
    for (let suit in Deck.SUIT_SYMBOLS) {
      for (let value in Deck.CARD_VALUES) {
        this.cards.push([Deck.SUIT_SYMBOLS[suit], value]);
      }
    }
    this.shuffle();
  }

  shuffle() {
    for (let i = this.cards.length - 1; i > 0; i -= 1) {
      let j = Math.floor((i + 1) * Math.random());
      [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
    }
  }

  dealCard() {
    return this.cards.pop();
  }
}


//------------------------------------
class Hand {
  constructor() {
    this.cards = [];
  }

  addCard(card) {
    this.cards.push(card);
  }

  getScore() {
    let score = 0;
    let aces = 0;
    this.cards.forEach(card => {
      score += Number(Deck.CARD_VALUES[card[1]]);
      aces += (card[1] === "A") ? 1 : 0;
    });

    while ((score > Game.MAX_HAND_SCORE) && (aces > 0)) {
      score -= 10;
      aces -= 1;
    }

    return score;
  }

  // eslint-disable-next-line max-lines-per-function, max-statements
  display(revealAll = true) {
    let numberOfCards = this.cards.length;
    let self = this;

    function displayValueLine() {
      let line = "";
      let firstCard = true;

      self.cards.forEach(card => {
        let value = card[1];

        if (revealAll || firstCard) {
          if (value === "10") {
            line += "   | 1 0 |";
          } else {
            line += `   |  ${value}  |`;
          }
          firstCard = false;
        } else {
          line += "   |     |";
        }
      });

      console.log(line);
    }

    function displaySuitsLine() {
      let line = "";
      let firstCard = true;

      self.cards.forEach(card => {
        let symbol = card[0];

        if (revealAll || firstCard) {
          line += `   |  ${symbol}  |`;
          firstCard = false;
        } else {
          line += "   |     |";
        }
      });

      console.log(line);
    }

    console.log("   +-----+".repeat(numberOfCards));
    console.log("   |     |".repeat(numberOfCards));
    displayValueLine();
    displaySuitsLine();
    console.log("   |     |".repeat(numberOfCards));
    console.log("   +-----+".repeat(numberOfCards));
  }
}


//------------------------------------
class Contestant {
  constructor(name) {
    this.hand = new Hand();
    this.score = 0;
    this.name = name;
  }

  isBust() {
    return this.hand.getScore() > Game.MAX_HAND_SCORE;
  }

  incrementScore() {
    this.score += 1;
  }

  resetScore() {
    this.score = 0;
  }

  resetHand() {
    this.hand = new Hand();
  }
}


//------------------------------------
class Game {
  static MAX_HAND_SCORE = 21;
  static DEALER_MIN_HAND_SCORE = 17;
  static GAMES_TO_WIN = 5;
  static INITIAL_CARDS_NUMBER = 2;

  constructor() {
    this.deck = new Deck();
    this.player = new Contestant("Player");
    this.dealer = new Contestant("Dealer");
  }

  dealFirstCards(number) {
    for (let count = 0; count < number; count += 1) {
      this.player.hand.addCard(this.deck.dealCard());
      this.dealer.hand.addCard(this.deck.dealCard());
    }
  }

  displayGame(revealAll = true) {
    let self = this;

    function displayIntro() {
      console.log("Welcome to Twenty-One!\n");
      console.log(`Win ${Game.GAMES_TO_WIN} games to win the match.\nThe current overall score is:\n`);
      console.log(`PLAYER   ${self.player.score} : ${self.dealer.score}   DEALER\n`);
    }

    function displayHandScores(contestant, revealAll) {
      console.log(`\n${contestant.name}'s card score: ${revealAll ? contestant.hand.getScore() : `at least ${Number(Deck.CARD_VALUES[contestant.hand.cards[0][1]]) + 1}`}`);
    }

    console.clear();
    displayIntro();

    console.log();
    this.player.hand.display();
    displayHandScores(this.player, true);
    console.log("\n");

    this.dealer.hand.display(revealAll);
    displayHandScores(this.dealer, revealAll);
    console.log();
  }

  declareBust(contestant) {
    switch (contestant) {
      case this.player:
        console.log("You bust! The house has won this game.\n");
        return true;
      case this.dealer:
        console.log("Dealer busts! You have won this game.\n");
        return true;
    }
  }

  getGameWinner() {
    if (this.player.hand.getScore() === this.dealer.hand.getScore()) return "push";

    return this.player.hand.getScore() > this.dealer.hand.getScore() ?
           this.player : this.dealer;
  }

  declareGameWinner(winner) {
    if (winner === "push") {
      console.log("Push! No one wins this game.\n");
      return;
    }

    switch (winner) {
      case this.player:
        console.log("You have won this game.\n");
        break;
      case this.dealer:
        console.log("The house has won this game.\n");
        break;
    }
  }

  resetRound() {
    this.player.resetHand();
    this.dealer.resetHand();
  }

  hasMatchWinner() {
    return (this.player.score >= Game.GAMES_TO_WIN) ||
           (this.dealer.score >= Game.GAMES_TO_WIN);
  }

  getMatchWinner() {
    return this.player.score > this.dealer.score ?
           this.player : this.dealer;
  }

  declareMatchWinner(contestant) {
    switch (contestant) {
      case this.player:
        console.log("CONGRATULATIONS!\nYou have won the match.\n");
        break;
      case this.dealer:
        console.log("SORRY,\nbut the house has won the match.\n");
        break;
    }
  }

  resetMatch() {
    this.player.resetHand();
    this.player.resetScore();
    this.dealer.resetHand();
    this.dealer.resetScore();
    this.deck = new Deck();
  }

  // eslint-disable-next-line max-lines-per-function, max-statements
  play() {
    function hitMe() {
      console.log("Hit or stay? (h/s)");
      let input = Help.getValidAnswer(["h", "s"]);
      return input === "h";
    }

    function waitForEnter(reason) {
      switch (reason) {
        case "next round":
          rlsync.question("Press enter to start the next round.");
          break;
        case "reveal card":
          rlsync.question("Press enter to reveal dealer's next card.");
          break;
      }
    }

    function playAgain() {
      console.log("Do you want to play again? (y/n)");
      let input = Help.getValidAnswer(["y", "n"]);
      return input === "y";
    }

    while (true) { // match loop

      while (true) { // game loop

        this.dealFirstCards(Game.INITIAL_CARDS_NUMBER);

        this.displayGame(false);

        while (this.player.isBust() === false) { // player loop
          if (hitMe()) {
            this.player.hand.addCard(this.deck.dealCard());
            this.displayGame(false);
            continue;
          }

          break;
        }

        if (this.player.isBust()) {
          this.declareBust(this.player);
          this.dealer.incrementScore();
          if (this.hasMatchWinner()) break;

          this.resetRound();
          waitForEnter("next round");
          continue;
        }

        this.displayGame();

        while (this.dealer.hand.getScore() < Game.DEALER_MIN_HAND_SCORE) { // dealer loop
          waitForEnter("reveal card");
          this.dealer.hand.addCard(this.deck.dealCard());
          this.displayGame();
        }

        if (this.dealer.isBust()) {
          this.declareBust(this.dealer);
          this.player.incrementScore();
          if (this.hasMatchWinner()) break;

          this.resetRound();
          waitForEnter("next round");
          continue;
        }

        if (this.getGameWinner() !== "push") {
          this.getGameWinner().incrementScore();
        }

        this.declareGameWinner(this.getGameWinner());

        if (this.hasMatchWinner()) break;

        this.resetRound();
        waitForEnter("next round");
      }

      this.displayGame();
      this.declareMatchWinner(this.getMatchWinner());

      if (playAgain()) {
        this.resetMatch();
        continue;
      }

      break;
    }
  }
}

let TwentyOne = new Game();
TwentyOne.play();