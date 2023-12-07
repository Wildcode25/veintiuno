import { Card } from "./card";
import { Game } from "./game";
let game = new Game();

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
    if (game.checkLoot(selectedCards, playerCard)) {
      this.updateGameCards(gameCards, selectedCards);
      if (tableIsEmpty(gameCards)) this.pointsDistribution.birao++;
      this.accumulatedCards = this.accumulatedCards.concat(
        selectedCards,
        playerCard
      );
    }
    this.resetAValues(selectedCards);
  }

  match(gameCards, selectedCards, playerCard) {
    let groupValue;
    let groupName = "-";
    selectedCards.push(playerCard);
    for (let card of this.cards) {
      if (playerCard.name != card.name)
        if (game.checkMatch(selectedCards, card)) {
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

  formCards(gameCards, selectedCards, playerCard) {
    let groupName = "+";
    let groupValue;
    selectedCards.push(playerCard);

    for (let turnPlayerCard of this.cards) {
      if (game.checkForm(selectedCards, turnPlayerCard)) {
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
