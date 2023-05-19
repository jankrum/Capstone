const monday = ['A', 'B'];
const tuesday = ['C', 'D'];
const wednesday = ['E', 'F'];
const thursday = ['G', 'H'];
const friday = ['I', 'J'];
const week = [monday, tuesday, wednesday, thursday, friday];

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

document.addEventListener("DOMContentLoaded", async () => {
    const member = "snuffy"

    // Sets the retrieved daily schedule to the "data" variable
    var data = await getWeeklyFromServer(member);
    console.log(data)

    for (const i in data) {
        var afternoonValue = data[i].afternoon.value;
        // console.log(afternoonValue);
        var morningValue = data[i].morning.value;
        // console.log(morningValue);

        var getMorning = document.getElementById(week[i][0]);
        var getAfternoon = document.getElementById(week[i][1]);

        if (morningValue) {
            getMorning.selectedIndex = morningValue;
        } else {
            getMorning.selectedIndex = 0;
        }
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

    // Retrieves todays schedule from the backend
    // const morningValue = data.morning.value;
    // const afternoonValue = data.afternoon.value;

    // // Sends the todays schedule to populate the webpage if the user had already set his schedule
    // populateSelects(morningValue, afternoonValue);

    // // Updates the dropdown menu colors
    // updateColors();
})