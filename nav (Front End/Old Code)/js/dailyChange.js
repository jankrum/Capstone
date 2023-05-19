const confirmForm = document.querySelector("#confirm"); // Assigns the confirm button in Daily.html to a const variable
var morning = document.getElementById("A"); // Assigns the morning dropdown in Daily.html to a variable
var afternoon = document.getElementById("B"); // Assigns the afternoon dropdown in Daily.html to a variable

confirmForm.addEventListener("submit", event => {
    event.preventDefault();
    console.log(morning.value);
    console.log(afternoon.value);


    // Calls an error when the user tries to submit empty data, otherwise the data is posted
    // if (morning.value == "0" || afternoon.value == "0") {
    //     window.alert("Please select a location for your morning or afternoon")
    // } else {
    // const response = await fetch('/api/login', {
    //     method: 'POST',
    //     body: JSON.stringify({ username, password }),
    //     headers: { 'Content-Type': 'application/json' }
    // }
    // }
})