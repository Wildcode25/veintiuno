export class Ui {
  constructor() {
    this.data = [];
  }

  display() {
    alert("Bienvenido a Veintiuno");
    for (let i = 0; i < 2; i++) {
      this.data.push(prompt("Nickname"));
    }
  }
}
