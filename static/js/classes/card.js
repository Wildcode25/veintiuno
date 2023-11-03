export class Card{
    constructor(name, symbol,  value, color){
        this.name = name;
        this.symbol = symbol
        this.value = value;
        this.color = color
        this.block ={
            form: false
        }
        this.formedCards = []
        
    }
}