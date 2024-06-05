 class Card {
  constructor(name, symbol, value, img) {
    this.name = name;
    this.symbol = symbol;
    this.value = value;
    this.block = false;
    this.formedCards = [];
    this.nicknameOfThePlayerWhoFormed = "";
    this.img = img;
  }
  get numberOfFormedCards() {
    return this.formedCards.length;
  }
}
