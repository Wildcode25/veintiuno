import { Ui } from "./ui.js";
import { Player } from "./player.js";
let ui = new Ui();
export class Game {
  constructor() {
    this.deck = [];
  }
  start(players) {
    console.log(players)
    ui.displayGame(players);
    // let playersPlaces = this.updateStatistics(players);

    // playersPlaces = this.updateStatistics(players)

    console.log("Fin del juego");
    // playersPlaces.forEach((e,i)=>{
    //   console.log(`${i+1}. ${e}`)

    // })
  }
}
