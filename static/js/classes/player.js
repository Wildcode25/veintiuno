
export class Player{
    constructor(nickName){
        this.nickName = nickName;
        this.cards = [];
        this.accumulatedCards = [];
        this.pointsDistribution = {
            totalCards: 0,
            piCards: [],
            APoints: 0,
            dymondTen: 0,
            piTwo: 0
        }
        this.points = 0;
    }
    resetPointsDistribution(){
        this.accumulatedCards=[]
        this.pointsDistribution = {
            totalCards: 0,
            piCards: [],
            APoints: 0,
            dymondTen: 0,
            piTwo: 0
        }
    }
    countCards(){
        this.accumulatedCards.forEach((accumulatedCard)=>{
            if(accumulatedCard.formedCards.length>0){
                this.pointsDistribution.totalCards += accumulatedCard.formedCards.length
                for(let card of accumulatedCard.formedCards){
                    if(card.name[1] == "♠️"){
                        this.pointsDistribution.piCards.push(card)
                    }
                    if(card.name[0]=="A"){
                        this.pointsDistribution.APoints++
                    }
                    if(card.name == "10"+"♦️"){
                        this.pointsDistribution.dymondTen++

                    }
                    if(card.name == "2"+"♠️") this.pointsDistribution.piTwo++
                }
            }
            else{
                if(accumulatedCard.name[1] == "♠️"){
                    this.pointsDistribution.piCards.push(card)
                }
                if(accumulatedCard.name[0]=="A"){
                    this.pointsDistribution.APoints++
                }
                if(accumulatedCard.name == "10"+"♦️"){
                    this.pointsDistribution.dymondTen++

                }
                if(accumulatedCard.name == "2"+"♠️") this.pointsDistribution.piTwo++
                
                this.pointsDistribution.totalCards++
            }
        })
    }
    dropCard(gameCards, playerCard){
        gameCards.cards.push(playerCard);
        gameCards.playStatus = true;
        return gameCards;
    }
    lootCards(gameCards, selectedCards, playerCard){
       
        if(this.checkLoot(selectedCards, playerCard)){
            
            gameCards = this.updateGameCards(gameCards, selectedCards)
            selectedCards.push(playerCard)
            this.accumulatedCards = this.accumulatedCards.concat(selectedCards)
            gameCards.playStatus = true
        }
    
        console.log(selectedCards)
        return gameCards;
    }
    checkLoot(selectedCards, playerCard){
        let sum=0;
        let sum2 = 0;
        let sums = [];
        let count=0;
        let band=true;
        for(let selectedCard of selectedCards){
            sum+=selectedCard.value
        }
       console.log(sum);
       
        if(sum%playerCard.value==0){
           
            for(let i=1; i<=selectedCards.length; i++ ){
                    sums.push(this.sumasPosibles(selectedCards, i, playerCard.value))
            }
            for(let sumA of sums){
                sum2+=sumA.length
            }
            if(sum2 == sum/playerCard.value) return true
       }
       return false;
    }
    checkMatch(selectedCards, playerCard, playedCard){
        let sum=0;
        let sum2 = 0;
        let sums = [];
        let count=0;
        let band=true;
        for(let selectedCard of selectedCards){
            sum+=selectedCard.value
        }
       console.log(sum);
       
        if(sum%playerCard.value==0){
           
            for(let i=1; i<=selectedCards.length; i++ ){
                    sums.push(this.sumasPosibles(selectedCards, i, playerCard.value))
            }
            for(let sumA of sums){
                sum2+=sumA.length
            }
            sum = sum/playerCard.value
            if(sum2 == sum && sum>=2 && playerCard.name != playedCard.name) return true
       }
       return false;
    }
    match(gameCards, selectedCards, playerCard){
        let groupValue;
        let groupName="(";
        selectedCards.push(playerCard);
        for(let card of this.cards){
            if(this.checkMatch(selectedCards, card, playerCard)){
                groupValue = card.value;
                selectedCards.forEach((card) => {
                    groupName+=card.name+" "
                });
                groupName+=")"
                playerCard.name = groupName;
                playerCard.value = groupValue;
                playerCard.formedCards.concat(selectedCards)
                gameCards = this.updateGameCards(gameCards, selectedCards)
                gameCards.cards.push(playerCard)
                gameCards.playStatus = true
            }
        }
        return gameCards;
    }

    
 sumasPosibles(arr, n, cardValue) {
        const resultados = [];
    
        function calcularSumas(actual, startIndex) {
          if (actual.length === n) {
            const suma = actual.reduce((a, b) => a + b, 0);
            if(suma==cardValue)
            resultados.push(suma);
            return;
          }
          for (let i = startIndex; i < arr.length; i++) {
            const nuevoActual = [...actual, arr[i].value];
            calcularSumas(nuevoActual, i + 1);
          }
        }
      
        calcularSumas([], 0);
        console.log(resultados)
        return resultados;
      }
      
    checkForm(selectedCards, playerCard){
        let sum=0;
        for(let selectedCard of selectedCards){
            sum+=selectedCard.value
        }
       console.log(sum);
       if(sum==playerCard.value){
            return true;
       }
        return false;
    }
    groupCards(gameCards, selectedCards, playerCard){
        let band = false;
        let groupName = "( "
        let groupValue
        selectedCards.push(playerCard);

        for(let e of this.cards){
            if(this.checkForm(selectedCards, e)){
                groupValue = e.value;
                selectedCards.forEach((card) => {
                    groupName+=card.name+" "
                });
                groupName+=")"
                playerCard.name = groupName;
                playerCard.value = groupValue;
                playerCard.formedCards.concat(selectedCards)
                gameCards = this.updateGameCards(gameCards, selectedCards)
                gameCards.cards.push(playerCard)
                gameCards.playStatus = true
            }

        }
        
        return gameCards;
    }
    updateGameCards(gameCards, selectedCards){
        for(let selectedCardIndex in selectedCards){
            for(let gameCardIndex in gameCards.cards){
                if(selectedCards[selectedCardIndex].name == gameCards.cards[gameCardIndex].name){
                    gameCards.cards.splice(gameCardIndex, 1);
                }
            }
           }
           return gameCards;
    }   
}
