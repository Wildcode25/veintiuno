let players = [];
let ui = new Ui();
let deckCards;
let socket;
let myId;
let selectedCardsId=[]
let selectCard=false
export class Game {
  constructor() {}
  start() {
    socket = io.connect("http://localhost:3000", { forceNew: true });
    socket.emit("joined");
    socket.on("my_id", (id)=>{
      myId=id
    }) 
    socket.on("new_player", (playersNickname) => {
      players = playersNickname.map((playerNickname, index) => {
        return new Player(playerNickname.nickName, index + 1);
      });
      console.log(players[0]);
      socket.emit("load_cards", {
        deckCards: ui.displayGame(players, playersNickname.limit),
        playerId: players[players.length - 1].id,
      });
    });
    socket.on("update_game", (deckCardsDAta) => {
      deckCards = deckCardsDAta;
      ui.turnPlayer(players, players.length, deckCards, {
        eventName: "startGame",
        info: 0,
      }, myId);
    });
    socket.on("new_play_server", (playInfo) => {
      let band = ui.turnPlayer(players, players.length, deckCards, playInfo, myId)
      console.log("este es band: "+band)
      if(!band){
       socket.emit("joined")        
        
      };
      
      selectedCardsId=[]
      
    });
   
    // let playersPlaces = this.updateStatistics(players);

    // playersPlaces = this.updateStatistics(players)

    console.log("Fin del juego");
    // playersPlaces.forEach((e,i)=>{
    //   console.log(`${i+1}. ${e}`)

    // })
  }
}
document
  .querySelector(".playerCardContainer")
  .addEventListener("dblclick", (e) => {
    if (e.target.className == "selectAction"&& players[myId].turn) {
      players[myId].turn=false
      console.log(e.target.id);
      socket.emit("new_play", { eventName: "dblClick", info: e.target.id });
    }
  });
  document
  .querySelector(".playerCardContainer").addEventListener("click",(e)=>{
    if(e.target.className=="selectAction"){
      
      selectCard=true
      socket.emit("new_play", {eventName: "click", info: {id:e.target.id, object: e.target}})
      
    } 
  })
document.addEventListener("keyup", (e) => {
  socket.emit("new_play", { eventName: "keyup", info: {key: e.key, selectedCardsId: selectedCardsId} });
  selectCard=false
});
document.querySelector(".table").addEventListener("click", (e) => {
  if(selectCard&&players[myId].turn){
    if (e.target.className == "selectAction") {
      if (e.target.style.background != "blue") {
        e.target.style.background = "blue";
        selectedCardsId.push(e.target.id)
      } else {
        e.target.style.background = "none";
        selectedCardsId = selectedCardsId.filter((selectCard) => {
          return selectCard != e.target.id;
        });
      }
    }
    
  }
});
