import { Card } from "./card";
export class Player {
  constructor(nickName) {
    this.nickName = nickName;
    this.cards = [];
    this.accumulatedCards = [];
    this.pointsDistribution = {
      totalCards: 0,
      piCards: [],
      APoints: 0,
      birao: 0,
      dymondTen: 0,
      piTwo: 0,

    };
    this.points = 0;
  }
  resetPointsDistribution() {

    this.pointsDistribution.totalCards = 0;
    this.pointsDistribution.piCards = 0
    this.pointsDistribution.APoints = 0
    this.pointsDistribution.dymondTen = 0
    this.pointsDistribution.piCards = []
    this.pointsDistribution.piTwo = 0
  }
  countCards() {
    this.accumulatedCards.forEach((accumulatedCard) => {
      if (accumulatedCard.formedCards.length) {
        for (let formedCard of accumulatedCard.formedCards) {
          this.cardEvaluation(formedCard);
        }
        this.pointsDistribution.totalCards +=
          accumulatedCard.formedCards.length;
      } else {
        this.cardEvaluation(accumulatedCard);
        this.pointsDistribution.totalCards++;
      }
    });
  }

  cardEvaluation(card) {
    if (card.symbol == "♠️ ") {
      this.pointsDistribution.piCards.push(card);
    }
    if (card.name[0] == "A") {

      this.pointsDistribution.APoints++;
    }
    if (card.name == "10" + "♦️") {
      this.pointsDistribution.dymondTen++;
    }
    if (card.name == "2" + "♠️") this.pointsDistribution.piTwo++;
  }
  verifyFormedCards(gameCards) {
    for (let gameCard of gameCards.cards) {
      if (gameCard.formedBy == this.nickName)
        return false;
    }
    return true;
  }
  blockA(gameCards, playerCard) {
    let cardsA = this.cards.filter((cardItem) => {
      return cardItem.value == 14
    })
    if (cardsA.length > 1) {
      playerCard.block = true;
      playerCard.formedBy = this.nickName
      gameCards.cards.push(playerCard)
      gameCards.playStatus = true;
    }

  }
  dropCard(gameCards, playerCard) {
    if (this.verifyFormedCards(gameCards)) {
      console.log("hola")
      gameCards.cards.push(playerCard)
      gameCards.playStatus = true;
    }
    return gameCards;
  }
  lootCards(gameCards, selectedCards, playerCard) {
    if (this.checkLoot(selectedCards, playerCard)) {
      gameCards = this.updateGameCards(gameCards, selectedCards);
      selectedCards.push(playerCard);
      console.log(gameCards.cards.length)
      if (gameCards.cards.length < 1) {
        this.pointsDistribution.birao++;
        console.log(this.pointsDistribution.birao)
        console.log("a")
      }
      this.accumulatedCards = this.accumulatedCards.concat(selectedCards);
      gameCards.playStatus = true;

    }
    console.log(selectedCards);
    return gameCards;
  }
  checkLoot(selectedCards, playerCard) {
    let sum = 0;
    let sum2 = 0;
    let sums = [];
    let isBlock = false;
    let blockedCard;
    let cardsA = 0
    let mod = 0
    for (let selectedCard of selectedCards) {
      if (selectedCard.symbol == '-') {
        isBlock = true;
        blockedCard = selectedCard;
      }

      if (selectedCard.name[0] == 'A') {
        if (selectedCard.block) {
          if (playerCard.name[0] != selectedCard.name[0]) {
            return false;
          }
        }
        cardsA++;
      }
      sum += selectedCard.value
    }
    console.log("suma: " + sum)
    for (let e = 0; e <= cardsA; e++) {
      sum = 0;
      if (playerCard.name[0] == 'A') {
        if (e > 0) {
          for (let selectedCard of selectedCards) {
            if (selectedCard.value == 14) {
              selectedCard.value = 1;
              break;
            }
          }
        }
      }
      else {
        for (let selectedCard of selectedCards) {
          sum += selectedCard.value;
          if (selectedCard.value == 14) selectedCard.value = 1;
        }
      }
      if (isBlock) {
        if (blockedCard.value != playerCard.value) return false;
      }
      for (let i = 1; i <= selectedCards.length; i++) {
        sums.push(this.sumasPosibles(selectedCards, i, playerCard.value));
      }
      for (let sumFilas of sums) {
        sum2 += sumFilas.length;
      }
      console.log(sum / playerCard.value)
      console.log(sum2)
      if (sum2 >= sum / playerCard.value) {

        return true;
      }
    }


    return false;
  }
  checkMatch(selectedCards, playerCard) {
    let sum = 0;
    let sum2 = 0;
    let sums = [];
    let cardsA = 0;
    let mod = 0
    for (let selectedCard of selectedCards) {
      if (selectedCard.name[0] == 'A') {
        if (selectedCard.block)

          return false;


        cardsA++;
      }
    }
    console.log(sum)
    for (let e = 0; e <= cardsA; e++) {

      console.log("sum:" + sum)
      sum = 0;
      if (playerCard.name[0] == 'A') {

        if (e > 0) {
          for (let selectedCard of selectedCards) {
            if (selectedCard.name[0] == 'A') {
              selectedCard.value = 1;
              break;
            }
          }
        }
      }
      else {
        for (let selectedCard of selectedCards) {

          if (selectedCard.name[0] == 'A') selectedCard.value = 1;
        }
      }
      for (let selectedCard of selectedCards) {
        sum += selectedCard.value;
      }
      for (let i = 1; i <= selectedCards.length; i++) {
        sums.push(this.sumasPosibles(selectedCards, i, playerCard.value));
      }
      for (let sumA of sums) {
        sum2 += sumA.length;
      }
      mod = sum / playerCard.value;
      if (sum2 >= mod && mod >= 2) {
        console.log(selectedCards)
        console.log("mod: " + mod);
        return true;
      }

    }

    return false;
  }
  match(gameCards, selectedCards, playerCard) {
    let groupValue;
    let groupName = "-"
    selectedCards.push(playerCard);
    for (let card of this.cards) {
      if (playerCard.name != card.name)
        if (this.checkMatch(selectedCards, card)) {
          groupValue = card.value;
          groupName += card.value;

          let formedCard = new Card(groupName, "-", groupValue, "purple")
          this.concatCards(selectedCards, formedCard)
          formedCard.block = true;
          formedCard.formedBy = this.nickName;
          gameCards = this.updateGameCards(gameCards, selectedCards);
          gameCards.cards.push(formedCard);
          gameCards.playStatus = true;
          break;
        }
    }

    return gameCards;
  }

