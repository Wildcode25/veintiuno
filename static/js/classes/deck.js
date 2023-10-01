import { Card } from "./card";
export class Deck{
    getDeck() {
        let pack = [];
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
        for (const suit of suits) {
          let cardValues = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
          for (let i = 0; i < cardNames.length; i++) {
            const cardName = cardNames[i] + suit;
            const symbol = suit+" "
            const cardValue = cardValues[i];
            const color = suit == "♥️" || suit == "♦️" ? "red" : "black";
            const card = new Card(cardName, symbol,  cardValue, color);
            pack.push(card);
          }
        }
        for (let i = pack.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [pack[i], pack[j]] = [pack[j], pack[i]];
        }
    
        return {
            cards: pack,
            getCards: (cards)=> {
                let turnCards = [];
                let j = cards.length - 1;
                for (let i = 0; i < 4; i++) {
                  turnCards.push(cards[j]);
                  cards.pop();
                  j--;
                }
            
                return turnCards;
              }
        }
      }
}