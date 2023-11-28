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
    this.pointsDistribution.piCards = 0;
    this.pointsDistribution.APoints = 0;
    this.pointsDistribution.dymondTen = 0;
    this.pointsDistribution.piCards = [];
    this.pointsDistribution.piTwo = 0;
  }
  countCards() {
    this.accumulatedCards.forEach((accumulatedCard) => {
      if (accumulatedCard.numberOfFormedCards) {
        for (let formedCard of accumulatedCard.formedCards) {
          this.cardEvaluation(formedCard);
        }
        this.pointsDistribution.totalCards +=
          accumulatedCard.numberOfFormedCards;
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
    return (
      gameCards.cards.findIndex(
        (gameCard) => gameCard.formedBy == this.nickName
      ) == -1
    );
  }
  blockA(gameCards, playerCard) {
    if (this.numberOfACards > 1) {
      playerCard.block = true;
      playerCard.formedBy = this.nickName;
      gameCards.cards.push(playerCard);
      gameCards.playStatus = true;
    }
  }
  get numberOfACards() {
    return this.cards.filter((cardItem) => cardItem.value == 14).length;
  }
  dropCard(gameCards, playerCard) {
    if (this.verifyFormedCards(gameCards)) {
      gameCards.cards.push(playerCard);
      gameCards.playStatus = true;
    }
  }
  lootCards(gameCards, selectedCards, playerCard) {
    if (this.checkLoot(selectedCards, playerCard)) {
      this.updateGameCards(gameCards, selectedCards);
      if (tableIsEmpty(gameCards)) this.pointsDistribution.birao++;
      this.accumulatedCards = this.accumulatedCards.concat(
        selectedCards,
        playerCard
      );
    }
    this.resetAValues(selectedCards);
  }
  checkLoot(selectedCards, playerCard) {
    let sum = 0;
    let combinations = 0;
    let cardsA = 0;
    for (let selectedCard of selectedCards) {
      if (selectedCard.symbol == "-") {
        if (selectedCard.value != playerCard.value) return false;
      }
      if (selectedCard.name[0] == "A") {
        cardsA++;
        if (selectedCard.block) {
          if (playerCard.name[0] != selectedCard.name[0]) {
            return false;
          }
        }
      }
    }
    for (let e = 0; e <= cardsA; e++) {
      if (e > 0) {
        this.evaluateACArds(selectedCards, playerCard);
      }
      sum = this.getTotalSum(selectedCards);
      combinations = this.getNumberOfCombinations(selectedCards, playerCard);
      console.log(combinations, sum);
      if (combinations >= sum / playerCard.value && sum > 0) {
        return true;
      }
    }
    return false;
  }
  getTotalSum(selectedCards) {
    let sum = 0;
    for (let selectedCard of selectedCards) {
      sum += selectedCard.value;
    }
    return sum;
  }
  evaluateACArds(selectedCards, playerCard) {
    if (playerCard.name[0] == "A") {
      for (let selectedCard of selectedCards) {
        if (selectedCard.name[0] == "A") {
          selectedCard.value = 1;
          break;
        }
      }
    } else {
      for (let selectedCard of selectedCards)
        if (selectedCard.name[0] == "A") selectedCard.value = 1;
    }
  }
  checkMatch(selectedCards, playerCard) {
    let sum = 0;
    let combinations = 0;
    let cardsA = 0;
    let mod = 0;
    for (let selectedCard of selectedCards) {
      if (selectedCard.name[0] == "A") {
        cardsA++;
        if (selectedCard.block) return false;
      } else if (selectedCard.block && playerCard.value != selectedCard.value)
        return false;
    }
    for (let e = 0; e <= cardsA; e++) {
      if (e > 0) {
        this.evaluateACArds(selectedCards, playerCard);
      }
      sum = this.getTotalSum(selectedCards);
      combinations = this.getNumberOfCombinations(selectedCards, playerCard);
      mod = sum / playerCard.value;
      if (combinations >= mod && mod >= 2) {
        return true;
      }
    }

    return false;
  }
  getNumberOfCombinations(selectedCards, playerCard) {
    let sums = [];
    let combinations = 0;
    for (let i = 1; i <= selectedCards.length; i++) {
      sums.push(this.sumasPosibles(selectedCards, i, playerCard.value));
    }
    for (let sum of sums) {
      combinations += sum.length;
    }
    return combinations;
  }
  match(gameCards, selectedCards, playerCard) {
    let groupValue;
    let groupName = "-";
    selectedCards.push(playerCard);
    for (let card of this.cards) {
      if (playerCard.name != card.name)
        if (this.checkMatch(selectedCards, card)) {
          groupValue = card.value;
          groupName += card.value;

          let formedCard = new Card(groupName, "-", groupValue, "purple");
          this.concatCards(selectedCards, formedCard);
          formedCard.block = true;
          formedCard.formedBy = this.nickName;
          this.updateGameCards(gameCards, selectedCards);
          gameCards.cards.push(formedCard);
          break;
        }
    }
    this.resetAValues(selectedCards);
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
      return false;
    }
    if (selectedCards.length > 1)
      for (let selectedCard of selectedCards) {
        if (selectedCard.name[0] == "A") reduce += 13;
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
    let groupName = "+";
    let groupValue;
    selectedCards.push(playerCard);

    for (let turnPlayerCard of this.cards) {
      if (this.checkForm(selectedCards, turnPlayerCard)) {
        groupValue = turnPlayerCard.value;
        groupName += turnPlayerCard.value;
        let formedCard = new Card(groupName, "+", groupValue, "blue");
        this.concatCards(selectedCards, formedCard);
        formedCard.formedBy = this.nickName;
        this.updateGameCards(gameCards, selectedCards);
        gameCards.cards.push(formedCard);
        break;
      }
    }

    return gameCards;
  }
  resetAValues(selectCards) {
    selectCards.forEach((selectedCard) => {
      if (selectedCard.value == 1) selectedCard.value = 14;
    });
  }
  concatCards(selectedCards, playerCard) {
    selectedCards.forEach((selectedCard) => {
      if (selectedCard.formedCards.length > 0) {
        this.concatCards(selectedCard.formedCards, playerCard);
      } else {
        playerCard.formedCards.push(selectedCard);
      }
    });
  }
  checkBlocks(selectedCards) {
    for (let selectedCard of selectedCards) {
      if (selectedCard.block) return true;
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
    gameCards.playStatus = true;
  }
}
function tableIsEmpty(gameCards) {
  return gameCards.cards.length < 1;
}
