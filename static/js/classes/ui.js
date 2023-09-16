import { Player } from "./player";
export class Ui {
  displayGame(gameCards, player) {
    let stringPlayerCards = "";
    let stringGameCards = "";
    player.cards.forEach((e, i) => {
      stringPlayerCards += `${i + 1}.${e.name} `;
    });
    gameCards.cards.forEach((e, i) => {
      stringGameCards += `${i + 1}.${e.name} `;
    });
    console.log("juega " + player.nickName);
    console.log(stringGameCards);
    let cardIndex = 0;
    do {
      cardIndex = parseInt(prompt(stringPlayerCards)) - 1;
    } while (cardIndex < 0 || cardIndex >= player.cards.length);

    return {
      card: player.cards[cardIndex],
      actionIndex: parseInt(
        prompt("1. Soltar 2. Robar 3. Formar 4. Emparejar")
      ),
      cardIndex: cardIndex
    };
  }

  askPlayerNames() {
    let players = [];
    let limit;
    let op = 0;
    while (op != 1 && op != 2 && op != 3) {
      op = parseInt(prompt("1. Dos jugadores 2. Tres jugadores 3. Cuatro jugadores"));
      switch (op) {
        case 1:
          limit = 2;
          break;
        case 2:
          limit = 3;
          break;
        case 3: 
          limit = 4;
          break;
        default:
          alert("Opcion no valida");
      }
    
    }

    for (let i = 0; i < limit; i++) {
      let player = new Player(prompt(`Nombre de jugador ${i + 1}`))
      players.push(player);
    }
    console.log(players)
    return players;
  }
  selectCards(gameCards) {
    let indexGameCard = 0;
    let op = 0;
    let selectedCards = [];
    let indexs = [];
    let band=true;
    while (op != 1) {
      do {
        indexGameCard = parseInt(prompt("Seleccionar carta")) - 1;
      } while (indexGameCard < 0 || indexGameCard >= gameCards.length);
      
      if (indexs.length > 0) {
        for(let index of indexs){
          if (index == indexGameCard)
          {
            band = false;
            break;
          } 
        }
      }
      if (band) {
        op = prompt("1.confirmar 2.elegir otra");
        if (op == 2||op==1){
          selectedCards.push(gameCards[indexGameCard]);
          indexs.push(indexGameCard);
        } 
        else if (op != 1) alert("Opcion no valida");

      }
      else {
        alert("Carta seleccionada")
        band = true;
      }
    }
    return selectedCards;
  }

  displayWelcome() {
    alert("Bienvenido a Veintiuno");
  }
}
