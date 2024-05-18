let players = [];
let ui = new Ui();
let deckCards;
let socket;
let myIndex;
let myId = "";
let myRoom;
let selectedCardsId = [];
let selectCard = false;
let url =
  window.location.hostname == "localhost"
    ? window.location.hostname + ":3000"
    : window.location.hostname;
export class Game {
  constructor() {}
  start() {
    socket = io.connect(url, { forceNew: true });

    socket.emit("joined");
    socket.on("my_id", (message) => {
      myIndex = message.index;
      myRoom = message.room;
      myId = message.id;
      console.log(myIndex);
    });
    socket.on("new_player", (playersData) => {
      if (players.length < myRoom) {
        players = playersData
          .filter((playerData) => {
            return playerData.room == myRoom;
          })
          .map((playerData, index) => {
            return new Player(
              playerData.nickName,
              playerData.id,
              playerData.room
            );
          });
        console.log(players[0]);
        socket.emit("load_cards", {
          deckCards: ui.displayGame(players, players.length),
          room: players[myIndex].room,
        });
      }
    });
    socket.on("full_room", () => {
      ui.showFullRoomMessage();
    });
    socket.on("disconnected_player", (playerData) => {
      if (playerData.room == players[myIndex].room) {
        ui.disconnectedPlayerMessage(
          playerData.nickName,
          players[myIndex].nickName,
          players[myIndex].room
        );
        socket.disconnect();
      }
    });

    socket.on("update_game", (message) => {
      if (players[myIndex].room == message.room) {
        document.querySelector(".preload").style.visibility = "hidden";
        console.log(players);
        ui.turnPlayer(
          players,
          players.length,
          message.deckCards,
          {
            eventName: "startGame",
            info: 0,
          },
          myIndex
        );
      }
    });
    socket.on("deckCards_loadeds", (deckCardsData) => {
      if (players[myIndex].room == deckCardsData.room) {
        deckCards = deckCardsData.deckCards;
      }
    });
    socket.on("new_play_server", (playInfo) => {
      let band = true;
      if (playInfo.room == players[myIndex].room) {
        band = ui.turnPlayer(
          players,
          players.length,
          deckCards,
          playInfo,
          myIndex
        );
        if (!band) {
          ui.rotatePlayers(players);
          myIndex = players.findIndex((player) => player.id == myId);
          console.log(players);
          socket.emit("load_cards", {
            deckCards: ui.displayGame(players, players.length),
            room: players[myIndex].room,
          });

          ui.turnPlayer(
            players,
            players.length,
            deckCards,
            {
              eventName: "startGame",
              info: 0,
            },
            myIndex
          );
        }
        selectedCardsId = [];
      }

      console.log("este es band: " + band);
    });

    // let playersPlaces = this.updateStatistics(players);

    // playersPlaces = this.updateStatistics(players)

    console.log("Fin del juego");
    // playersPlaces.forEach((e,i)=>{
    //   console.log(`${i+1}. ${e}`)

    // })
  }
}
// playerCardsContainer.addEventListener("dblclick", (e) => {
//   if (e.target.className == "selectAction" && players[myIndex].turn) {
//     console.log("dblclick");
//     socket.emit("new_play", { eventName: "dblClick", info: e.target.id , room: players[myIndex].room});
//   }
// });
playerCardsContainer.addEventListener("click", (e) => {
  console.log(players[myIndex]);
  if (e.target.className == "selectAction") {
    if (players[myIndex].turn) {
      selectCard = true;
      socket.emit("new_play", {
        eventName: "click",
        info: { id: e.target.id, object: e.target },
        room: players[myIndex].room,
      });
    }
  }
});
document.addEventListener("keyup", (e) => {
  socket.emit("new_play", {
    eventName: "keyup",
    info: { key: e.key, selectedCardsId: selectedCardsId },
    room: players[myIndex].room,
  });
  selectCard = false;
});
table.addEventListener("click", (e) => {
  if (selectCard && players[myIndex].turn) {
    if (e.target.className == "selectAction") {
      if (e.target.style.background != "blue") {
        e.target.style.background = "blue";
        selectedCardsId.push(e.target.id);
      } else {
        e.target.style.background = "none";
        selectedCardsId = selectedCardsId.filter((selectCard) => {
          return selectCard != e.target.id;
        });
      }
    }
  }
});
