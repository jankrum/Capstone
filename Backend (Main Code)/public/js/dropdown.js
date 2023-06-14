// this be the start Church's code

// Named color variables
const grey = "#606060";
const red = "#E95B5B";
const green = "#3EB489";
const purple = "#EAB464";
const cyan = "#3F88C5";

// Sends an update to the local storage and updates color
function updateStorage(id) {
    var a = document.getElementById(id).value;;
    // saveScheduleToLocal(a, id);
    updateColors();
}

// the end of Church's code

// This is the start of Ankrum's refactoring of Church's code

// Creates an array for the color variables
const colorArray = [grey, red, green, purple, cyan];

// Updates the dropdown selection values for their associated color
function updateColors() {
    for (const selectElement of document.querySelectorAll("select")) {
        const selectValue = selectElement.value;
        selectElement.style.backgroundColor = colorArray[selectValue];
    }
}
// The end of Ankrum's refactor