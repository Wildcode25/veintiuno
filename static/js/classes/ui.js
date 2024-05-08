//Variables declaration

const table = document.querySelector("#table1");
const playerCardsContainer = document.querySelector(".playerCardContainer");
console.log(table);
const playersContainer1 = document.querySelector(".playerContainer1");
const playersContainer2 = document.querySelector(".playerContainer2");
const tutorialButtons = document.querySelectorAll(".tutorialButton");
let selectCard = false;
let plays = 0;
let turn = 0;
let limit;
let selectedCards = [];
let turnLimit = 0;
let eventsOn = false;
let lastPlayerLootName = "";
let gameCards = {
  cards: [],
  playStatus: false,
};
let globalCardObject;
let previousTurn;
let globalPlayerCard;
let deck = new Deck();
let band = false
//User intarface
class Ui {
  constructor() {
    document
      .querySelector(".visibleTutorialButton")
      .addEventListener("click", (e) => {
        document
          .querySelector(".gameTutorial")
          .classList.toggle("showGameTutorial");
        console.log(document.querySelector(".gameTutorial"));
      });
    document
      .querySelector(".closeGameTutorialButton")
      .addEventListener("click", () => {
        document
          .querySelector(".gameTutorial")
          .classList.toggle("showGameTutorial");
      });
    tutorialButtons.forEach((tutorialButton) => {
      tutorialButton.addEventListener("click", (e) => {
        tutorialButtons.forEach((item) => {
          item.querySelector("h2").style.color = "white";
          item.querySelector("div").classList.remove("lineAnimation");
        });
        tutorialButton.querySelector("h2").style.color = "#CCA43B";
        tutorialButton.querySelector("div").classList.add("lineAnimation");
      });
    });
    this.addTutorialButtonsEvents(
      document.querySelector(".left"),
      document.querySelector(".right"),
      3,
      1
    );
    this.addTutorialButtonsEvents(
      document.querySelector(".left2"),
      document.querySelector(".right2"),
      5,
      2
    );
  }
  //Start the game
  displayGame(players) {
    previousTurn = players.length - 1;

    console.log(gameCards.cards.length);

    //Call the function sprintplayer
    players.forEach((player) => {
      let playersContainer =
        player.id % 2 == 0 ? playersContainer2 : playersContainer1;
      var playerStatisticContainer =
        player.id % 2 == 0
          ? playersContainer2.querySelector(
              `.playerStatisticContainer${player.id}`
            )
          : playersContainer1.querySelector(
              `.playerStatisticContainer${player.id}`
            );
      let playerStatisticContent = document.createElement("div");
      playerStatisticContent.className = "playerStatisticContent";
      let fullPlayerStatisticContent = document.createElement("div");
      fullPlayerStatisticContent.className = "playerStatisticContent";
      let imgPlayer = new Image();

      this.createPlayerStatisticContainerContent(
        playerStatisticContent,
        "",
        player.nickName
      );

      this.createPlayerStatisticContainerContent(
        playerStatisticContent,
        "Points: ",
        player.points
      );
      playerStatisticContainer.innerHTML = "";
      imgPlayer.src = "src/img/jj.jpg";
      playerStatisticContainer.appendChild(imgPlayer);
      playerStatisticContainer.appendChild(playerStatisticContent);
    });
    if (!deck.haveCards) deck.createCards();
    return deck.cards;

    //Table listeners

    //Doucment events

    //tutorialButtons
  }
  addTutorialButtonsEvents(left, right, limitT, section) {
    let l = limitT;
    let r = 2;
    left.addEventListener("click", () => {
      console.log(l);
      left.href = `#carrouselCard${section}${l}`;
      right.href = `#carrouselCard${section}${r}`;
      l = l <= 1 ? limitT : l - 1;

      r = r <= 1 ? limitT : r - 1;
    });

    right.addEventListener("click", () => {
      console.log(r);
      console.log(l);
      left.href = `#carrouselCard${section}${l}`;
      right.href = `#carrouselCard${section}${r}`;
      l = l >= limitT ? 1 : l + 1;

      r = r >= limitT ? 1 : r + 1;
    });
  }
  getPlayerCard(cardId, playerCards) {
    playerCards.forEach((playerCard) => {
      if (cardId == playerCard.name) {
        return playerCard;
      }
    });
  }
  evaluateWinner(players) {
    for (let player of players) {
      if (player.points >= 21) {
        return true;
      }
    }
    return false;
  }
  updatePoints(players) {
    let mostCardsPlayer = players[0];
    let mostPiPlayer = players[0];
    for (let player of players) {
      if (
        mostCardsPlayer.pointsDistribution.totalCards <
        player.pointsDistribution.totalCards
      )
        mostCardsPlayer = player;
      if (
        mostPiPlayer.pointsDistribution.piCards.length <
        player.pointsDistribution.piCards.length
      )
        mostPiPlayer = player;
      if (player.points < 17) {
        if (player.pointsDistribution.dymondTen == 1) player.points += 2;
        if (player.pointsDistribution.piTwo == 1) player.points++;
        player.points += player.pointsDistribution.APoints;
        player.points += player.pointsDistribution.birao;
      } else if (player.points == 19) {
        if (player.pointsDistribution.dymondTen == 1) player.points += 2;
      }
    }
    if (mostPiPlayer.points < 17) {
      mostCardsPlayer.points += 3;
      mostPiPlayer.points++;
    } else {
      if (mostCardsPlayer.points == 17 && mostPiPlayer.points == 17) {
        mostCardsPlayer.points += 3;
        mostPiPlayer.points++;
      }
      if (mostCardsPlayer == 18) {
        mostCardsPlayer.points += 3;
      }
      if (mostPiPlayer == 20) {
        mostPiPlayer.points++;
      }
    }
    for (let i = 0; i < players.length - 1; i++) {
      [players[i], players[i + 1]] = [players[i + 1], players[i]];
    }
    band=true
    console.log(players);
  }
  createHtmlCardElement(cardObject) {
    let selectActionHeight = 100;
    let card = document.createElement("div");
    card.className = "gameCard";
    card.id = cardObject.name;
    card.style.backgroundImage = `url('${cardObject.img.url}')`;
    card.style.backgroundPositionX = `${cardObject.img.x}px`;
    card.style.backgroundPositionY = `${cardObject.img.y}px`;

    let selectAction = document.createElement("div");
    // selectAction.style.width = '100%';
    // selectAction.style.height = '100%';
    selectAction.className = "selectAction";
    // selectAction.style.position = "absolute";
    if (cardObject.symbol == "+" || cardObject.symbol == "-") {
      let id = card.id;
      let childCard;
      let parentCard = this.createHtmlCardElement(cardObject.formedCards[0]);
      let parentCard2 = parentCard;
      for (let i = 1; i < cardObject.formedCards.length; i++) {
        childCard = this.createHtmlCardElement(cardObject.formedCards[i]);
        parentCard.appendChild(childCard);
        selectActionHeight += 9;
        selectAction.style.height = `${selectActionHeight}%`;
        parentCard = childCard;
      }

      card = parentCard2;
      card.id = id;
    }
    selectAction.id = card.id;
    card.appendChild(selectAction);
    return card;
  }

