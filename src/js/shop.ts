const shopGrid = document.querySelector(".shop-items")
const diceMenu = document.getElementById("dice-menu")
const game = document.getElementById("game")
const shop = document.getElementById("shop")
const upgradeShopButton = document.querySelector(".upgrade-shop") as HTMLButtonElement

const basicShopAmount = 6
const maxShopLevel = 2
let shopLevel = 1
let priceMultiplier = 1.0
const calculateUpgradeShopCost = (shopLevel: number, priceMultiplier: number) => Math.floor(shopLevel * 1000 * priceMultiplier)
let upgradeShopCost = calculateUpgradeShopCost(shopLevel, priceMultiplier)

let currentApplyingItem

function diceSelectionMenu(){
    game.classList.add("hidden")
    shop.classList.add("hidden")
    diceMenu.classList.remove("hidden")
    while(diceMenuGrid.children.length > 0){
        diceMenuGrid.removeChild(diceMenuGrid.children[diceMenuGrid.children.length - 1])
    }
    for(let die of dice){
        die.renderLayout()
    }
}

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

        buyButton.innerHTML = "BUY!"
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

class DiceItem extends Item{
    applyTo(diceSide: DiceSide){
        let newInfo = this.applyFunction()
        for(let i in newInfo){
            diceSide[i] = newInfo[i]
        }
    }
    buy(){
        if(super.canBuy()){
            diceSelectionMenu()
            currentApplyingItem = this
            this.postBuy()
            return true
        }
        return false
    }
    applyFunction(): {} {
        return {}
    }
}

class ConstNumber extends DiceItem{
    number: Number | String;
    constructor(number){
        super(number * 10, `${number}`, `Sets the number on 1 side of a dice to ${number}`)
        this.number = number
    }
    applyFunction(){
        return {text: String(this.number)}
    }
}

class Incrementer extends DiceItem{
    number: number | string;
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

function getItemChoices(shopLevel: number){
    switch(shopLevel){
        case 1:
            return [ConstNumber, NewDice]
        case 2:
            return [ConstNumber, NewDice, NewRandNumDice]
    }
}
function* generateItems(number: number, shopLevel: number){
    let itemChoices = getItemChoices(shopLevel)
    for(let i = 0; i < number; i++){
        switch(itemChoices[Math.floor(Math.random() * itemChoices.length)]){
            case ConstNumber:
                //give a constant number from number of dice to 10 * number of dice
                yield new ConstNumber(Math.floor(Math.random() * (10 * dice.length - dice.length)) + dice.length)
                break;
            case NewDice:
                yield new NewDice(1000 * dice.length, "New Die", "Adds a basic die")
                break;
            case NewRandNumDice:
                yield new NewRandNumDice(1000 * dice.length, "New Random Die", "Adds a die where all sides are the same number (1-6)")
                break
        }
    }
}

function updateShopButton(text: string){
    upgradeShopButton.innerHTML = text
}
function upgradeShop(){
    let upgradeCost = calculateUpgradeShopCost(shopLevel, priceMultiplier)
    if(upgradeShopCost > score){
        alert("You do not have enough money to upgrade")
        return false
    }
    if(shopLevel == maxShopLevel){
        alert("Max shop level has been reached")
        return false
    }
    shopLevel++
    updateShopButton(String(upgradeCost))
}

function refreshShop(itemCount: number, shopLevel: number){
    const shopItems = document.querySelector(".shop-items")
    while(shopItems.children.length > 0){
        shopItems.removeChild(shopItems.children[shopItems.children.length - 1])
    }
    for(let item of generateItems(itemCount, shopLevel)){
        item.createElement()
        items.push(item)
    }
    priceMultiplier += .05
}
updateShopButton(String(calculateUpgradeShopCost(shopLevel, priceMultiplier)))
refreshShop(basicShopAmount, shopLevel)