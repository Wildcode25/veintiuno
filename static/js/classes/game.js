import { Ui } from "./ui.js";
import { Player } from "./player.js";
import { Card } from "./card.js";

let ui = new Ui();
export class Game {
  constructor(){
    this.deck = this.getDeck();
  }
  start() {
    let gameCards=[];
    let players = [];
    ui.displayWelcome();
    const playerNames = ui.askPlayerNames();
    console.log(playerNames)
    playerNames.forEach((e) => {
      players.push(new Player(e));
    });
    gameCards = this.getCards();
    let rounds = this.deck.length/(players.length*4)
    for(let i=0; i<rounds; i++){
      console.log(this.deck.length)
      players = players.map((e)=>{
         e.cards = this.getCards()
         return e;
      })
    
      for(let j=0; j<4; j++){
        players.forEach((e)=>{
          console.log(e)
          const play = ui.displayGame(gameCards,e);
          e.cards = e.cards.filter((e)=>{
            return e.name != play.card.name;
          }
          )
        })
      }
      
    }
  }
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
      let cardValues = 2;
      for (let i = 0; i < cardNames.length; i++) {
        const cardName = cardNames[i] + suit;
        const cardValue = cardValues;
        const card = new Card(cardName, cardValue);
        pack.push(card);
        cardValues++;
      }
    }
    for (let i = pack.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pack[i], pack[j]] = [pack[j], pack[i]];
    }
    return pack;
  }

  getCards() {
    let cards = [];
    let j = this.deck.length - 1;
    for (let i = 0; i < 4; i++) {
      cards.push(this.deck[j]);
      this.deck.pop();
      j--;
    }
    console.log(cards)
    return cards;
  }


}
