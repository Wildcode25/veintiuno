let players = [];  
const ui = new Ui(); 
let deckCards;    
let currentPlayerIndex;       
let currentPlayerId = "";     
let currentRoom;        
let selectedCardsId = [];  // Array to store IDs of selected cards
let selectCard = false;    // Flag to indicate if a card is selected



let url =
  window.location.hostname == "localhost"
    ? window.location.hostname + ":3000"
    : window.location.hostname;
    
const socket = io.connect(url, { forceNew: true });;
export class Game {
  constructor() {}

  start() {
   

    // Emit 'joined' event to the server
    socket.emit("joined");

    // Listen for 'my_id' event to receive player playData
    socket.on("my_id", (currentPlayerData) => {
      currentPlayerIndex = currentPlayerData.index;
      currentRoom = currentPlayerData.room;
      currentPlayerId = currentPlayerData.id;
    });

    // Listen for 'new_player' event to update players list
    socket.on("new_player", (playersData) => {
      if (players.length < currentRoom) {
        players = playersData
          .filter((playerData) => {
            return playerData.room == currentRoom;
          })
          .map((playerData) => {
            return new Player(
              playerData.nickName,
              playerData.id,
              playerData.room
            );
          });
        ui.displayGame(players)
        socket.emit("load_cards", {
          deckCards: ui.getNewCards,
          room: players[currentPlayerIndex].room,
        });
      }
    });

    
    socket.on("full_room", () => {
      ui.showErrorMessage("La sala esta llena");
    });
    socket.on("join_error", () => {
      ui.showErrorMessage("Error al unirse a la sala");
    });
    // Listen for 'disconnected_player' event to handle player disconnection
    socket.on("disconnected_player", (playerData) => {
      if (playerData.room == players[currentPlayerIndex].room) {
        ui.disconnectedPlayerMessage(
          playerData.nickName,
          players[currentPlayerIndex].nickName,
          players[currentPlayerIndex].room
        );
        socket.disconnect();
      }
    });

    // Listen for 'update_game' event to update game state
    socket.on("update_game", (gameData) => {
      if (players[currentPlayerIndex].room == gameData.room) {
        document.querySelector(".preload").style.visibility = "hidden";
        console.log(players);
        ui.updategame(
          players,
          players.length,
          gameData.deckCards,
          {
            eventName: "startGame",
            playData: 0,
          },
          currentPlayerIndex
        );
      }
    });

    // Listen for 'deckCards_loadeds' event to load deck cards
    socket.on("deckCards_loadeds", (deckCardsData) => {
      if (players[currentPlayerIndex].room == deckCardsData.room) {
        deckCards = deckCardsData.deckCards;
      }
    });

    // Listen for 'new_play_server' event to handle new plays from server
    socket.on("new_play", (playData) => {
      let band = true;
      if (playData.room == players[currentPlayerIndex].room) {
        band = ui.updategame(
          players,
          players.length,
          deckCards,
          playData,
          currentPlayerIndex
        );
        if (!band) {
          ui.rotatePlayers(players);
          currentPlayerIndex = players.findIndex((player) => player.id == currentPlayerId);
          console.log(players);
          socket.emit("load_cards", {
            deckCards: ui.getNewCards,
            room: players[currentPlayerIndex].room,
          });

          ui.updategame(
            players,
            players.length,
            deckCards,
            {
              eventName: "startGame",
              playData: 0,
            },
            currentPlayerIndex
          );
        }
        selectedCardsId = [];
      }

      console.log("este es band: " + band);
    });

    console.log("Fin del juego");
  }
}

// Handle card selection by the player
playerCardsContainer.addEventListener("click", (e) => {
  console.log(players[currentPlayerIndex]);
  if (e.target.className == "selectAction") {
    if (players[currentPlayerIndex].turn) {
      selectCard = true;
      socket.emit("new_play", {
        eventName: "click",
        playData: { id: e.target.id, object: e.target },
        room: players[currentPlayerIndex].room,
      });
    }
  }
});

// Handle keyup events to manage selected cards
document.addEventListener("keyup", (e) => {
  socket.emit("new_play", {
    eventName: "keyup",
    playData: { key: e.key, selectedCardsId: selectedCardsId },
    room: players[currentPlayerIndex].room,
  });
  selectCard = false;
});

// Handle table click events to manage card selections
table.addEventListener("click", (e) => {
  if (selectCard && players[currentPlayerIndex].turn) {
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
