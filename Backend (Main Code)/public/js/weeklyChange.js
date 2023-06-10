// This is Church's and Baker's code

const member = "snuffy";

// These variables hold the element ID's for each day
const monday = ['A', 'B'];
const tuesday = ['C', 'D'];
const wednesday = ['E', 'F'];
const thursday = ['G', 'H'];
const friday = ['I', 'J'];

//This variable holds the whole week
const week = [monday, tuesday, wednesday, thursday, friday];

// Collects the weekly schedule from the server
async function getWeekFromServer(member) {
    const response = await fetch(`/api/week/${member}`);

    if (response.ok) { // If the response is ok, then the daily schedule is returned, otherwise, "undefined" is sent to the user.
        try {
            const data = await response.json();
            return data.week;
        } catch (e) {
            return undefined;
        }
    } else {
        return undefined;// The user could have an undefined return due to them having an unplanned week as of that moment
    }
}

// On document load, each day is populated with the stored data
document.addEventListener("DOMContentLoaded", async () => {
    // Sets the retrieved daily schedule to the "data" variable
    const data = await getWeekFromServer(member);
    console.log(data)

    if (data) {
        for (let i = 0; i < 5; i += 1) {
            const { morning_number, afternoon_number } = data[i];

            document.getElementById(week[i][0]).selectedIndex = morning_number;
            document.getElementById(week[i][1]).selectedIndex = afternoon_number;
        }

        updateColors();
    } else {
        alert("Date or member does not exist");
    }
})

//Saves changes to the local storage
// function saveScheduleToLocal(value, id) {
//     localStorage.setItem(id, value);
// }