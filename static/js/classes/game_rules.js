 class GameRules {
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
  checkBlocks(selectedCards) {
    for (let selectedCard of selectedCards) {
      if (selectedCard.block) return true;
    }
    return false;
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
  cardEvaluation(card, player) {
    if (card.symbol == "♠️ ") {
      player.pointsDistribution.piCards.push(card);
    }
    if (card.name[0] == "A") {
      player.pointsDistribution.APoints++;
    }
    if (card.name == "10" + "♦️") {
      player.pointsDistribution.dymondTen++;
    }
    if (card.name == "2" + "♠️") player.pointsDistribution.piTwo++;
  }
  verifyFormedCards(gameCards) {
    return (
      gameCards.cards.findIndex(
        (gameCard) => gameCard.formedBy == this.nickName
      ) == -1
    );
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
  tableIsEmpty(gameCards) {
    return gameCards.cards.length < 1;
  }
}
