// This is Church's and Baker's code

// These variables hold the element ID's for each day
const monday = ['A', 'B'];
const tuesday = ['C', 'D'];
const wednesday = ['E', 'F'];
const thursday = ['G', 'H'];
const friday = ['I', 'J'];

//This variable holds the whole week
const week = [monday, tuesday, wednesday, thursday, friday];

// Collects the weekly schedule from the server
async function getWeeklyFromServer(member) {
    const response = await fetch(`/api/week/${member}`);

    if (response.ok) { // If the response is ok, then the daily schedule is returned, otherwise, "undefined" is sent to the user.
        try {
            const data = await response.json();
            console.log(data);
            return data;
        } catch (e) {
            return undefined;
        }
    } else {
        return undefined;// The user could have an undefined return due to them having an unplanned week as of that moment
    }
}

// On document load, each day is populated with the stored data
document.addEventListener("DOMContentLoaded", async () => {
    const member = "snuffy"

    // Sets the retrieved daily schedule to the "data" variable
    var data = await getWeeklyFromServer(member);
    // console.log(data)

    // Runs a loop to populate each day with the current data
    for (const i in data) {
        var afternoonValue = data[i].afternoon.value;
        // console.log(afternoonValue);
        var morningValue = data[i].morning.value;
        // console.log(morningValue);

        // Element is stored in a value
        var getMorning = document.getElementById(week[i][0]);
        var getAfternoon = document.getElementById(week[i][1]);

        // Saves the initial load to local storage
        localStorage.setItem(week[i][0], morningValue);
        localStorage.setItem(week[i][1], afternoonValue);

        // If the value is the morning value, the morning dropdown is updated
        if (morningValue) {
            getMorning.selectedIndex = morningValue;
        } else {
            getMorning.selectedIndex = 0;
        }
        //If the value is an afternoon value, the afternoon dropdown is updated
        if (afternoonValue) {
            getAfternoon.selectedIndex = afternoonValue;
        } else {
            getAfternoon.selectedIndex = 0;
        }

        // console.log(getMorning);
        // console.log(getAfternoon);
        updateColors();
    }



    // If data is empty, then an alert is displayed.
    if (!data) {
        alert("Date or member does not exist");
        return;
    }
})

//Saves changes to the local storage
function saveScheduleToLocal(value, id) {
    localStorage.setItem(id, value);
}