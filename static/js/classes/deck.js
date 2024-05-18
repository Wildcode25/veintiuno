
const X_VALUE = -92.25;
const Y_VALUE = -129
class Deck {
  cards = [];
  constructor() {
    this.suits = ["♥️", "♠️", "♦️", "♣️"];
    this.cardNames = [
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
  
  dealCards() {
    let turnCards = this.cards.splice(this.initialPosition, 4);
    return turnCards;
  }
  get haveCards() {
    return this.cards.length > 0;
  }
  get numbersOfCards(){
    return this.cards.length
  }
  get initialPosition() {
    return this.cards.length - 4;
  }
  createCards() {
    this.suits.forEach((suit,e) => {
      {
        this.cardNames.forEach((cardName, i) => {
          let cardValue;
          if(cardName == "A") cardValue = 14;
          else cardValue = i+1;

          const fullCardName = cardName + suit;
          this.cards.push(new Card(fullCardName, suit, cardValue, {
            url: "src/img/cartas41.png",
            x: i*X_VALUE,
            y: e*Y_VALUE
          }));
        });
      }
    });
   
  }
}


