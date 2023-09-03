export class Ui {
  
  /**
   * The Ui class is responsible for handling the user interface of a game called "Veintiuno".
   * It provides methods for displaying messages, asking for player names, and welcoming the players.
   *
   * @example
   * const ui = new Ui();
   * ui.displayWelcome(); // Displays a welcome message
   * const players = ui.askNames(); // Asks for player names and returns an array of names
   * ui.display(); // Displays the game interface
   */

  /**
   * Displays the game interface.
   */
  
  displayGame(gameCards, player) {
    let stringPlayerCards="";
    let stringGameCards="";
    player.cards.forEach((e, i) => {
      stringPlayerCards += `${i + 1})${e.name} `;
    });
    gameCards.forEach((e, i)=>{
      stringGameCards += `${i+1})${e.name} `
    })
    console.log("juega "+player.nickName)
    console.log(stringGameCards);
    let cardIndex=0;
    do{
      cardIndex = parseInt(prompt(stringPlayerCards)) - 1;
    }while(cardIndex<0 || cardIndex>player.cards.lenght)
     

    return {
      card: player.cards[cardIndex], 
      actionNumber: parseInt(prompt("1. Soltar 2. Robar 3. Formar 4. Emparejar"))
    }
    
  }

  /**
   * Asks the user for player names and returns an array of names.
   *
   * @returns {string[]} An array of player names.
   */
  askPlayerNames() {
    let players = []
    let limit
    let op=0;
    while (op != 1) {
      op = parseInt(prompt("1. Dos jugadores 2. Cuatro jugadores"));
      switch (op) {
        case 1:
          limit = 2; break;
        case 2:
          alert("Opcion no disponible"); break;
        default:
          alert("Opcion no valida");
      }
      alert(op)
    }
    for (let i = 0; i < limit; i++) {
      players.push(prompt(`Nombre de jugador ${i + 1}`));
    }
    return players;
  }

  /**
   * Displays a welcome message to the user.
   */
  displayWelcome() {
    alert("Bienvenido a Veintiuno");
  }
}
