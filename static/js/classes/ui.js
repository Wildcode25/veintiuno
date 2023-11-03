import { Player } from "./player";
import { Deck } from "./deck";
//Variables declaration
const newDeck = new Deck();
let selectCard=false
let deck = newDeck.getDeck();
let plays = 0;
let selectedCards=[]
const table = document.querySelector(".table");
const playerCardsContainer = document.querySelector(".playerCardContainer");
const playersContainer = document.querySelector(".playerContainer");

//User intarface
export class Ui {
  //Start the game
  displayGame(players) {
    let gameCards = {
      cards: [],
      playStatus: false,
    };
    gameCards.cards = deck.getCards(deck.cards);
    players.forEach((player) => {
      player.cards = deck.getCards(deck.cards);
    });
    //Call the function sprintplayer
    turnPlayer(0, players.length);

    function evaluateWinner(players) {
      for (let player of players) {
        if (player.points >= 21) {
          return true;
        }
      }
      return false;
    }
    function updatePoints(players) {
      console.log(players);
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
      detailElement.appendChild(document.createTextNode(detail + ": "));
      let dataElement = document.createElement("b");
      dataElement.style.color = "#e55";
      dataElement.appendChild(document.createTextNode(data));
      detailElement.appendChild(dataElement);
      playerStatisticContainer.appendChild(detailElement);
    }
    function turnPlayer(turn, limit) {
      console.log("Baraja: " + deck.cards.length);
      let newTurn = 0;
      table.innerHTML = "";
      playerCardsContainer.innerHTML = "";
      playersContainer.innerHTML = "";
      players.forEach((player) => {
        player.resetPointsDistribution();
        player.countCards();
        let playerStatisticContainer = document.createElement("div");
        playerStatisticContainer.className = "playerStatisticContainer";
        createPlayerStatisticContainerContent(
          playerStatisticContainer,
          "Nombre",
          player.nickName
        );
        createPlayerStatisticContainerContent(
          playerStatisticContainer,
          "Total de cartas",
          player.pointsDistribution.totalCards
        );
        createPlayerStatisticContainerContent(
          playerStatisticContainer,
          "cartas A",
          player.pointsDistribution.APoints
        );
        createPlayerStatisticContainerContent(
          playerStatisticContainer,
          "Cartas de Pi",
          player.pointsDistribution.piCards.length
        );
        createPlayerStatisticContainerContent(
          playerStatisticContainer,
          "10 de diamante",
          player.pointsDistribution.dymondTen
        );
        createPlayerStatisticContainerContent(
          playerStatisticContainer,
          "2 de Pi",
          player.pointsDistribution.piTwo
        );
        createPlayerStatisticContainerContent(
          playerStatisticContainer,
          "Puntos",
          player.points
        );
        if (player.nickName == players[turn].nickName) {
          playerStatisticContainer.style.background = "#9c9";
        }
        playersContainer.appendChild(playerStatisticContainer);
      });
      gameCards.cards.forEach((e, i) => {
        let card = document.createElement("div");
        card.className = "gameCard";
        card.style.color = e.color;
        let nameCard = document.createTextNode(e.name);
        card.appendChild(nameCard);
        table.appendChild(card);
      });
      if (plays >= 4 * players.length) {
        plays = 0;
        if (deck.cards.length > 0)
          players.forEach((player) => {
            player.cards = deck.getCards(deck.cards);
          });
        else {
          updatePoints(players);
          if (evaluateWinner(players)) {
            return;
          } else {
            deck = newDeck.getDeck();
            players.forEach((player) => {
              player.resetPointsDistribution();
            });
          }
        }
      }
      players[turn].cards.forEach((playerCard, i) => {
        selectCard = false;
        let card = document.createElement("div");
        card.className = "gameCard";
        card.style.color = playerCard.color;
        let nameCard = document.createTextNode(playerCard.name);
        card.appendChild(nameCard);
        playerCardsContainer.appendChild(card);
        card.addEventListener("dblclick", (e) => {
          console.log(e);
          players[turn].dropCard(gameCards, playerCard);
          playerVerification(gameCards, players[turn], playerCard);
          newTurn = turn >= limit - 1 ? 0 : turn + 1;
          plays++;
          turnPlayer(newTurn, limit);
        });
        card.addEventListener("click", (e) => {
          selectCard = true;
          selectedCards = []
          card.style.background = "gray";
          table.childNodes.forEach((childNode, index) => {
            
              let selectCards = (e) => {
                if (selectCard) {
                childNode.style.background = "gray";
                selectedCards.push(gameCards.cards[index]);
                console.log(selectedCards);
                childNode.removeEventListener("click", selectCards);
                }
              };
              childNode.addEventListener("click", selectCards);
            
          });

          let lootCardsAction = (e) => {
            if (selectCard) {
              e.preventDefault();
              players[turn].lootCards(gameCards, selectedCards, playerCard);

              if (playerVerification(gameCards, players[turn], playerCard)) {
                newTurn = turn >= limit - 1 ? 0 : turn + 1;
                plays++;
                card.removeEventListener("click", lootCardsAction);
                turnPlayer(newTurn, limit);
              }
            }
            card.style.background = "white";
            table.childNodes.forEach((childNode) => {
              childNode.style.background = "white";
            });
            selectCard = false;
            
              table.removeEventListener("contextmenu", lootCardsAction);
              console.log(selectedCards);
          };
          table.addEventListener("contextmenu", lootCardsAction);
          table.addEventListener("click", (e) => {
            if (e.altKey) {
              if (selectCard) {
                players[turn].groupCards(gameCards, selectedCards, playerCard);
                if (playerVerification(gameCards, players[turn], playerCard)) {
                  newTurn = turn >= limit - 1 ? 0 : turn + 1;
                  plays++;
                  turnPlayer(newTurn, limit);
                }
              }
              card.style.background = "white";
                table.childNodes.forEach((childNode) => {
                childNode.style.background = "white";
                });
              selectCard = false;
            }
          });
          table.addEventListener("dblclick", (e) => {
            if (selectCard) {
              players[turn].match(gameCards, selectedCards, playerCard);

              if (playerVerification(gameCards, players[turn], playerCard)) {
                newTurn = turn >= limit - 1 ? 0 : turn + 1;
                plays++;
                turnPlayer(newTurn, limit);
              }
              
            }
            selectCard = false;
              card.style.background = "white";
              table.childNodes.forEach((childNode) => {
                childNode.style.background = "white";
              });
          });
        });
      });
    }
  }

  askPlayerNames() {
    let players = [];
    let limit;
    let op = 0;
    while (op != 1 && op != 2 && op != 3) {
      op = parseInt(
        prompt("1. Dos jugadores 2. Tres jugadores 3. Cuatro jugadores")
      );
      switch (op) {
        case 1:
          limit = 2;
          break;
        case 2:
          limit = 3;
          break;
        case 3:
          limit = 4;
          break;
        default:
          alert("Opcion no valida");
      }
    }

    for (let i = 0; i < limit; i++) {
      let player = new Player(prompt(`Nombre de jugador ${i + 1}`));
      players.push(player);
    }
    console.log(players);
    return players;
  }
  

  displayWelcome() {
    alert("Bienvenido a Veintiuno");
  }
}
