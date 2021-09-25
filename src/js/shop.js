const shopGrid = document.querySelector(".shop-items");
const diceMenu = document.getElementById("dice-menu");
const game = document.getElementById("game");
const shop = document.getElementById("shop");
const upgradeShopButton = document.querySelector(".upgrade-shop");
const basicShopAmount = 6;
const maxShopLevel = 2;
let shopLevel = 1;
let priceMultiplier = 1.0;
const calculateUpgradeShopCost = (shopLevel) => Math.floor(Math.pow(shopLevel, 2) * 1000);
let upgradeShopCost = calculateUpgradeShopCost(shopLevel);
let currentApplyingItem;
function diceSelectionMenu(buying) {
    game.classList.add("hidden");
    shop.classList.add("hidden");
    diceMenu.classList.remove("hidden");
    while (diceMenuGrid.children.length > 0) {
        diceMenuGrid.removeChild(diceMenuGrid.children[diceMenuGrid.children.length - 1]);
    }
    for (let die of dice) {
        die.renderLayout(buying);
    }
    if (!buying) {
        let backButton = document.createElement("button");
        backButton.classList.add("back-button");
        backButton.innerHTML = "Back";
        backButton.onclick = () => {
            diceMenu.classList.add("hidden");
            game.classList.remove("hidden");
            shop.classList.remove("hidden");
            backButton.remove();
        };
        diceMenu.append(backButton);
    }
}
const itemsForShopLevels = {
    1: [ConstNumber, Incrementer],
    2: this[1] + [NewRandNumDice, NewDice]
};
function* generateItems(number, shopLevel) {
    let itemChoices = itemsForShopLevels[shopLevel];
    for (let i = 0; i < number; i++) {
        switch (itemChoices[Math.floor(Math.random() * itemChoices.length)]) {
            case ConstNumber:
                //give a constant number from number of dice to 5 * number of dice
                yield new ConstNumber(Math.floor(Math.random() * (10 * dice.length - dice.length)) + dice.length);
                break;
            case NewDice:
                yield new NewDice(1000 * dice.length, "New Die", "Adds a basic die");
                break;
            case NewRandNumDice:
                yield new NewRandNumDice(1000 * dice.length, "New Random Die", "Adds a die where all sides are the same number (1-6)");
                break;
            case Incrementer:
                yield new Incrementer(Math.floor(Math.random() * (Math.max(shopLevel, 6) - 1) + 1));
        }
    }
}
function updateShopButton(text) {
    upgradeShopButton.innerHTML = text;
}
function upgradeShop() {
    let upgradeCost = calculateUpgradeShopCost(shopLevel);
    if (upgradeShopCost > score) {
        alert("You do not have enough money to upgrade");
        return false;
    }
    if (shopLevel == maxShopLevel) {
        alert("Max shop level has been reached");
        return false;
    }
    shopLevel++;
    updateShopButton(String(calculateUpgradeShopCost(shopLevel)));
    updateScore(-upgradeCost);
}
function refreshShop(itemCount, shopLevel) {
    const shopItems = document.querySelector(".shop-items");
    while (shopItems.children.length > 0) {
        shopItems.removeChild(shopItems.children[shopItems.children.length - 1]);
    }
    for (let item of generateItems(itemCount, shopLevel)) {
        item.createElement();
        items.push(item);
    }
    priceMultiplier += .05;
}
updateShopButton(String(calculateUpgradeShopCost(shopLevel)));
refreshShop(basicShopAmount, shopLevel);
