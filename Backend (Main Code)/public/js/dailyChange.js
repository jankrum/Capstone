// Most code here is entirely written from Ankrum's hands, with his refactoring of Church's code, but contains the combined power of Ankrum and Church.
// All comments aside from author annotation is from Church

// This is the start of Church's code. Used to assign the dropdowns and buttons to a variable
const confirmButtom = document.getElementById('confirm');
const morningSelect = document.getElementById("A");
const afternoonSelect = document.getElementById("B");

const dateLog = new Date().toLocaleDateString();
const dateDisplay = new Date().toDateString();
console.log(dateLog);

const member = "snuffy";

const currentDate = document.getElementById('todayDate').innerHTML = dateDisplay;
// This is the end of Church's code

// This is the start of Ankrum's code. Using today's date and the member's name, a daily schedule is retrieved from the backend
async function getDailyFromServer(member) {
    const response = await fetch(`/api/daily/${member}`);

    if (response.ok) { // If the response is ok, then the daily schedule is returned, otherwise, "undefined" is sent to the user.
        try {
            const data = await response.json();
            return data;
        } catch (e) {
            return undefined;
        }
    } else {
        return undefined;// The user could have an undefined return due to them having an unplanned week as of that moment
    }
}

// Start of Baker and Church
//Populates the dropdown data with the retrieved values from a members schedule for today's date, otherwise, the blank default option is selected
function populateSelects(morningValue, afternoonValue) {
    // Morning value collection
    morningSelect.selectedIndex = morningValue ? morningValue : 0;
    
    // Afternoon value collection
    afternoonSelect.selectedIndex = afternoonValue ? afternoonValue : 0;
}
// End of Baker

function confirmedButton(boolean) {
    if (boolean != 0) {
        confirmButtom.style.backgroundColor = "#31916d";
        confirmButtom.style.color = "#bababa"
        confirmButtom.disabled = true;
        confirmButtom.style.boxShadow = "inset 0px 0px 10px 0px black";
    }
}

// When the page is loaded, the members name is sent to the backend, and a schedule is retrieved
// For testing purposes, the member "snuffy" is loaded
document.addEventListener("DOMContentLoaded", async () => {

    // Sets the retrieved daily schedule to the "data" variable
    const data = await getDailyFromServer(member);
    console.log(data);

    // If data is empty, then an alert is displayed.
    if (!data) {
        alert("Date or member does not exist");
        return;
    }

    // Retrieves todays schedule from the backend
    const morningValue = data.Morning;
    const afternoonValue = data.Afternoon;
    const confirmValue = data.Confirm;

    // Sends the todays schedule to populate the webpage if the user had already set his schedule
    populateSelects(morningValue, afternoonValue);

    confirmedButton(confirmValue);

    // Updates the dropdown menu colors
    updateColors();
})

// Retrieves the name and value of the dropdown selects
function getTextAndValueFromSelectedOption(select) {
    const text = select.options[select.selectedIndex].text;
    const value = select.selectedIndex;
    return [text, value];
}
// This is the end of Ankrum's code

// This is the start of Church and Ankrum's code

// Sends confirmed values to the backend 
confirmButtom.addEventListener("click", async () => {
    // Populates several variables with name and value info to be submitted to the back end
    const [morningName, morningValue] = getTextAndValueFromSelectedOption(morningSelect);
    const [afternoonName, afternoonValue] = getTextAndValueFromSelectedOption(afternoonSelect);
    // If the confirms button is clicked, this function is called, therefore the true value is sent
    const confirmValues = true;

    // const obj = { Hello: "Goodbye" }


    // Checks if the user didn't enter a value for their morning or afternoon
    if (morningValue == 0 || afternoonValue == 0) {
        alert("Please enter a schedule for your morning or afternoon");
    } else {
        //Posts the stringified values to the backend
        const response = await fetch('/api/daily', {
            method: 'POST',
            body: JSON.stringify({member, morningValue, afternoonValue, confirmValues, morningName, afternoonName }),
            headers: { 'Content-Type': 'application/json' }
        });
        //Confirms the check-in worked for the user, otherwise a negative alert is sent
        if (response.ok) {
            alert("Check-In Confirmed");
            confirmedButton(confirmValues);
            
        } else {
            alert("There was a problem in confirming your schedule");
        }
    }

})
    // This is the end of Church and Ankrum's code
