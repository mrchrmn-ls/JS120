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
class Card {
  constructor(suit, rank, value) {
    this.suit = suit;
    this.rank = rank;
    this.value = value;
    this.hidden = false;
  }

  getSuit() {
    return this.suit;
  }

  getRank() {
    return this.rank;
  }

  getValue() {
    return this.value;
  }

  isAce() {
    return this.rank === "A";
  }

  isHidden() {
    return this.hidden === true;
  }

  hide() {
    this.hidden = true;
  }

  reveal() {
    this.hidden = false;
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

  static CARD_RANKS = {
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
      for (let rank in Deck.CARD_RANKS) {
        this.cards.push(new Card(Deck.SUIT_SYMBOLS[suit],
                                 rank,
                                 Number(Deck.CARD_RANKS[rank])));
      }
    }
    this.shuffle();
  }

  shuffle() {
    for (let card1index = this.cards.length - 1;
        card1index > 0; card1index -= 1) {

      let card2index = Math.floor((card1index + 1) * Math.random());
      [this.cards[card1index], this.cards[card2index]] =
        [this.cards[card2index], this.cards[card1index]];
    }
  }

  dealCard() {
    if (this.cards.length > 0) {
      return this.cards.pop();
    } else {
      this.openNewDeck();
      return this.cards.pop();
    }
  }

