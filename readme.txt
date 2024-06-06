

# Veintiuno Game

## Overview

Veintiuno is a card game where players compete to reach or get as close to 21 points as possible 
without exceeding it. This project is a digital implementation of the Veintiuno game, including 
features such as player management, card dealing, and game mechanics. The project includes 
a user interface for interacting with the game, tutorial animations, and logic for managing player turns and game rules.
The game includes two-way communication which allows interaction between different computers and in this way different 
people can compete with each other.

## Features

- Player Management: Track multiple players and their statistics.
- Card Dealing: Automatically deal cards to players from a deck.
- Game Mechanics: Implement game rules such as point calculation, card matching, and card looting.
- Tutorial: Interactive tutorial to guide new players.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/veintiuno-game.git
   ```

2. Navigate to the project directory:
   ```bash
   cd veintiuno-game
   ```

3. Open the `index.html` file in your preferred web browser to start the game.

## Usage

### Game Interface

- Players: The game supports multiple players. 
        Player statistics are displayed in separate containers (`.playerContainer1`, `.playerContainer2`).

- Cards: Cards are dealt from a deck (`Deck` class) and displayed on the game table (`#table1`) 
        and in the player's hand (`.playerCardContainer`).

Controls

- Select Card: Click on a card to select it.
- Drop Card: Press the 'd' key to drop a selected card.
- Form Cards: Press the 'x' key to form cards.
- Block Card: Press the 'a' key to block a card.
- Loot Cards: Press the 'z' key to loot selected cards.
- Match Cards: Press the 'c' key to match selected cards.


Code Structure

 UI Class

- displayGame(players): Initializes the game display for the given players.
- addTutorialButtonsEvents(left, right, limitT, section): Adds event listeners for tutorial navigation buttons.
- addTutorialAnimation(): Adds animations for the tutorial sections.
- getAnimationFrames(baseRoute, limit)**: Loads animation frames for tutorial animations.
- drawAnimation(canvas, framesArray, limit): Draws the animations on the canvas.
- getPlayerCard(cardId, playerCards): Retrieves a player's card based on its ID.
- evaluateWinner(players): Checks if any player has reached or exceeded 21 points.
- updatePoints(players): Updates the points of all players based on their cards.
- createHtmlCardElement(cardObject): Creates HTML elements for displaying cards.
- playerVerification(gameCard, player, playerCard): Verifies if a player can play a card.
- createPlayerStatisticContainerContent(playerStatisticContainer, detail, data)**: Creates content for player statistics display.
- turnPlayer(players, limit, deckCards, playInfo, myId)**: Manages the turn of players and updates the game state.
- showFullRoomMessage(): Displays a message when the room is full.
- disconnectedPlayerMessage(disconnectedPlayer, playerNickname, limitPlayers)**: Displays a message when a player disconnects.
- rotatePlayers(players): Rotates the players' order.
- resetSelection(table): Resets the selection of cards.
- displayWelcome(): Displays a welcome message.




## License

This project is licensed under the MIT License. See the `LICENSE` file for more details.

