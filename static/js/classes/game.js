import { Ui } from "./ui.js";
import { Player } from "./player.js";
import { Card } from "./card.js";

let ui = new Ui();
export class Game {
  constructor() {
    this.deck = [];
  }
  start() {
    let play;
    let gameCards = {
      cards: [],
      playStatus: false,
    };

    ui.displayWelcome();
    let players = ui.askPlayerNames();

    // let playersPlaces = this.updateStatistics(players);
    while (players[0].points < 21) {
      this.deck = this.getDeck();
      let rounds = this.deck.length / (players.length * 4);
      gameCards.cards = this.getCards();
      for (let i = 0; i < 1; i++) {
        players = players.map((e) => {
          e.cards = this.getCards();
          return e;
        });

        for (let j = 0; j < 4; j++) {
          players.forEach((e) => {
            while (!gameCards.playStatus) {
              play = ui.displayGame(gameCards, e);

              switch (play.actionIndex) {
                case 1:
                  gameCards = e.dropCard(gameCards, play.card);
                  break;
                case 2:
                  gameCards = e.lootCards(
                    gameCards,
                    ui.selectCards(gameCards.cards),
                    play.card
                  );
                  break;
                case 3:
                  gameCards = e.groupCards(
                    gameCards,
                    ui.selectCards(gameCards.cards),
                    play.card
                  );
                  break;
                case 4:
                  gameCards = e.match(
                    gameCards,
                    ui.selectCards(gameCards.cards),
                    play.card
                  );
                default:
                  "Opcion no disponible";
              }
              if (!gameCards.playStatus) alert("Jugada invalida");
            }

            e.cards = e.cards.filter((e) => {
              return e.name != play.card.name;
            });
            gameCards.playStatus = false;
          });
        }
      }

      players = this.updatePoints(players);
      console.log(players);
      players.forEach((e) => {
        e.resetPointsDistribution();
      });

      // playersPlaces = this.updateStatistics(players)
    }
    console.log("Fin del juego");
    // playersPlaces.forEach((e,i)=>{
    //   console.log(`${i+1}. ${e}`)

    // })
  }
  updatePoints(players) {
    for (let player of players) {
      player.countCards();
    }
    console.log(players)
    let mostCardsPlayer = players[0];
    let mostPiPlayer = players[0];
    for (let player of players) {
      if (
        mostCardsPlayer.pointsDistribution.totalCards <
        player.pointsDistribution.totalCards
      )
        mostCardsPlayer = player;
      if (
        mostPiPlayer.pointsDistribution.piCards.length <
        player.pointsDistribution.piCards.length
      )
        mostPiPlayer = player;
      if(player.pointsDistribution.dymondTen==1)
        player.points+=2
      if(player.pointsDistribution.piTwo==1)
        player.points++
    }
   
     mostCardsPlayer.points += 3
     mostPiPlayer.points++

    return players;
  }

  updateStatistics(players) {
    let aux;
    console.log(players);
    for (let i = 0; i < players.length - 1; i++) {
      for (let j = 0; j < players.length - 1; j++) {
        if (players[j].points > players[j + 1].points) aux = players[j + 1];
        players[j + 1] = players[j];
        players[j] = aux;
      }
    }
    console.log(players);
    return players;
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
      let cardValues = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
      for (let i = 0; i < cardNames.length; i++) {
        const cardName = cardNames[i] + suit;
        const cardValue = cardValues[i];
        const card = new Card(cardName, cardValue);
        pack.push(card);
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

    return cards;
  }
}
