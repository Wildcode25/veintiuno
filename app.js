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
let playersNicknames = [];
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
    

  console.log(playersNicknames.length);
  res.sendFile(path.join(baseRoute, "game.html"));
});
io.on("connection", (socket) => {
  console.log("A player has joined");
  socket.on("joined", () => {
    playersNicknames.push({
      nickName: nickName,
      limit: limit,
      id: socket.id
    })
  
    if (playersNicknames[0].limit >= playersNicknames.length) {
      socket.emit("my_id", playersNicknames.length - 1);
      io.emit("new_player", playersNicknames);
      
    }
    if (playersNicknames[0].limit == playersNicknames.length) {
      io.emit("update_game", deckCards);
    }
  });
  socket.on("load_cards", (message) => {
    deckCards = shuffleCards(message);

    io.emit("deckCards_loadeds", deckCards);
  });
  socket.on("new_play", (message) => {
    io.emit("new_play_server", message);
  });
  socket.on("disconnect", ()=>{
    io.emit("disconnected_player", playersNicknames.find((playerNickname)=>{
      return playerNickname.id == socket.id
    }))
    playersNicknames=[]
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
