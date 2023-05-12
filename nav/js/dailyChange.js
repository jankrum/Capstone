const confirmForm = document.querySelector("#confirm");
var morning = document.getElementById("A");
var afternoon = document.getElementById("B");

// document.addEventListener("onload", () => {
//     console.log("page loaded");
// })

// console.log("page loaded");

confirmForm.addEventListener("submit", event => {
    event.preventDefault();
    console.log(morning.value);
    console.log(afternoon.value);


    // if (morning.value == "0" || afternoon.value == "0") {
    //     window.alert("Please select a location for your morning or afternoon")
    // } else {
    // const formData = new FormData(confirmForm);
    // const morning = formData.get("morning");
    // const afternoon = formData.get("afternoon")

    // const response = await fetch('/api/login', {
    //     method: 'POST',
    //     body: JSON.stringify({ username, password }),
    //     headers: { 'Content-Type': 'application/json' }
    // }
    // }
})