  openNewDeck() {
    this.cards = [];
    for (let suit in Deck.SUIT_SYMBOLS) {
      for (let rank in Deck.CARD_RANKS) {
        this.cards.push(new Card(Deck.SUIT_SYMBOLS[suit],
                                 rank,
                                 Number(Deck.CARD_RANKS[rank])));
      }
    }
    this.shuffle();
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
      score += card.getValue();
      aces += card.isAce() ? 1 : 0;
    });

    while ((score > Game.MAX_HAND_SCORE) && (aces > 0)) {
      score -= 10;
      aces -= 1;
    }

    return score;
  }

  // eslint-disable-next-line max-lines-per-function, max-statements
  display() {
    let numberOfCards = this.cards.length;
    let self = this;

    function displayValueLine() {
      let line = "";

      self.cards.forEach(card => {
        if (!card.isHidden()) {
          if (card.getRank() === "10") {
            line += "   | 1 0 |";
          } else {
            line += `   |  ${card.getRank()}  |`;
          }
        } else {
          line += "   |     |";
        }
      });

      console.log(line);
    }

    function displaySuitsLine() {
      let line = "";

      self.cards.forEach(card => {
        if (!card.isHidden()) {
          line += `   |  ${card.getSuit()}  |`;
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
    this.name = name;
  }

  isBust() {
    return this.hand.getScore() > Game.MAX_HAND_SCORE;
  }

  resetHand() {
    this.hand = new Hand();
  }
}


//------------------------------------
class Player extends Contestant {
  constructor(name) {
    super(name);
    this.money = Game.START_MONEY;
  }

  isBroke() {
    return this.money === 0;
  }

  isRich() {
    return this.money === Game.RICH_LIMIT;
  }

  addMoney() {
    this.money += 1;
  }

  deductMoney() {
    this.money -= 1;
  }

  resetMoney() {
    this.money = Game.START_MONEY;
  }
}


//------------------------------------
class Game {
  static MAX_HAND_SCORE = 21;
  static DEALER_MIN_HAND_SCORE = 17;
  static START_MONEY = 5;
  static RICH_LIMIT = 10;

  constructor() {
    this.deck = new Deck();
    this.dealer = new Contestant("Dealer");
    this.player = new Player("Player");
  }

  dealFirstCards() {
    for (let count = 0; count < 2; count += 1) {
      this.player.hand.addCard(this.deck.dealCard());
      this.dealer.hand.addCard(this.deck.dealCard());
    }
    this.dealer.hand.cards[1].hide();
  }

  // eslint-disable-next-line max-lines-per-function, max-statements
  displayGame() {
    let self = this;

    function displayIntro() {
      console.log("Welcome to Twenty-One!\n");
      console.log("Lose a round, lose a dollar. Win a round, win a dollar.");
      console.log(`The game ends when you're broke ($0) or rich ($${Game.RICH_LIMIT})\n`);
      console.log(`You currently have $${self.player.money}.\n`);
    }

    function displayHandScores(contestant) {
      if (contestant.hand.cards[1].isHidden()) {
        console.log(`\n${contestant.name}'s card score: at least ${contestant.hand.cards[0].getValue() + 1}`);
      } else {
        console.log(`\n${contestant.name}'s card score: ${contestant.hand.getScore()}`);
      }
    }

    console.clear();
    displayIntro();

    console.log();
    this.player.hand.display();
    displayHandScores(this.player);
    console.log("\n");

    this.dealer.hand.display();
    displayHandScores(this.dealer);
    console.log();

  }

  enterForNextRound() {
    rlsync.question("Press enter to start the next round.");
  }

  enterForDealerCard() {
    rlsync.question("Press enter to reveal dealer's next card.");
  }

  playerTurn() {
    function hitMe() {
      console.log("Hit or stay? (h/s)");
      let input = Help.getValidAnswer(["h", "s"]);
      return input === "h";
    }

    this.displayGame();

    while (this.player.isBust() === false) { // player loop
      if (hitMe()) {
        this.player.hand.addCard(this.deck.dealCard());
        this.displayGame();
        continue;
      }

      break;
    }
  }

  dealerTurn() {
    this.dealer.hand.cards[1].reveal();
    this.displayGame();

    while (this.dealer.hand.getScore() < Game.DEALER_MIN_HAND_SCORE) { // dealer loop
      this.enterForDealerCard();
      this.dealer.hand.addCard(this.deck.dealCard());
      this.displayGame();
    }
  }

  declareBust(contestant) {
    switch (contestant) {
      case this.player:
        console.log("You bust! The house has won this round.\n");
        break;
      case this.dealer:
        console.log("Dealer busts! You have won this round.\n");
    }
  }

  getRoundWinner() {
    if (this.player.hand.getScore() === this.dealer.hand.getScore()) return "push";

    return this.player.hand.getScore() > this.dealer.hand.getScore() ?
           this.player : this.dealer;
  }

  declareRoundWinner(winner) {
    if (winner === "push") {
      console.log("Push! No one wins this round.\n");
      return;
    }

    switch (winner) {
      case this.player:
        console.log("You have won this round.\n");
        break;
      case this.dealer:
        console.log("The house has won this round.\n");
    }
  }

  resetRound() {
    this.player.resetHand();
    this.dealer.resetHand();
  }

  isGameOver() {
    return (this.player.money === Game.RICH_LIMIT) ||
           (this.player.money === 0);
  }

  getEndResult() {
    return this.player.money === Game.RICH_LIMIT ?
           "rich" : "broke";
  }

  displayEndResult(result) {
    switch (result) {
      case "rich":
        if (this.dealer.isBust()) {
          console.log("CONGRATULATIONS!\nThe dealer bust, you have won this round,\nand now you're rich!\n");
        } else {
          console.log("CONGRATULATIONS!\nYou've one this round\nand now you're rich!\n");
        }
        break;
      case "broke":
        if (this.player.isBust()) {
          console.log("SORRY!\nYou bust, the house has won this round,\nand now you're broke!\n");
        } else {
          console.log("SORRY!\nThe house has one this round,\nand now you're broke!\n");
        }
    }
  }

  resetMatch() {
    this.player.resetHand();
    this.player.resetMoney();
    this.dealer.resetHand();
    this.deck = new Deck();
  }

  // eslint-disable-next-line max-lines-per-function, max-statements
  play() {

    function playAgain() {
      console.log("Do you want to play again? (y/n)");
      let input = Help.getValidAnswer(["y", "n"]);
      return input === "y";
    }

    while (true) {

      while (true) {

        this.dealFirstCards();

        this.playerTurn();

        if (this.player.isBust()) {
          this.declareBust(this.player);
          this.player.deductMoney();

          if (this.isGameOver()) break;

          this.resetRound();
          this.enterForNextRound();
          continue;
        }

        this.dealerTurn();

        if (this.dealer.isBust()) {
          this.declareBust(this.dealer);
          this.player.addMoney();

          if (this.isGameOver()) break;

          this.resetRound();
          this.enterForNextRound();
          continue;
        }

        if (this.getRoundWinner() === this.player) {
          this.player.addMoney();
        } else if (this.getRoundWinner() === this.dealer) {
          this.player.deductMoney();
        }

        this.declareRoundWinner(this.getRoundWinner());

        if (this.isGameOver()) break;

        this.resetRound();
        this.enterForNextRound();
      }

      this.displayGame();
      this.displayEndResult(this.getEndResult());

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
