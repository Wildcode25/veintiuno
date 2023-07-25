import { Ui } from "./ui.js";

let ui = new Ui();
export class Game {
  start() {
    ui.display();
    console.log(ui.data);
  }
}
