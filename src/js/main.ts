const dieHolder = document.querySelector(".die-holder") as HTMLDivElement
const scoreDisplay = document.getElementById("score") as HTMLDivElement
const rollsLeftDisplay = document.getElementById("rolls-left") as HTMLDivElement
const rollsSincePurchaceDisplay = document.getElementById("average-roll-since-purchace")
const diceMenuGrid = document.getElementById("dice-menu-grid") as HTMLDivElement

let totalEarned = 0
let score = 0
let currentAverageRoll = 0
let averageRoll = 0
let rolls = 0
let rollsSinceLastPurchase = 0

//@ts-ignore
let queryString = new URLSearchParams(window.location.search)
console.log(queryString.get("rolls"))
rollsLeftDisplay.innerHTML = queryString.get("rolls")

function updateRolls(){
    rolls++;
    rollsSinceLastPurchase++
        //@ts-ignore
    rollsLeftDisplay.innerHTML -= 1
}
function updateScore(updateAmount: number){
    score += updateAmount
    // only update if the score was updated positively
    if(updateAmount > 0){
        totalEarned += updateAmount   
        //recalculate the average (rollsSinceLastPurchase - 1 because it will be 1 too high)
        currentAverageRoll = ((currentAverageRoll * (rollsSinceLastPurchase - 1)) + updateAmount) / (rollsSinceLastPurchase || 1)
        averageRoll = ((averageRoll * (rolls - 1)) + updateAmount) / (rolls || 1)
        rollsSincePurchaceDisplay.innerHTML = String(Math.round(currentAverageRoll))
        rollsSincePurchaceDisplay.title = `Full Ave: ${Math.round(averageRoll)}`
        scoreDisplay.setAttribute("data-score-increase", String(updateAmount))
    }
    scoreDisplay.innerHTML = String(score)
    scoreDisplay.title = `Total earned: ${totalEarned}`
}

class DiceSide{
    onRoll: Function
    type: String
    _text: string
    id: number
    modifiers: {}
    constructor(onRoll, text, type="number", modifiers=null){
        this.onRoll = onRoll
        this.type = type
        this._text = text
        this.id = Math.random()
        this.modifiers = modifiers || {}
    }
    set text(value){
        this._text = value
    }
    get text(){
        return this._text
    }
}

class Die{
    sides: DiceSide[]
    id: Number
    element: HTMLDivElement
    constructor(sides){
        this.sides = sides
        this.id = Math.random()
        this.createElement()
    }
    setText(text){
        this.element.innerHTML = text
    }
    roll(){
        let side = this.sides[Math.floor(Math.random() * this.sides.length)]
        this.element.innerHTML = side.text
        return side
    }
    createElement(){
        const dieElement = document.createElement("div")
        dieElement.classList.add("die")
        dieElement.innerHTML = this.sides[0].text
        dieHolder.append(dieElement)
        this.element = dieElement
    }
    renderLayout(buying: boolean){
        let container = document.createElement("div")
        container.classList.add("die-container")
        for(let side of this.sides){
            let sideElem = document.createElement("div")
            sideElem.innerHTML = side.text
            sideElem.classList.add("die-square")
            sideElem.addEventListener("click", e => {
                if(buying) currentApplyingItem.applyTo(side)
                diceMenu.classList.add("hidden")
                game.classList.remove("hidden")
                shop.classList.remove("hidden")
            })
            container.append(sideElem)
        }
        diceMenuGrid.append(container)
    }
}

const basicDie = () => new Die([
        new DiceSide(() => 1, '1'),
        new DiceSide(() => 2, '2'),
        new DiceSide(() => 3, '3'),
        new DiceSide(() => 4, '4'),
        new DiceSide(() => 5, '5'),
        new DiceSide(() => 6, '6'),
    ]
)

function oneNumDie(num: number){
    let sides = []
    for(let i = 0; i < 6; i++){
        sides.push(new DiceSide(() => num, num))
    }
    return new Die(sides)
}

function oneSideDie(num: number){
    return new Die(new DiceSide(() => num, String(num)))
}

let dice = [basicDie()]

function rollDice(){
    let Ltotal = 0
    let Lmultipliers = []
    for(let die of dice){
        let side = die.roll()
        switch(side.type){
            case "number":
                for(let modifier in side.modifiers){
                    switch(modifier){
                        case "increment":
                            side.text = Number(side.text) + side.modifiers["increment"]
                    }
                }
                Ltotal += Number(side.text)
                break
        }
    }
    rollsLeftDisplay.setAttribute("data-minus-one", "-1")
    updateRolls()
    updateScore(Ltotal)
    //@ts-ignore
    if(Number(rollsLeftDisplay.innerHTML) <= 0){
        //@ts-ignore
        const finalScore = score
        //@ts-ignore
        window.location = `./game-over.html?score=${finalScore}`
    }
}

dieHolder.addEventListener("click", e => {
        rollDice()
})
addEventListener("keydown", e => {
    if(e.key == " "){
        rollDice()
    }
})