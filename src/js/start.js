let start = true;
function prepareValues() {
    const rollCountInput = document.getElementById("roll-count-input");
    start = false;
    //@ts-ignore
    window.location = `./game.html?rolls=${rollCountInput.value}`;
}
