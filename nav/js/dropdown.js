// This be the start Church's code

const red = "#E95B5B";
const green = "#3EB489";
const purple = "#EAB464";
const cyan = "#3F88C5";
// #89B6A5 gren

//This saved the dropdown ID and selected value
function callForColor(id) {
    var a = document.getElementById(id).value;
    var b = document.getElementById(id);
    console.log(a);
    console.log(b);
    colorChange(a, b)
}

// Original color change code. X represents the select value, y represents the HTML Element being changed
function colorChange(x, y) {
    if (x == 1) {
        y.style.backgroundColor = red;
    } else if (x == 2) {
        y.style.backgroundColor = green;
    } else if (x == 3) {
        y.style.backgroundColor = purple;
    } else if (x == 4) {
        y.style.backgroundColor = cyan;
    }
}

// the end of Church's code