  sumasPosibles(arr, n, cardValue) {
    const resultados = [];
    function calcularSumas(actual, startIndex) {
      if (actual.length === n) {
        let suma = 0;
        for (let actualItem of actual) {
          suma += actualItem.value;
        }
        if (suma == cardValue) {
          resultados.push(suma);
        }
        return;
      }
      for (let i = startIndex; i < arr.length; i++) {
        let nuevoActual = [...actual, arr[i]];
        calcularSumas(nuevoActual, i + 1);
      }
    }
    calcularSumas([], 0);
    return resultados;
  }

  checkForm(selectedCards, playerCard) {
    let sum = 0;
    let reduce = 0;
    if (this.checkBlocks(selectedCards)) {
      return false
    }
    console.log(selectedCards)
    if (selectedCards.length > 1)
      for (let selectedCard of selectedCards) {
        if (selectedCard.name[0] == 'A') reduce += 13;
        sum += selectedCard.value;
      }
    console.log(sum);
    if (sum > playerCard.value) sum -= reduce;
    if (sum == playerCard.value) {
      return true;
    }
    return false;
  }
  formCards(gameCards, selectedCards, playerCard) {
    let band = false;
    let groupName = "+";
    let groupValue;
    selectedCards.push(playerCard);

    for (let turnPlayerCard of this.cards) {
      if (this.checkForm(selectedCards, turnPlayerCard)) {
        groupValue = turnPlayerCard.value;
        groupName += turnPlayerCard.value;
        let formedCard = new Card(groupName, '+', groupValue, "green")
        console.log(selectedCards)
        this.concatCards(selectedCards, formedCard)
        console.log(formedCard.formedCards)
        formedCard.formedBy = this.nickName;
        gameCards = this.updateGameCards(gameCards, selectedCards);
        gameCards.cards.push(formedCard);
        gameCards.playStatus = true;
        break;
      }
    }

    return gameCards;
  }
  concatCards(selectedCards, playerCard) {
    selectedCards.forEach((selectedCard) => {
      if (selectedCard.symbol == '+') {
        this.concatCards(selectedCard.formedCards, playerCard)
      }
      else {
        playerCard.formedCards.push(selectedCard)
      }
    })
  }
  checkBlocks(selectedCards) {
    for (let selectedCard of selectedCards) {
      if (selectedCard.block) return true
    }
    return false;
  }
  updateGameCards(gameCards, selectedCards) {
    for (let selectedCardIndex in selectedCards) {
      for (let gameCardIndex in gameCards.cards) {
        if (
          selectedCards[selectedCardIndex].name ==
          gameCards.cards[gameCardIndex].name
        ) {
          gameCards.cards.splice(gameCardIndex, 1);
        }
      }
    }

    return gameCards;
  }
}
