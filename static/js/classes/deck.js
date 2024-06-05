class Deck {
  cards = []; // Array to store the deck of cards

  constructor() {
    this.suits = ["♥️", "♠️", "♦️", "♣️"]; // The four suits of the cards
    this.cardNames = [ // The names of the cards
      "A",
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
    ];
  }

  // Method to deal the last 4 cards from the deck
  dealCards() {
    let turnCards = this.cards.splice(this.initialPosition, 4);
    return turnCards;
  }

  // Getter that returns true if there are cards in the deck, false otherwise
  get haveCards() {
    return this.cards.length > 0;
  }

  // Getter that returns the number of remaining cards in the deck
  get numbersOfCards() {
    return this.cards.length;
  }

  // Getter that returns the starting position to deal the last 4 cards
  get initialPosition() {
    return this.cards.length - 4;
  }

  // Method to create all the cards in the deck
  createCards() {
    const X_VALUE = -92.25; // X offset value for the card image
    const Y_VALUE = -129; // Y offset value for the card image

    this.suits.forEach((suit, e) => {
      this.cardNames.forEach((cardName, i) => {
        let cardValue;
        if(cardName == "A") cardValue = 14; // Special value for Ace
        else cardValue = i + 1; // Value for other cards

        const fullCardName = cardName + suit; // Full name of the card
        // Create a card object and add it to the cards array
        this.cards.push(new Card(fullCardName, suit, cardValue, {
          url: "src/img/cartas41.png", // Path to the card image
          x: i * X_VALUE, // X position of the image
          y: e * Y_VALUE // Y position of the image
        }));
      });
    });
  }
}