  playerVerification(gameCard, player, playerCard) {
    if (gameCard.playStatus) {
      player.cards = player.cards.filter((playerCardItem) => {
        return playerCardItem.name != playerCard.name;
      });
      gameCards.playStatus = false;
      return true;
    }
    return false;
  }
  createPlayerStatisticContainerContent(
    playerStatisticContainer,
    detail,
    data
  ) {
    let detailElement = document.createElement("h4");
    detailElement.appendChild(document.createTextNode(detail));
    let dataElement = document.createElement("b");
    dataElement.style.color = "white";
    dataElement.appendChild(document.createTextNode(data));
    detailElement.appendChild(dataElement);

    playerStatisticContainer.appendChild(detailElement);
  }
  turnPlayer(players, limit, deckCards, playInfo, myId) {
    console.log(deckCards);
    turnLimit = limit;
    table.innerHTML = "";
    playerCardsContainer.innerHTML = "";
    if (playInfo.eventName == "startGame") {
      band=false
      deck.cards = deckCards;
      gameCards.cards = deck.dealCards();
      players.forEach((player) => {
        
        player.cards = deck.dealCards();
      });
    }
    document.querySelector(".numbersOfCards").innerHTML = deck.numbersOfCards;

    console.log(players);
    if (turn == limit) turn = 0;
   
    console.log(turn);
    console.log(players[turn]);
    players[myId].cards.forEach((playerCard, i) => {
      console.log("linea: 474");
      selectCard = false;
      let card = this.createHtmlCardElement(playerCard);
      console.log(playerCard);
      playerCardsContainer.appendChild(card);

      
    });

    console.log(players);

    players.forEach((player) => {
      player.turn=false
      player.resetPointsDistribution();
      player.countCards();
      let playersContainer =
        player.id % 2 == 0 ? playersContainer2 : playersContainer1;
      var playerStatisticContainer =
        player.id % 2 == 0
          ? playersContainer2.querySelector(
              `.playerStatisticContainer${player.id}`
            )
          : playersContainer1.querySelector(
              `.playerStatisticContainer${player.id}`
            );
      let playerStatisticContent = document.createElement("div");
      playerStatisticContent.className = "playerStatisticContent";
      let fullPlayerStatisticContent = document.createElement("div");
      fullPlayerStatisticContent.className = "playerStatisticContent";
      let imgPlayer = new Image();

      this.createPlayerStatisticContainerContent(
        playerStatisticContent,
        "",
        player.nickName
      );

      this.createPlayerStatisticContainerContent(
        playerStatisticContent,
        "Points: ",
        player.points
      );
      playerStatisticContainer.innerHTML = "";
      imgPlayer.src = "src/img/jj.jpg";
      playerStatisticContainer.appendChild(imgPlayer);
      playerStatisticContainer.appendChild(playerStatisticContent);

      playerStatisticContainer.addEventListener("mouseover", (e) => {
        console.log("sdf");

        this.createPlayerStatisticContainerContent(
          fullPlayerStatisticContent,
          "Total de cartas: ",
          player.pointsDistribution.totalCards
        );
        this.createPlayerStatisticContainerContent(
          fullPlayerStatisticContent,
          "cartas A: ",
          player.pointsDistribution.APoints
        );
        this.createPlayerStatisticContainerContent(
          fullPlayerStatisticContent,
          "Cartas de Pi: ",
          player.pointsDistribution.piCards.length
        );
        this.createPlayerStatisticContainerContent(
          fullPlayerStatisticContent,
          "10 de diamante: ",
          player.pointsDistribution.dymondTen
        );
        this.createPlayerStatisticContainerContent(
          fullPlayerStatisticContent,
          "Birao: ",
          player.pointsDistribution.birao
        );
        this.createPlayerStatisticContainerContent(
          fullPlayerStatisticContent,
          "2 de Pi: ",
          player.pointsDistribution.piTwo
        );
        playersContainer.querySelector(".pointsDistribution").innerHTML = "";
        playersContainer
          .querySelector(".pointsDistribution")
          .appendChild(fullPlayerStatisticContent);
      });

      playerStatisticContainer.addEventListener("mouseout", () => {
        fullPlayerStatisticContent.innerHTML = "";
      });

      if (players[turn].id == player.id) {
        document.querySelector(
          `.playerStatisticContainer${player.id}`
        ).style.background = "#666";
      } else
        document.querySelector(
          `.playerStatisticContainer${player.id}`
        ).style.background = "#262421";
    });
    players[turn].turn = true
    gameCards.cards.forEach((gameCard, i) => {
      table.appendChild(this.createHtmlCardElement(gameCard));
    });
    console.log(players[turn]);

    if (plays >= 4 * players.length) {
      plays = 0;
      if (deck.haveCards) {
        document.querySelector(".numbersOfCards").innerHTML =
          deck.numbersOfCards;
        players.forEach((player) => {
          player.cards = deck.dealCards();
        });
        document.querySelector(".numbersOfCards").innerHTML =
          deck.numbersOfCards;
          this.turnPlayer(players, limit, deckCards, {
            eventName: "",
            info: 0,
          }, myId);
          
          
      } else {
        players.forEach((player) => {
          if (player.nickName == lastPlayerLootName) {
            player.accumulatedCards = player.accumulatedCards.concat(
              gameCards.cards
            );
            gameCards.cards = [];
          }
          player.resetPointsDistribution();
          player.countCards();
        });
        this.updatePoints(players);
        if (this.evaluateWinner(players)) {
          return;
        } else {
          
          players.forEach((player) => {
            player.resetPointsDistribution();
            player.pointsDistribution.birao = 0;
            player.accumulatedCards = [];
            
          });

          for (let i = 0; i < players.length - 1; i++) {
            for (let e = 1; e < players.lenght - 1; e++) {
              [players[i], players[e]] = [players[e], players[i]];
            }
          }
          
          
        }
        this.turnPlayer(players, limit, deckCards, {
          eventName: "",
          info: 0,
        }, myId);
        
      }
      
      
      
      
    }
    console.log(players[0]);
    //documents events
    
      if (playInfo.eventName == "dblClick") {
        console.log(playInfo.info);
        let playerCard;
  
        for (let card of players[turn].cards) {
          console.log(card.name);
          if (card.name == playInfo.info) playerCard = card;
        }
        players[turn].dropCard(gameCards, playerCard);
        console.log(playerCard);
        if (this.playerVerification(gameCards, players[turn], playerCard)) {
          turn++;
          previousTurn = turn - 1;
          plays++;
          console.log(turn, limit);
         this.turnPlayer(players, limit, deckCards, { eventName: "", info: 0 }, myId);
        }
        selectedCards=[]
      }
      
      if(playInfo.eventName=="keyup") {
        
          playInfo.info.selectedCardsId.forEach((selectedCardId)=>{
            selectedCards.push(
              gameCards.cards.find((gameCard)=>{
                return selectedCardId==gameCard.name;
              })
            )
          })
        console.log(selectedCards)
        if (selectedCards.length>0) {
          console.log(" robao");
          if (playInfo.info.key == "x") {
            players[turn].formCards(gameCards, selectedCards, globalPlayerCard);
            if (
              this.playerVerification(
                gameCards,
                players[turn],
                globalPlayerCard
              )
            ) {
              turn++;
              previousTurn = turn - 1;
              plays++;
              selectedCards=[]
             this.turnPlayer(players, limit, deckCards, {
                eventName: "",
                info: 0,
              }, myId);
            }
            
            this.resetSelection( table);
          }
          if (playInfo.info.key == "a") {
            players[turn].blockA(gameCards, globalPlayerCard);
            if (
              this.playerVerification(
                gameCards,
                players[turn],
                globalPlayerCard
              )
            ) {
              turn++;
              previousTurn = turn - 1;
              plays++;
              selectedCards=[]
              this.turnPlayer(players, limit, deckCards, {
                eventName: "",
                info: 0,
              }, myId);
            }
            this.resetSelection(table);
           
          }
          
          if (playInfo.info.key == "z") {
            lastPlayerLootName = players[turn].nickName;
            console.log(selectedCards)
            players[turn].lootCards(gameCards, selectedCards, globalPlayerCard);
            if (
              this.playerVerification(
                gameCards,
                players[turn],
                globalPlayerCard
              )
            ) {
              if (
                players[turn].pointsDistribution.birao > 0 &&
                players[previousTurn].pointsDistribution.birao > 0
              ) {
                players[previousTurn].pointsDistribution.birao--;
                players[turn].pointsDistribution.birao--;
              }
              turn++;
              previousTurn = turn - 1;
              plays++;
              selectedCards=[]
              this.turnPlayer(players, limit, deckCards, {
                eventName: "",
                info: 0,
              },myId);
            }
  
            this.resetSelection(table);
            
            
            console.log(selectedCards);
          }
          if (playInfo.info.key == "c") {
            players[turn].match(gameCards, selectedCards, globalPlayerCard);
            if (
              this.playerVerification(
                gameCards,
                players[turn],
                globalPlayerCard
              )
            ) {
              turn++;
              previousTurn = turn - 1;
              plays++;
              selectedCards=[]
              this.turnPlayer(players, limit, deckCards, {
                eventName: "",
                info: 0,
              }, myId);
              
            }
            this.resetSelection( table);
            
          }
        }
        
      }
      if(playInfo.eventName=="click"){
        playerCardsContainer.childNodes.forEach((childNode) => {
          if (childNode.id == playInfo.info.id) {
            childNode.childNodes[0].style.background = "blue";
          } else childNode.childNodes[0].style.background = "none";
        });
        table.childNodes.forEach((childNode) => {
          childNode.childNodes[0].style.background = "none";
        });
        globalPlayerCard = players[turn].cards.find((card)=>{
          return playInfo.info.id==card.name
        });
        globalCardObject = document.getElementById(`${playInfo.info.id}`)
        selectedCards=[]
      }
        selectedCards=[]
    return {cards: deck.haveCards, band: band}
      
      
      
  }
  resetSelection( table) {
    selectCard = false;
    table.childNodes.forEach((childNode) => {
      childNode
        .querySelectorAll(".selectAction")
        .forEach((selectActionItem) => {
          selectActionItem.style.background = "none";
        });
      console.log(childNode);
    });

    
  }
  displayWelcome() {
    alert("Bienvenido a Veintiuno");
  }
}
//tutorialButtons
