

const content = document.querySelector(".form_template").content;
const form = content.querySelector(".form");
const playerLabel = content.querySelector(".playerLabel");
const formButtons = content.querySelector(".buttons");
const playersOptionContainer = document.querySelector(
  ".players_option_container"
);
const layout = document.querySelector(".layout");
const inputNickname = content.querySelector("input");

let players = [];
let limit = 0;

// function nextButtonFunction(e) {
//   if ((e.target.className == "next_button" || e.key == "Enter") && inputNickname.value!="") {
//     e.preventDefault()
//     const player = new Player(inputNickname.value, players.length+1);
//     inputNickname.value=""
//     players.push(player);
//     if (document.querySelector(".next_button").innerHTML === "Iniciar") {
//       layout.innerHTML = "";
//       layout.appendChild(
//         document
//           .querySelector(".game_template")
//           .content.querySelector(".fullGame_container")
//       );
//       game.start(players);
//     } 
//     else {
      
//       updateForm(limit, players.length);
      


//     }     

    

//   }
// }
function startGame(e){
  if ((e.target.className == "next_button" || e.key == "Enter") && inputNickname.value!=""){
    window.location.href = `/game?nickName=${inputNickname.value}&&limit=${limit}`
  }
}
document.addEventListener("keydown", (e) => startGame(e));
formButtons.addEventListener("click", (e) => {
  e.preventDefault();

  if (e.target.className == "back_button") {
    if (players.length == 0) {
      layout.innerHTML = "";
      layout.appendChild(playersOptionContainer);
      inputNickname.value = ""
      return;
    } 
    // let lastNickName = players.pop();
    // inputNickname.value = lastNickName.nickName;
  //   updateForm(limit, players.length);
  // } else nextButtonFunction(e);
}else startGame(e)});
playersOptionContainer.addEventListener("click", (e) => {
  limit = e.target.dataset.value;
  console.log("hola", limit);
  playersOptionContainer.classList.toggle("next-to-container");
  e.target.classList.toggle("next");
  setTimeout(() => {
    layout.innerHTML = "";
    console.log(form);
    layout.appendChild(form);
    e.target.classList.toggle("next");
    playersOptionContainer.classList.toggle("next-to-container");
    document.getElementById('inputNickname').focus()
    // updateForm(limit, players.length);
  }, 500);
  console.log(form);
});
