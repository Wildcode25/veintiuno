// Assuming GameRules and Card are predefined classes
const gameRules = new GameRules();

class Player {
  constructor(nickName, id, room) {
    this.nickName = nickName; 
    this.id = id; 
    this.room = room; // Room the player belongs to
    this.cards = []; 
    this.accumulatedCards = []; // Cards accumulated by the player during the game
    this.pointsDistribution = {
      totalCards: 0,
      piCards: [],
      APoints: 0,
      birao: 0,
      dymondTen: 0,
      piTwo: 0,
    }; // Points distribution for various game metrics
    this.points = 0; // Total points of the player
    this.turn = false; // Indicator if it's the player's turn
  }

  // Resets the player's points distribution
  resetPointsDistribution() {
    this.pointsDistribution.totalCards = 0;
    this.pointsDistribution.piCards = [];
    this.pointsDistribution.APoints = 0;
    this.pointsDistribution.birao = 0;
    this.pointsDistribution.dymondTen = 0;
    this.pointsDistribution.piTwo = 0;
  }

  // Counts and evaluates the player's accumulated cards
  countCards() {
    this.accumulatedCards.forEach((accumulatedCard) => {
      if (accumulatedCard.numberOfFormedCards>0) {
        for (let formedCard of accumulatedCard.formedCards) {
          gameRules.cardEvaluation(formedCard, this);
        }
        this.pointsDistribution.totalCards += accumulatedCard.numberOfFormedCards;
      } else {
        gameRules.cardEvaluation(accumulatedCard, this);
        this.pointsDistribution.totalCards++;
      }
    });
  }

  // Blocks a card if the player has more than one Ace
  blockA(tableCards, playerCard) {
    if (this.numberOfACards > 1) {
      playerCard.block = true;
      playerCard.nickNameOfThePlayerWhoFormed = this.nickName;
      tableCards.cards.push(playerCard);
      tableCards.playStatus = true;
    }
  }

  // Getter for the number of Ace cards the player has
  get numberOfACards() {
    return this.cards.filter((cardItem) => cardItem.value == 14).length;
  }

  // Drops a card into the game if it meets certain conditions
  dropCard(tableCards, playerCard) {
    if (gameRules.verifyFormedCards(tableCards, this) && this.cards.findIndex(card => card.name == playerCard.name) != -1) {
      tableCards.cards.push(playerCard);
      tableCards.playStatus = true;
    }
  }

  // Loots cards if the conditions are met
  lootCards(tableCards, selectedCards, playerCard) {
    if (gameRules.checkLoot(selectedCards, playerCard)) {
      this.updatetableCards(tableCards, selectedCards);
      if (gameRules.tableIsEmpty(tableCards)) this.pointsDistribution.birao++;
      this.accumulatedCards = this.accumulatedCards.concat(selectedCards, playerCard);
    }
    this.resetAValues(selectedCards);
  }

  // Matches cards to form groups if the conditions are met
  match(tableCards, selectedCards, playerCard) {
    let groupValue;
    let groupName = "-";
    selectedCards.push(playerCard);
    for (let card of this.cards) {
      if (playerCard.name != card.name && gameRules.checkMatch(selectedCards, card)) {
        groupValue = card.value;
        groupName += card.value;

        let formedCard = new Card(groupName, "-", groupValue, selectedCards[selectedCards.length - 2].img);
        this.concatCards(selectedCards, formedCard);
        formedCard.block = true;
        formedCard.formedBy = this.nickName;
        this.updatetableCards(tableCards, selectedCards);
        tableCards.cards.push(formedCard);
        break;
      }
    }
    this.resetAValues(selectedCards);
  }

  // Forms cards into groups if the conditions are met
  formCards(tableCards, selectedCards, playerCard) {
    let groupName = "+";
    let groupValue;
    selectedCards.push(playerCard);

    for (let turnPlayerCard of this.cards) {
      if (gameRules.checkForm(selectedCards, turnPlayerCard)) {
        groupValue = turnPlayerCard.value;
        groupName += turnPlayerCard.value;
        let formedCard = new Card(groupName, "+", groupValue, selectedCards[selectedCards.length - 2].img);
        this.concatCards(selectedCards, formedCard);
        formedCard.formedBy = this.nickName;
        this.updatetableCards(tableCards, selectedCards);
        tableCards.cards.push(formedCard);
        break;
      }
    }

    return tableCards;
  }

  // Resets the value of Ace cards back to 14
  resetAValues(selectCards) {
    selectCards.forEach((selectedCard) => {
      if (selectedCard.value == 1) selectedCard.value = 14;
    });
  }

  // Concatenates formed cards
  concatCards(selectedCards, playerCard) {
    selectedCards.forEach((selectedCard) => {
      if (selectedCard.formedCards.length > 0) {
        this.concatCards(selectedCard.formedCards, playerCard);
      } else {
        playerCard.formedCards.push(selectedCard);
      }
    });
  }

  // Updates the game cards by removing the selected cards from the game
  updatetableCards(tableCards, selectedCards) {
    for (let selectedCardIndex in selectedCards) {
      for (let gameCardIndex in tableCards.cards) {
        if (selectedCards[selectedCardIndex].name == tableCards.cards[gameCardIndex].name) {
          tableCards.cards.splice(gameCardIndex, 1);
        }
      }
    }
    tableCards.playStatus = true;
  }
}
