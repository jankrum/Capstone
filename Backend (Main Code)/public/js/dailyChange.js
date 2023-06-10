// Most code here is entirely written from Ankrum's hands, with his refactoring of Church's code, but contains the combined power of Ankrum and Church.
// All comments aside from author annotation is from Church

const member = "snuffy";
const DATE_FORMAT = "en-US";

// This is the start of Church's code. Used to assign the dropdowns and buttons to a variable
const confirmButtom = document.getElementById("confirmButton");
const morningSelect = document.getElementById("morningSelect");
const afternoonSelect = document.getElementById("afternoonSelect");

const dateLabel = document.getElementById("dateLabel");
dateLabel.innerHTML = new Date().toDateString();
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

function lockConfirmButton() {
    confirmButtom.disabled = true;
    confirmButtom.style.backgroundColor = "#31916d";
    confirmButtom.style.color = "#bababa"
    confirmButtom.style.boxShadow = "inset 0px 0px 10px 0px black";
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
    const morningNumber = data.morning_number;
    const afternoonNumber = data.afternoon_number;
    const confirmed = data.confirmed;

    morningSelect.selectedIndex = morningNumber ? morningNumber : 0;
    afternoonSelect.selectedIndex = afternoonNumber ? afternoonNumber : 0;

    if (confirmed) {
        lockConfirmButton();
    }

    // Updates the dropdown menu colors
    updateColors();
})

// Retrieves the name and value of the dropdown selects
function getValueAndTextFromSelectedOption(selectElement) {
    const index = selectElement.selectedIndex;
    const name = selectElement.options[index].text;
    return [index, name];
}

// This is the start of Church and Ankrum's code

// Sends confirmed values to the backend 
confirmButtom.addEventListener("click", async () => {
    // Populates several variables with name and value info to be submitted to the back end
    const [morningNumber, morningName] = getValueAndTextFromSelectedOption(morningSelect);
    const [afternoonNumber, afternoonName] = getValueAndTextFromSelectedOption(afternoonSelect);
    const dateFormatted = new Date().toLocaleDateString(DATE_FORMAT);

    const payload = {
        "morning_number": morningNumber,
        "afternoon_number": afternoonNumber,
        "confirmed": true,
        "morning_name": morningName,
        "afternoon_name": afternoonName,
        "date": dateFormatted
    };

    // Checks if the user didn't enter a value for their morning or afternoon
    if (morningNumber === 0 || afternoonNumber === 0) {
        alert("Please enter a schedule for your morning or afternoon");
    } else {
        //Posts the stringified values to the backend
        const response = await fetch(`/api/daily/${member}`, {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: { 'Content-Type': 'application/json' }
        });
        //Confirms the check-in worked for the user, otherwise a negative alert is sent
        if (response.ok) {
            alert("Check-In Confirmed");
            lockConfirmButton();
        } else {
            alert("There was a problem in confirming your schedule");
        }
    }
})
    // This is the end of Church and Ankrum's code