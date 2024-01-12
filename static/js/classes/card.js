export class Card {
  constructor(name, symbol, value, color, img) {
    this.name = name;
    this.symbol = symbol;
    this.value = value;
    this.color = color;
    this.block = false;
    this.formedCards = [];
    this.formedBy = "";
    this.img = img;
  }
  get numberOfFormedCards() {
    return this.formedCards.length;
  }
}
