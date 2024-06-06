// Select elements from the DOM
const content = document.querySelector(".form_template").content;
const form = content.querySelector(".form");
const playerLabel = content.querySelector(".playerLabel");
const formButtons = content.querySelector(".buttons");
const playersOptionContainer = document.querySelector(".players_option_container");
const layout = document.querySelector(".layout");
const inputNickname = content.querySelector("input");

const players = []; // Array to store player objects
let limit = 0;    // Variable to store the player limit

// Function to start the game
function startGame(e) {
  if ((e.target.className == "next_button" || e.key == "Enter") && inputNickname.value != "") {
    // Redirect to the game page with nickname and limit as query parameters
    window.location.href = `/game?nickName=${inputNickname.value}&&limit=${limit}`;
  }
}

document.addEventListener("keydown", (e) => startGame(e));

formButtons.addEventListener("click", (e) => {
  e.preventDefault();

  if (e.target.className == "back_button") {
    if (players.length == 0) {
      // If no players are added, reset the layout and show the players option container
      layout.innerHTML = "";
      layout.appendChild(playersOptionContainer);
      inputNickname.value = "";
      return;
    }
  } else {
    startGame(e); 
  }
});

// Add event listener for 'click' event on the players option container
playersOptionContainer.addEventListener("click", (e) => {
  // Set the player limit from the data attribute of the clicked element
  limit = e.target.dataset.value;
  console.log("hola", limit);

  // Toggle class for animation
  playersOptionContainer.classList.toggle("next-to-container");
  e.target.classList.toggle("next");

  // Delay to allow animation to complete before updating the layout
  setTimeout(() => {
    layout.innerHTML = "";
    console.log(form);
    layout.appendChild(form); // Append the form to the layout
    e.target.classList.toggle("next");
    playersOptionContainer.classList.toggle("next-to-container");
    document.getElementById('inputNickname').focus(); // Focus on the nickname input
    // updateForm(limit, players.length); // Update form based on the player limit and current number of players
  }, 500);
  console.log(form);
});
