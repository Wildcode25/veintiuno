import { Ui } from "./ui.js";

import { Card } from "./card.js";

let ui = new Ui();
export class Game {
  constructor() {
    this.deck = [];
  }
  start() {
    let play;

    ui.displayWelcome();
    let players = ui.askPlayerNames();
    ui.displayGame(players)
    // let playersPlaces = this.updateStatistics(players);


    // playersPlaces = this.updateStatistics(players)

    console.log("Fin del juego");
    // playersPlaces.forEach((e,i)=>{
    //   console.log(`${i+1}. ${e}`)

    // })
  }



  updateStatistics(players) {
    console.log(players);
    for (let i = 0; i < players.length - 1; i++) {
      for (let j = 0; j < players.length - 1; j++) {
        if (players[j].points > players[j + 1].points)
          [players[j], players[j + 1]] = [players[j + 1], players[j]];
      }
    }
    console.log(players);
    return players;
  }
}
