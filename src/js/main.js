const dieHolder = document.querySelector(".die-holder");
const scoreDisplay = document.getElementById("score");
const rollsLeftDisplay = document.getElementById("rolls-left");
const rollsSincePurchaceDisplay = document.getElementById("average-roll-since-purchace");
const diceMenuGrid = document.getElementById("dice-menu-grid");
let totalEarned = 0;
let score = 0;
let currentAverageRoll = 0;
let averageRoll = 0;
let rolls = 0;
let rollsSinceLastPurchase = 0;
function updateRolls() {
    rolls++;
    rollsSinceLastPurchase++;
}
function updateScore(updateAmount) {
    score += updateAmount;
    // only update if the score was updated positively
    if (updateAmount > 0) {
        totalEarned += updateAmount;
        //recalculate the average (rollsSinceLastPurchase - 1 because it will be 1 too high)
        currentAverageRoll = ((currentAverageRoll * (rollsSinceLastPurchase - 1)) + updateAmount) / (rollsSinceLastPurchase || 1);
        averageRoll = ((averageRoll * (rolls - 1)) + updateAmount) / (rolls || 1);
        rollsSincePurchaceDisplay.innerHTML = String(Math.round(currentAverageRoll));
        rollsSincePurchaceDisplay.title = `Full Ave: ${Math.round(averageRoll)}`;
        scoreDisplay.setAttribute("data-score-increase", String(updateAmount));
    }
    scoreDisplay.innerHTML = String(score);
    scoreDisplay.title = `Total earned: ${totalEarned}`;
}
class DiceSide {
    constructor(onRoll, text, type = "number", modifiers = null) {
        this.onRoll = onRoll;
        this.type = type;
        this._text = text;
        this.id = Math.random();
        this.modifiers = modifiers || {};
    }
    set text(value) {
        this._text = value;
    }
    get text() {
        return this._text;
    }
}
class Die {
    constructor(sides) {
        this.sides = sides;
        this.id = Math.random();
        this.createElement();
    }
    setText(text) {
        this.element.innerHTML = text;
    }
    roll() {
        let side = this.sides[Math.floor(Math.random() * this.sides.length)];
        this.element.innerHTML = side.text;
        return side;
    }
    createElement() {
        const dieElement = document.createElement("div");
        dieElement.classList.add("die");
        dieElement.innerHTML = this.sides[0].text;
        dieHolder.append(dieElement);
        this.element = dieElement;
    }
    renderLayout(buying) {
        let container = document.createElement("div");
        container.classList.add("die-container");
        for (let side of this.sides) {
            let sideElem = document.createElement("div");
            sideElem.innerHTML = side.text;
            sideElem.classList.add("die-square");
            sideElem.addEventListener("click", e => {
                if (buying)
                    currentApplyingItem.applyTo(side);
                diceMenu.classList.add("hidden");
                game.classList.remove("hidden");
                shop.classList.remove("hidden");
            });
            container.append(sideElem);
        }
        diceMenuGrid.append(container);
    }
}
const basicDie = () => new Die([
    new DiceSide(() => 1, '1'),
    new DiceSide(() => 2, '2'),
    new DiceSide(() => 3, '3'),
    new DiceSide(() => 4, '4'),
    new DiceSide(() => 5, '5'),
    new DiceSide(() => 6, '6'),
]);
function oneNumDie(num) {
    let sides = [];
    for (let i = 0; i < 6; i++) {
        sides.push(new DiceSide(() => num, num));
    }
    return new Die(sides);
}
let dice = [basicDie()];
function rollDice() {
    let Ltotal = 0;
    let Lmultipliers = [];
    for (let die of dice) {
        let side = die.roll();
        switch (side.type) {
            case "number":
                Ltotal += Number(side.text);
                break;
        }
    }
    updateRolls();
    updateScore(Ltotal);
    //@ts-ignore
    rollsLeftDisplay.innerHTML -= 1; //although innerHTML is a String, -= 1 will treat it as a Number
    if (Number(rollsLeftDisplay.innerHTML) <= 0) {
        //@ts-ignore
        window.location = `./game-over.html?score=${score}`;
    }
}
dieHolder.addEventListener("click", e => {
    rollDice();
});
addEventListener("keydown", e => {
    if (e.key == "space") {
        rollDice();
    }
});
