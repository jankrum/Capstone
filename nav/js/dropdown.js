const red = "#E95B5B";
const green = "#3EB489";
const purple = "#EAB464";
const cyan = "#3F88C5";
// #89B6A5 gren
function callForColor(id) {
    var a = document.getElementById(id).value;
    var b = document.getElementById(id);
    console.log(a);
    console.log(b);
    colorChange(a, b)
}


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