import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import logger from 'morgan'
let app = express();
let server = createServer(app)
let io = new Server(server)
let playersNicknames = [];
let usersSockets ={}
let deckCards=[]
app.use(logger('div'))
app.use(express.static('static'))
app.get('/', (req, res) => {
    res.sendFile('C:/Users/User/Desktop/Codigoteo/Proyectos/veintiunogit/veintiuno/static/index.html');
});

app.get('/game', (req, res)=>{
   playersNicknames.push({
    nickName: req.query.nickName,
    limit: req.query.limit
   })
   console.log(playersNicknames.length)
    res.sendFile('C:/Users/User/Desktop/Codigoteo/Proyectos/veintiunogit/veintiuno/static/game.html')
   
    
})
io.on('connection',(socket)=>{
    console.log('A player has joined')
    socket.on("joined", ()=>{
        if(playersNicknames[0].limit>=playersNicknames.length){
            io.emit("new_player", playersNicknames)
            socket.emit("my_id", playersNicknames.length-1)
        }
        if(playersNicknames[0].limit==playersNicknames.length){
            io.emit('update_game', deckCards)
        }
    })
    socket.on("load_cards",(message)=>{
        
        if(message.playerId==1){
            console.log('linea: 36')
            deckCards = shuffleCards(message.deckCards);
            console.log(deckCards)
        }
        
    })
    socket.on("new_play", (message)=>{
        io.emit("new_play_server", message)
    })
    
})
server.listen(3000, ()=>{
    
    console.log("servidor levantado correctamente")
})


function shuffleCards(cards) {
    return cards.sort(random);
  }

  function random() {
    return Math.random() - 0.5;
  }
  function getUserNickname(socket){
    return Object.keys(usersSockets).find((userSocket)=>{usersSockets[userSocket]===socket})
  }