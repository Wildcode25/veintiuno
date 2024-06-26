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
const tableCards = {
  cards: [],
  playStatus: false,
};
let globalCardObject;
let previousTurn;
let globalPlayerCard;
let deck = new Deck();
let band = false;
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

    players.forEach((player, index) => {
      var playerStatisticContainer = document.querySelector(
        `.playerStatisticContainer${index + 1}`
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
    

  }

  get getNewCards(){
    if (!deck.haveCards) deck.createCards();
    return deck.cards;
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
    this.addTutorialAnimation()
  }
  addTutorialAnimation(){

    let dropCanvas = document.querySelector('.dropCanvas').getContext('2d');
    let lootCanvas = document.querySelector('.lootCanvas').getContext('2d')
    let formCanvas = document.querySelector('.formCanvas').getContext('2d');
    let matchCanvas = document.querySelector('.matchCanvas').getContext('2d');
    let blockCanvas = document.querySelector('.blockCanvas').getContext('2d');

    let dropFrames=this.getAnimationFrames('../../src/img/tutorial/controles/drop',3 );
    let lootFrames=this.getAnimationFrames('../../src/img/tutorial/controles/loot',4);
    let formFrames=this.getAnimationFrames('../../src/img/tutorial/controles/form',9);
    let matchFrames=this.getAnimationFrames('../../src/img/tutorial/controles/match',10);
    let blockFrames=this.getAnimationFrames('../../src/img/tutorial/controles/block',7);

    this.drawAnimation(dropCanvas, dropFrames, 3);
    this.drawAnimation(lootCanvas, lootFrames, 4);
    this.drawAnimation(formCanvas, formFrames, 9);
    this.drawAnimation(matchCanvas, matchFrames, 10);
    this.drawAnimation(blockCanvas, blockFrames, 7);
  

  }
  getAnimationFrames(baseRoute, limit){
    let framesArray=[];
    for(let i=1; i<=limit; i++){
      const frame = new Image();
      frame.src=`${baseRoute}/${i}.png`;
      framesArray.push(frame)
    }
    return framesArray;
  }
  drawAnimation(canvas,framesArray, limit){
    let i =1;
    setInterval(()=>{
    if(i>=limit){
        i=1;
    }else{
        canvas.drawImage(framesArray[i], -350, -90);   
        i++     
    }
    }, 1000)
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
    console.log(players);
    band = false;
  }

  createHtmlCardElement(cardObject) {
    let cardBlueShadingHeight = 100;
    let card = document.createElement("div");
    card.className = "gameCard";
    card.id = cardObject.name;
    card.style.backgroundImage = `url('${cardObject.img.url}')`;
    card.style.backgroundPositionX = `${cardObject.img.x}px`;
    card.style.backgroundPositionY = `${cardObject.img.y}px`;

    let cardBlueShading = document.createElement("div");
    cardBlueShading.className = "selectAction";
  
    if (cardObject.symbol == "+" || cardObject.symbol == "-") {
      let id = card.id;
      let childCard;
      let parentCard = this.createHtmlCardElement(cardObject.formedCards[0]);
      let parentCard2 = parentCard;
      for (let i = 1; i < cardObject.formedCards.length; i++) {
        childCard = this.createHtmlCardElement(cardObject.formedCards[i]);
        parentCard.appendChild(childCard);
        cardBlueShadingHeight += 9;
        cardBlueShading.style.height = `${cardBlueShadingHeight}%`;
        parentCard = childCard;
      }

      card = parentCard2;
      card.id = id;
    }
    cardBlueShading.id = card.id;
    card.appendChild(cardBlueShading);
    return card;
  }

  playerVerification(tableCard, player, playerCard) {
    if (tableCard.playStatus) {
      player.setPlayerCards(playerCard)
      tableCards.playStatus = false;
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
  updategame(players, limit, deckCards, playInfo, myId) {
    console.log(players);
    turnLimit = limit;
    table.innerHTML = "";
    playerCardsContainer.innerHTML = "";
    if (playInfo.eventName == "startGame") {
      deck.cards = deckCards;
      tableCards.cards = deck.dealCards();
      players.forEach((player) => {
        player.cards = deck.dealCards();
      });
      band = true;
      turn=0;
    }
    document.querySelector(".numbersOfCards").innerHTML = deck.numbersOfCards;

    console.log(players);
    if (turn == limit) turn = 0;

    players[myId].cards.forEach((playerCard, i) => {
      console.log("linea: 474");
      selectCard = false;
      let card = this.createHtmlCardElement(playerCard);
      console.log(playerCard);
      playerCardsContainer.appendChild(card);
    });

    console.log(players);

    players.forEach((player, index) => {
      player.resetPointsDistribution();
      player.countCards();
      player.turn = false;
      let playersContainer =
        index % 2 == 0 ? playersContainer1 : playersContainer2;
      var playerStatisticContainer = document.querySelector(
        `.playerStatisticContainer${index + 1}`
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
          `.playerStatisticContainer${turn + 1}`
        ).style.background = "#666";
      } else
        document.querySelector(
          `.playerStatisticContainer${index + 1}`
        ).style.background = "#262421";
    });
    players[turn].turn = true;
    tableCards.cards.forEach((tableCard, index) => {
      table.appendChild(this.createHtmlCardElement(tableCard));
    });
    console.log(players[turn]);

    if (plays >= 4 * players.length) {
      plays = 0;
      if (deck.haveCards) {
        players.forEach((player) => {
          player.cards = deck.dealCards();
        });
        document.querySelector(".numbersOfCards").innerHTML =
          deck.numbersOfCards;
        this.updategame(
          players,
          limit,
          deckCards,
          {
            eventName: "",
            playData: 0,
          },
          myId
        );
      } else {
        players.forEach((player) => {
          if (player.nickName == lastPlayerLootName) {
            player.accumulatedCards = player.accumulatedCards.concat(
              tableCards.cards
            );
            tableCards.cards = [];
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
        }

        band = false;
      }
    }

    //documents events


    if (playInfo.eventName == "keyup") {
      playInfo.playData.selectedCardsId.forEach((selectedCardId) => {
        selectedCards.push(
          tableCards.cards.find((tableCard) => {
            return selectedCardId == tableCard.name;
          })
        );
      });

      console.log(selectedCards);
      if (playInfo.playData.key == "d") {
        console.log(playInfo.playData);
        let playerCard;

        players[turn].dropCard(tableCards, globalPlayerCard);
        
        if (this.playerVerification(tableCards, players[turn], globalPlayerCard)) {
          turn++;
          previousTurn = turn - 1;
          plays++;
          console.log(turn, limit);
          this.updategame(
            players,
            limit,
            deckCards,
            { eventName: "", playData: 0 },
            myId
          );
        }

        selectedCards = [];
      }
      if (selectedCards.length > 0) {
        console.log(" robao");
        
        if (playInfo.playData.key == "x") {
          players[turn].formCards(tableCards, selectedCards, globalPlayerCard);
          if (
            this.playerVerification(tableCards, players[turn], globalPlayerCard)
          ) {
            turn++;
            previousTurn = turn - 1;
            plays++;
            selectedCards = [];
            this.updategame(
              players,
              limit,
              deckCards,
              {
                eventName: "",
                playData: 0,
              },
              myId
            );
          }

          this.resetSelection(table);
        }
        if (playInfo.playData.key == "a") {
          players[turn].blockA(tableCards, globalPlayerCard);
          if (
            this.playerVerification(tableCards, players[turn], globalPlayerCard)
          ) {
            turn++;
            previousTurn = turn - 1;
            plays++;
            selectedCards = [];
            this.updategame(
              players,
              limit,
              deckCards,
              {
                eventName: "",
                playData: 0,
              },
              myId
            );
          }
          this.resetSelection(table);
        }

        if (playInfo.playData.key == "z") {
          lastPlayerLootName = players[turn].nickName;
          console.log(selectedCards);
          players[turn].lootCards(tableCards, selectedCards, globalPlayerCard);
          if (
            this.playerVerification(tableCards, players[turn], globalPlayerCard)
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
            selectedCards = [];
            this.updategame(
              players,
              limit,
              deckCards,
              {
                eventName: "",
                playData: 0,
              },
              myId
            );
          }
          this.resetSelection(table);

          console.log(selectedCards);
        }
        if (playInfo.playData.key == "c") {
          players[turn].match(tableCards, selectedCards, globalPlayerCard);
          if (
            this.playerVerification(tableCards, players[turn], globalPlayerCard)
          ) {
            turn++;
            previousTurn = turn - 1;
            plays++;
            selectedCards = [];
            this.updategame(
              players,
              limit,
              deckCards,
              {
                eventName: "",
                playData: 0,
              },
              myId
            );
          }
          this.resetSelection(table);
        }
      }
    }
    if (playInfo.eventName == "click") {
      playerCardsContainer.childNodes.forEach((childNode) => {
        if (childNode.id == playInfo.playData.id) {
          childNode.childNodes[0].style.background = "blue";
        } else childNode.childNodes[0].style.background = "none";
      });
      table.childNodes.forEach((childNode) => {
        childNode.childNodes[0].style.background = "none";
      });
      globalPlayerCard = players[turn].cards.find((card) => {
        return playInfo.playData.id == card.name;
      });
      globalCardObject = document.getElementById(`${playInfo.playData.id}`);
      selectedCards = [];
    }
    selectedCards = [];
    return band;
  }
 
  showErrorMessage(text) {
    table.innerHTML = "";
    let message = document.createElement("div");
    message.className = "fullRoomMessage";
    message.appendChild(document.createTextNode(text));
    table.appendChild(message);
  }
  disconnectedPlayerMessage(disconnectedPlayer, playerNickname, limitPlayers) {
    let table = document.querySelector(".table");
    table.innerHTML = "";
    let preload = document.createElement("div");
    preload.className = "preload";
    preload.style.visibility = "visible";
    preload.style.padding = "50%";
    preload.style.justifyContent = "end";
    preload.style.gap = "10px";
    let message = document.createElement("h3");
    let button = document.createElement("a");
    button.className = "button";
    button.href = `/game?nickName=${playerNickname}&&limit=${limitPlayers}`;
    button.appendChild(document.createTextNode("Buscar otra partida"));
    message.innerHTML = `${disconnectedPlayer} ha salido de la partida`;
    preload.innerHTML = "";
    table.appendChild(preload);
    preload.appendChild(message);
    preload.appendChild(button);
  }
  rotatePlayers(players) {
    for (let i = 0; i < players.length - 1; i++) {
      for (let e = 1; e < players.lenght - 1; e++) {
        [players[i], players[e]] = [players[e], players[i]];
      }
    }
  }
  resetSelection(table) {
    selectCard = false;
    table.childNodes.forEach((childNode) => {
      childNode
        .querySelectorAll(".cardBlueShading")
        .forEach((cardBlueShadingItem) => {
          cardBlueShadingItem.style.background = "none";
        });
      console.log(childNode);
    });
  }
 
}
//tutorialButtons
