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
    
    this.pointsDistribution = {
      totalCards: 0,
      piCards: [],
      APoints: 0,
      dymondTen: 0,
      piTwo: 0,
      birao: 0
    };
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
  dropCard(gameCards, playerCard) {
    gameCards.cards.push(playerCard);
    
    gameCards.playStatus = true;
    return gameCards;
  }
  lootCards(gameCards, selectedCards, playerCard) {
    if (this.checkLoot(selectedCards, playerCard)) {
      gameCards = this.updateGameCards(gameCards, selectedCards);
      selectedCards.push(playerCard);
      console.log(gameCards.cards.length)
      if(gameCards.cards.length < 1){
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
    let isBlock=false;
    let blockedCard;
    console.log(selectedCards)
    for (let selectedCard of selectedCards) {
      if(selectedCard.block){
        isBlock = true;
        blockedCard = selectedCard;
      } 
      sum+=selectedCard.value;
    }
  console.log("suma: "+sum)
    if (sum % playerCard.value == 0 && sum != 0) {
      if(isBlock){
        if(blockedCard.value != playerCard.value) return false;
      }
      console.log(selectedCards)
      for (let i = 1; i <= selectedCards.length; i++) {
        sums.push(this.sumasPosibles(selectedCards, i, playerCard.value));
      }
      for (let sumFilas of sums) {
        sum2 += sumFilas.length;
      }
      console.log(sum/playerCard.value)
      console.log(sum2)
      if (sum2 >= sum / playerCard.value){
        
        return true;
      } 
    }
    
    return false;
  }
  checkMatch(selectedCards, playerCard) {
    let sum = 0;
    let sum2 = 0;
    let sums = [];
    let count = 0;
    let band = true;
    for (let selectedCard of selectedCards) {
      sum += selectedCard.value;
    }
    
    console.log(sum);

    if (sum % playerCard.value == 0) {
      for (let i = 1; i <= selectedCards.length; i++) {
        sums.push(this.sumasPosibles(selectedCards, i, playerCard.value));
      }
      for (let sumA of sums) {
        sum2 += sumA.length;
      }
      sum = sum / playerCard.value;
      if (sum2 == sum && sum >= 2) {
        console.log(selectedCards)
        console.log(sum);
        sum = 0;
        return true;
      }
    }
    
    return false;
  }
  match(gameCards, selectedCards, playerCard) {
    let groupValue;
    let groupName = "(";
    selectedCards.push(playerCard);
    for (let card of this.cards) {
      if (playerCard.name != card.name)
        if (this.checkMatch(selectedCards, card, playerCard)) {
          groupValue = card.value;
          selectedCards.forEach((card) => {
            groupName += card.name + " ";
          });
          groupName += ")";
          playerCard.name = groupName;
          playerCard.value = groupValue;
          this.concatCards(selectedCards, playerCard)
          playerCard.block = true;
          gameCards = this.updateGameCards(gameCards, selectedCards);
          gameCards.cards.push(playerCard);
          gameCards.playStatus = true;
        }
    }
    
    return gameCards;
  }

  sumasPosibles(arr, n, cardValue) {
    const resultados = [];
    function calcularSumas(actual, startIndex) {
      if (actual.length === n) {
        let suma = 0;
        for(let actualItem of actual){
          suma+=actualItem.value;
        }
        if (suma == cardValue){
          resultados.push(suma);
        } 
        return;
      }
      for (let i = startIndex; i < arr.length; i++) {
        let nuevoActual = [...actual, arr[i]];
        calcularSumas(nuevoActual, i+1);
      }
    }
    calcularSumas([], 0);
    return resultados;
  }

  checkForm(selectedCards, playerCard) {
    let sum = 0;
    let reduce = 0;
    selectedCards.forEach((selectedCard)=>{
      if(selectedCard.block){
        return false;
      }
    })
    console.log(selectedCards)
    if (selectedCards.length > 1)
      for (let selectedCard of selectedCards) {
        if(selectedCard.name[0]=='A') reduce+=13;
        sum += selectedCard.value;
      }
    console.log(sum);
    if(sum>playerCard.value) sum-=reduce;
    if (sum == playerCard.value) {
      return true;
    }
    return false;
  }
  formCards(gameCards, selectedCards, playerCard) {
    let band = false;
    let groupName = "( ";
    let groupValue;
    selectedCards.push(playerCard);
    
    for (let turnPlayerCard of this.cards) {
      if (this.checkForm(selectedCards, turnPlayerCard)) {
        groupValue = turnPlayerCard.value;
        selectedCards.forEach((card) => {
          groupName += card.name + " ";
        });
        groupName += ")";
        let formedCard = new Card(groupName, '+', groupValue, "black")
        console.log(selectedCards)
        this.concatCards(selectedCards, formedCard)
        console.log(formedCard.formedCards)
        gameCards = this.updateGameCards(gameCards, selectedCards);
        gameCards.cards.push(formedCard);
        gameCards.playStatus = true;
      }
    }
    
    return gameCards;
  }
  concatCards(selectedCards, playerCard){
    selectedCards.forEach((selectedCard)=>{
      if(selectedCard.symbol=='+'){
        this.concatCards(selectedCard.formedCards, playerCard)
      }
      else{
        playerCard.formedCards.push(selectedCard)
      }
    })
  }
  checkBlocks(selectedCards){
    for(let selectedCard of selectedCards){
      if(selectedCard.block) return false
    }
    return true;
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
