let items = []

class Item{
    text: String
    description: string
    price: number
    element: HTMLDivElement
    constructor(price: number, text: String, description: string){
        this.text = text;
        this.description = description; 
        this.price = Math.floor(price * priceMultiplier);
    }
    canBuy(){
        if(this.price > score){
            alert("You do not have enough money to buy this")
            return false
        }
        return true
    }
    //applies to every type of item,
    //the buy method in each item should call this function
    postBuy(){
        updateScore(-this.price)
        this.element.classList.add("bought")
        this.element.querySelector("button").disabled = true;
    }
    createElement(){
        this.element = document.createElement("div")
        this.element.classList.add("item")
        this.element.title = this.description
        //2nd br is for the button element
        this.element.innerHTML = `$${this.price}<br>${this.text}<br>`
        let buyButton = document.createElement("button")

        buyButton.innerHTML = "BUY"
        buyButton.classList.add("buy-button")
        buyButton.addEventListener('click', e => {
            //@ts-ignore
            this.buy()
            rollsSinceLastPurchase = 0;
            currentAverageRoll = 0;
        })

        this.element.append(buyButton)
        shopGrid.append(this.element) 
    }
}

//diceitem apply to one side of a dice
class DiceItem extends Item{
    applyTo(diceSide: DiceSide){
        let newInfo = this.applyFunction(diceSide)
        for(let i in newInfo){
            diceSide[i] = newInfo[i]
        }
    }
    buy(){
        if(super.canBuy()){
            diceSelectionMenu(true)
            currentApplyingItem = this
            this.postBuy()
            return true
        }
        return false
    }
    applyFunction(diceSide: DiceSide): {} {
        return {}
    }
}

class ConstNumber extends DiceItem{
    number: Number | String;
    constructor(number){
        super(number * 10 * priceMultiplier, `${number}`, `Sets the number on 1 side of a dice to ${number}`)
        this.number = number
    }
    applyFunction(diceSide: DiceSide){
        return {text: String(this.number)}
    }
}

class Incrementer extends DiceItem{
    number: number | string;
    constructor(number){
        super(number * 20 * priceMultiplier, `+${number}`, `Adds ${number} on 1 side of a dice`)
        this.number = number
    }
    applyFunction(diceSide: DiceSide){
        if(diceSide.type == "number"){
            return {
                text: String(Number(diceSide.text) + Number(this.number))
            }
        }
        return {}
    }
}

class NewDice extends Item{
    buy(){
        if(super.canBuy()){
            dice.push(basicDie())
            super.postBuy()
            return true
        }
        return false
    }
}
class NewRandNumDice extends Item{
    buy(){
        if(super.canBuy()){
            dice.push(oneNumDie(Math.floor(Math.random() * 5) + 1))
            super.postBuy()
            return true
        }
        return false
    }
}
class NewOneSidedDice extends Item{
    buy(){
        if(super.canBuy()){
            dice.push(new Die([new DiceSide(() => 1, "1")]))
            super.postBuy()
            return true
        }
        return false
    }
}

class Increment extends DiceItem{
    number: number | string;
    constructor(number){
        super(number * 100 * priceMultiplier * dice.length, `${number}++`, `The side this is applied to will increase by ${number} each time the side is rolled`)
        this.number = number
    }
    applyFunction(diceSide: DiceSide){
        diceSide.modifiers["increment"] = this.number
        return {}
    }
}