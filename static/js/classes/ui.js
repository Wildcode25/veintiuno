//Variables declaration
let selectCard = false;
let deck = new Deck();
let plays = 0;
let selectedCards = [];

//User intarface
class Ui {
  //Start the game
  displayGame(players) {
    const table = document.querySelector("#table1");
    console.log(table);
    const playerCardsContainer = document.querySelector(".playerCardContainer");
    const playersContainer1 = document.querySelector(".playerContainer1");
    const playersContainer2 = document.querySelector(".playerContainer2");
    const tutorialButtons = document.querySelectorAll(".tutorialButton");
    let globalCardObject;
    let limit = players.length - 1;
    let turn = 0;
    let previousTurn = players.length - 1;
    let globalPlayerCard;
    let lastPlayerLootName = "";
    let gameCards = {
      cards: [],
      playStatus: false,
    };
    console.log(gameCards.cards.length);
    gameCards.cards = deck.dealCards();
    players.forEach((player) => {
      player.cards = deck.dealCards();
    });
    //Call the function sprintplayer
    turnPlayer();

    function evaluateWinner(players) {
      for (let player of players) {
        if (player.points >= 21) {
          return true;
        }
      }
      return false;
    }
    function updatePoints(players) {
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
    }
    function playerVerification(gameCard, player, playerCard) {
      if (gameCard.playStatus) {
        player.cards = player.cards.filter((playerCardItem) => {
          return playerCardItem.name != playerCard.name;
        });
        gameCards.playStatus = false;
        return true;
      }
      return false;
    }
    function createPlayerStatisticContainerContent(
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
    function turnPlayer() {
      document.querySelector(".numbersOfCards").innerHTML = deck.numbersOfCards;

      if (turn > limit) turn = 0;
      console.log("turno: " + turn);
      table.innerHTML = "";
      playerCardsContainer.innerHTML = "";
      players.forEach((player) => {
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

        createPlayerStatisticContainerContent(
          playerStatisticContent,
          "",
          player.nickName
        );

        createPlayerStatisticContainerContent(
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

          createPlayerStatisticContainerContent(
            fullPlayerStatisticContent,
            "Total de cartas: ",
            player.pointsDistribution.totalCards
          );
          createPlayerStatisticContainerContent(
            fullPlayerStatisticContent,
            "cartas A: ",
            player.pointsDistribution.APoints
          );
          createPlayerStatisticContainerContent(
            fullPlayerStatisticContent,
            "Cartas de Pi: ",
            player.pointsDistribution.piCards.length
          );
          createPlayerStatisticContainerContent(
            fullPlayerStatisticContent,
            "10 de diamante: ",
            player.pointsDistribution.dymondTen
          );
          createPlayerStatisticContainerContent(
            fullPlayerStatisticContent,
            "Birao: ",
            player.pointsDistribution.birao
          );
          createPlayerStatisticContainerContent(
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
      gameCards.cards.forEach((gameCard, i) => {
        table.appendChild(createHtmlCardElement(gameCard));
      });
      if (plays >= 4 * players.length) {
        plays = 0;
        if (deck.haveCards) {
          document.querySelector(".numbersOfCards").innerHTML = deck.numbersOfCards;
          players.forEach((player) => {
            player.cards = deck.dealCards();
          });
          document.querySelector(".numbersOfCards").innerHTML = deck.numbersOfCards;

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
          updatePoints(players);
          if (evaluateWinner(players)) {
            return;
          } else {
            deck = new Deck();
            gameCards.cards = deck.dealCards();
            players.forEach((player) => {
              player.resetPointsDistribution();
              player.pointsDistribution.birao = 0;
              player.accumulatedCards = [];
              player.cards = deck.dealCards();
            });

            for (let i = 0; i < players.length - 1; i++) {
              for (let e = 1; e < players.lenght - 1; e++) {
                [players[i], players[e]] = [players[e], players[i]];
              }
            }
          }
          turnPlayer();
        }
      }
      players[turn].cards.forEach((playerCard, i) => {
        selectCard = false;
        let card = createHtmlCardElement(playerCard);
        playerCardsContainer.appendChild(card);
        card.addEventListener("dblclick", (e) => {
          console.log(e);
          players[turn].dropCard(gameCards, playerCard);
          if (playerVerification(gameCards, players[turn], playerCard)) {
            turn++;
            previousTurn = turn - 1;
            plays++;
            turnPlayer();
          }
        });
        card.addEventListener("click", (e) => {
          playerCardsContainer.childNodes.forEach((childNode) => {
            if (childNode.id == card.id) {
              childNode.childNodes[0].style.background = "blue";
            } else childNode.childNodes[0].style.background = "none";
          });
          table.childNodes.forEach((childNode) => {
            childNode.childNodes[0].style.background = "none";
          });
          selectCard = true;
          selectedCards = [];
          globalPlayerCard = playerCard;
          globalCardObject = card;
        });
      });
    }
    //Table listeners
    table.addEventListener("click", (e) => {
      if (selectCard) {
        if (e.target.className == "selectAction") {
          if (e.target.style.background != "blue") {
            e.target.style.background = "blue";
            for (let gameCard of gameCards.cards) {
              if (e.target.parentNode.id === gameCard.name) {
                selectedCards.push(gameCard);
                break;
              }
            }
          } else {
            e.target.style.background = "none";
            selectedCards = selectedCards.filter((selectCard) => {
              return selectCard.name != e.target.parentNode.id;
            });
          }
        }
        console.log(selectedCards);
      }
    });
    function createHtmlCardElement(cardObject) {
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
        let parentCard = createHtmlCardElement(cardObject.formedCards[0]);
        let parentCard2 = parentCard;
        for (let i = 1; i < cardObject.formedCards.length; i++) {
          childCard = createHtmlCardElement(cardObject.formedCards[i]);
          parentCard.appendChild(childCard);
          selectActionHeight += 9;
          selectAction.style.height = `${selectActionHeight}%`;
          parentCard = childCard;
        }

        card = parentCard2;
        card.id = id;
      }
      card.appendChild(selectAction);
      return card;
    }

    //Doucment events
    document.addEventListener("keyup", (e) => {
      if (selectCard) {
        if (e.key == "x") {
          players[turn].formCards(gameCards, selectedCards, globalPlayerCard);
          if (playerVerification(gameCards, players[turn], globalPlayerCard)) {
            turn++;
            previousTurn = turn - 1;
            plays++;

            turnPlayer();
          }
          this.resetSelection(globalCardObject, table);
        }
        if (e.key == "a") {
          players[turn].blockA(gameCards, globalPlayerCard);
          if (playerVerification(gameCards, players[turn], globalPlayerCard)) {
            turn++;
            previousTurn = turn - 1;
            plays++;
            turnPlayer();
          }
          this.resetSelection(globalCardObject, table);
        }
        if (e.key == "z") {
          console.log(turn);
          lastPlayerLootName = players[turn].nickName;
          players[turn].lootCards(gameCards, selectedCards, globalPlayerCard);
          if (playerVerification(gameCards, players[turn], globalPlayerCard)) {
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
            turnPlayer();
          }

          this.resetSelection(globalCardObject, table);

          console.log(selectedCards);
        }
        if (e.key == "c") {
          players[turn].match(gameCards, selectedCards, globalPlayerCard);
          if (playerVerification(gameCards, players[turn], globalPlayerCard)) {
            turn++;
            previousTurn = turn - 1;
            plays++;
            turnPlayer();
          }
          this.resetSelection(globalCardObject, table);
        }
      }
    });

    //tutorialButtons
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
    addTutorialButtonsEvents(
      document.querySelector(".left"),
      document.querySelector(".right"),
      3,
      1
    );
    addTutorialButtonsEvents(
      document.querySelector(".left2"),
      document.querySelector(".right2"),
      5,
      2
    );

    function addTutorialButtonsEvents(left, right, limit, section) {
      let l = limit;
      let r = 2;
      left.addEventListener("click", () => {
        console.log(l);
        left.href = `#carrouselCard${section}${l}`;
        right.href = `#carrouselCard${section}${r}`;
        l = l <= 1 ? limit : l - 1;

        r = r <= 1 ? limit : r - 1;
      });

      right.addEventListener("click", () => {
        console.log(r);
        console.log(l);
        left.href = `#carrouselCard${section}${l}`;
        right.href = `#carrouselCard${section}${r}`;
        l = l >= limit ? 1 : l + 1;

        r = r >= limit ? 1 : r + 1;
      });
    }
  }
  getPlayerCard(cardId, playerCards) {
    playerCards.forEach((playerCard) => {
      if (cardId == playerCard.name) {
        return playerCard;
      }
    });
  }
  resetSelection(globalCardObject, table) {
    selectCard = false;
    globalCardObject.childNodes[0].style.background = "none";
    table.childNodes.forEach((childNode) => {
      childNode
        .querySelectorAll(".selectAction")
        .forEach((selectActionItem) => {
          selectActionItem.style.background = "none";
        });
      console.log(childNode);
    });

    selectedCards = [];
  }
  displayWelcome() {
    alert("Bienvenido a Veintiuno");
  }
}
//tutorialButtons
