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

const dates = [];

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

// Retrieves the name and value of the dropdown selects
function getNumberAndNameFromSelect(selectElement) {
    const index = selectElement.selectedIndex;
    const name = selectElement.options[index].text;
    return [index, name];
}

async function postToDatabase(member, date, half, number, name) {
    const payload = {
        date,
        half,
        number,
        name
    };

    const response = await fetch(`/api/week/${member}`, {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: { 'Content-Type': 'application/json' }
    });

    if (!response) {
        alert("There was an error making your change");
    }
}

// On document load, each day is populated with the stored data
document.addEventListener("DOMContentLoaded", async () => {
    // Sets the retrieved daily schedule to the "data" variable
    const data = await getWeekFromServer(member);
    // console.log(data)

    if (data) {
        for (let i = 0; i < 5; i += 1) {
            const { morning_number, afternoon_number, date } = data[i];

            dates.push(date);

            document.getElementById(week[i][0]).selectedIndex = morning_number;
            document.getElementById(week[i][1]).selectedIndex = afternoon_number;
        }

        updateColors();
    } else {
        alert("Date or member does not exist");
    }

    for (const [dayIndex, day] of week.entries()) {
        const date = dates[dayIndex];
        console.log(dayIndex);
        console.log(day);
        console.log(date);
        const morningSelect = document.getElementById(day[0]);
        morningSelect.addEventListener("change", () => {
            const [number, name] = getNumberAndNameFromSelect(morningSelect);
            postToDatabase(member, date, "morning", number, name);
        })

        const afternoonSelect = document.getElementById(day[1]);
        afternoonSelect.addEventListener("change", () => {
            const [number, name] = getNumberAndNameFromSelect(afternoonSelect);
            postToDatabase(member, date, "afternoon", number, name);
        })
    }

    // for (const day of week) {
    //     for (const half of day) {
    //         document.getElementById(half).addEventListener("change", () => {
    //             console.log(`Change detected at ${half}`);
    //         });
    //     }
    // }
})

//Saves changes to the local storage
// function saveScheduleToLocal(value, id) {
//     localStorage.setItem(id, value);
// }

