import { Card } from "./card";
export class Deck {
  cards = [];
  constructor() {
    const suits = ["♠️", "♥️", "♦️", "♣️"];
    const cardNames = [
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "J",
      "Q",
      "K",
      "A",
    ];
    this.createCards(cardNames, suits);
    this.shuffleCards();
  }
  shuffleCards() {
    this.cards = this.cards.sort(random);
  }
  dealCards() {
    let turnCards = this.cards.splice(this.initialPosition, 4);
    return turnCards;
  }
  get haveCards() {
    return this.cards.length > 0;
  }
  get initialPosition() {
    return this.cards.length - 4;
  }
  createCards(cardNames, suits) {
    for (let suit of suits) {
      cardNames.forEach((cardName, i) => {
        const cardValue = i + 2;
        const fullCardName = cardName + suit;
        const color = suit == "♥️" || suit == "♦️" ? "red" : "black";
        this.cards.push(new Card(fullCardName, suit, cardValue, color));
      });
    }
  }
}

function random() {
  return Math.random() - 0.5;
}
