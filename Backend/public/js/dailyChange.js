// This is the start of Church's code
const confirmButtom = document.querySelector("#confirm");
var morningSelect = document.getElementById("A");
var afternoonSelect = document.getElementById("B");
// This is the end of Church's code

// This is the start of Ankrum's code
async function getDailyFromServer(member) {
    const response = await fetch(`/api/daily/${member}`);

    if (response.ok) {
        try {
            const data = await response.json();
            return data;
        } catch (e) {
            return undefined;
        }
    } else {
        return undefined;
    }
}

function populateSelects(morningValue, afternoonValue) {
    if (morningValue) {
        morningSelect.selectedIndex = morningValue;
    } else {
        morningSelect.selectedIndex = 0;
    }

    if (afternoonValue) {
        afternoonSelect.selectedIndex = afternoonValue;
    } else {
        afternoonSelect.selectedIndex = 0;
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    const member = "snuffy"

    const data = await getDailyFromServer(member);

    if (!data) {
        alert("Date or member does not exist");
        return;
    }

    const morningValue = data.morning.value;
    const afternoonValue = data.afternoon.value;

    populateSelects(morningValue, afternoonValue);

    updateColors();
})

function getTextAndValueFromSelectedOption(select) {
    const text = select.options[select.selectedIndex].text;
    const value = select.selectedIndex;
    return [text, value];
}
// This is the end of Ankrum's code

// This is the start of Church and Ankrum's code
confirmButtom.addEventListener("click", async () => {
    const [morningName, morningValue] = getTextAndValueFromSelectedOption(morningSelect);
    const [afternoonName, afternoonValue] = getTextAndValueFromSelectedOption(afternoonSelect);

    const obj = { Hello: "Goodbye" }

    const response = await fetch('/api/daily', {
        method: 'POST',
        body: JSON.stringify({ morningName, morningValue, afternoonName, afternoonValue }),
        headers: { 'Content-Type': 'application/json' }
    });

    if (response.ok) {
        console.log("We made it");
    } else {
        console.log("Its over")
    }
});
// This is the end of Church and Ankrum's code 
