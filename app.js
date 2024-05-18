import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import path from "path";
import dotenv from "dotenv";
let nickName="";
let limit=2
let app = express();
let server = createServer(app);
let io = new Server(server);
dotenv.config();
let playersData = [];
let usersSockets = {};
let deckCards = [];
app.use(express.static("static"));
let baseRoute = path.join(process.cwd(), "static");
app.get("/", (req, res) => {
  res.sendFile(path.join(baseRoute, "index.html"));
});

app.get("/game", (req, res) => {
  
    nickName = req.query.nickName,
    limit = req.query.limit
    

  console.log(playersData.length);
  res.sendFile(path.join(baseRoute, "game.html"));
});
io.on("connection", (socket) => {
  console.log("A player has joined");
  socket.on("joined", () => {
    playersData.push({
      nickName: nickName,
      room: limit,
      id: socket.id
    })
  
    if (getNumbersOfPlayerInRoom(limit)<=limit) {
      socket.emit("my_id", {index: playersData.filter(playerData=>playerData.room==limit).length - 1,
        room: limit,
        id: socket.id
      });
      io.emit("new_player", playersData);
      
    }
    if (getNumbersOfPlayerInRoom(limit) == limit) {
      console.log("limit: "+limit)
      io.emit("update_game", {deckCards: deckCards,
        room: limit
      });
    }
    if(getNumbersOfPlayerInRoom(limit)>limit){
      playersData.pop().room=0
      socket.emit("full_room")
    }
  });
  socket.on("load_cards", (message) => {
    deckCards = shuffleCards(message.deckCards);

    io.emit("deckCards_loadeds", {deckCards: deckCards,
      room: message.room
    });
  });
  socket.on("new_play", (message) => {
    io.emit("new_play_server", message);
  });
  socket.on("disconnect", ()=>{
    let disconnectedPlayer = playersData.find((playerNickname)=>{
      return playerNickname.id == socket.id
    })
    if(disconnectedPlayer){
      playersData=playersData.filter((playerData)=>{
        return playerData.room!=disconnectedPlayer.room
      })
      if(disconnectedPlayer.room!=0)
      io.emit("disconnected_player", disconnectedPlayer)
    }
    
  })
});
server.listen(3000, () => {
  console.log("servidor levantado correctamente");
});

function shuffleCards(cards) {
  return cards.sort(random);
}

function random() {
  return Math.random() - 0.5;
}
function getUserNickname(socket) {
  return Object.keys(usersSockets).find((userSocket) => {
    usersSockets[userSocket] === socket;
  });
}
function getNumbersOfPlayerInRoom(room){
  let numbersOfPlayers=playersData.filter((playerData)=>{
    return playerData.room == room
  }).length
  return numbersOfPlayers 
}
