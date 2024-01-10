import { Player } from "./player";
import { Game } from "./game";
const game = new Game();
const content = document.querySelector(".form_template").content;
const form = content.querySelector(".form");
const playerLabel = content.querySelector(".playerLabel");
const formButtons = content.querySelector(".buttons");
const playersOptionContainer = document.querySelector(".players_option_container")
const layout = document.querySelector(".layout");
const inputNickname = content.querySelector("input")

let players=[];
let limit=0
  function updateForm(limit, numberOfPlayers){
    const nextButton = document.querySelector(".next_button")
    playerLabel.innerHTML = `Jugador ${numberOfPlayers+1}`
    if(numberOfPlayers>=limit-1){
      nextButton.innerHTML="Iniciar";
    } 
    else{    
      nextButton.innerHTML = "Siguiente";
  }
    

   
    
}
formButtons.addEventListener("click", (e)=>{
  e.preventDefault();

   if(e.target.className == "back_button"){
    let lastNickName = players.pop();
    inputNickname.value = lastNickName.nickName;
    updateForm(limit, players.length);
   }
   else{
    const player = new Player(inputNickname.value);
    players.push(player)
    inputNickname.value = ""
    if(document.querySelector(".next_button").innerHTML==="Iniciar"){
      layout.innerHTML = "";
      layout.appendChild(document.querySelector(".game_template").content.querySelector(".fullGame_container"));
      game.start(players)
    } 
    else updateForm(limit, players.length);
   }
  })
playersOptionContainer.addEventListener("click",  (e)=>{
    limit = e.target.dataset.value;
    playersOptionContainer.classList.toggle("next-to-container")
    e.target.classList.toggle("next");
    setTimeout(()=>{
      layout.innerHTML="";
      console.log(form)
      layout.appendChild(form)
    },500)
    updateForm(limit, players.length)
    console.log(form)

  })
