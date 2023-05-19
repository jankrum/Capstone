// This is Ankrum's code
// Church's comments

//Loads express
const express = require('express');
const path = require("path");

const app = express();

app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));
// app.set("view engine", "ejs");
// app.set("views", path.join(__dirname, "/views"));

//Dummy data calender
const calendarDatabase = [
    {
        // Member name
        name: "snuffy",
        planner: [
            {
                // Date template
                date: "12MAY2023",
                morning: {
                    name: undefined, // Readable name for the selected thing
                    value: undefined // HTML Value assigned for selected thing
                },
                afternoon: {
                    name: undefined,
                    value: undefined
                },
                confirmed: false
            },
            {
                date: "13MAY2023",
                morning: {
                    name: "On-Base",
                    value: 3
                },
                afternoon: {
                    name: "Home",
                    value: 4
                },
                confirmed: false
            },
            {
                date: "14MAY2023",
                morning: {
                    name: "Office",
                    value: 2
                },
                afternoon: {
                    name: "Office",
                    value: 2
                },
                confirmed: false
            },
            {
                date: "15MAY2023",
                morning: {
                    name: "Park",
                    value: 1
                },
                afternoon: {
                    name: "On-Base",
                    value: 3
                },
                confirmed: false
            },
            {
                date: "16MAY2023",
                morning: {
                    name: "On-Base",
                    value: 3
                },
                afternoon: {
                    name: "On-Base",
                    value: 3
                },
                confirmed: false
            }
        ]
    }
];

// Collects data from the calender database for the user upon page load
function queryDatabaseDay(member, date) {
    for (const row of calendarDatabase) {
        if (row.name === member) {
            for (const dayObject of row.planner) {
                if (dayObject.date === date) {
                    return dayObject;
                }
            }
        }
    }
}

function queryDatabaseWeek(member, date) {
    for (const row of calendarDatabase) {
        if (row.name === member) {
            for (const weekObject of row.planner) {
                if (weekObject.date === date) {
                    return weekObject;
                }
            }
        }
    }
}

// Test page
app.get("/test", (req, res) => {
    console.log("Daily request");
    res.send("<h1>Test!</h1>")
})

// Used to populate a user's page when they load in
app.get("/api/daily/:member", async (req, res) => {
    // Collects member name
    const { member } = req.params;
    // Dummy date
    const today = "12MAY2023";
    //Queries the database using the member name and today's date
    const data = queryDatabaseDay(member, today);

    //console.log(data);
    //Sends the data to the user
    res.send(JSON.stringify(data));
})

// Weekly 
app.get("/api/week/:member", async (req, res) => {
    const { member } = req.params;

    const week = ['12MAY2023', '13MAY2023', '14MAY2023', '15MAY2023', '16MAY2023'];

    var weekData = [];

    for (var i = 0; i < 5; i++) {
        weekData.push(queryDatabaseWeek(member, week[i]));
    }
    res.send(JSON.stringify(weekData));

})

// If the user opens the daily page (Not used)
app.post("/api/daily", async (req, res) => {
    console.log("A post to daily was made")

    console.dir(req.body);
    res.send("ok")
})

// app.post("/api/week", async (req, res) => {
//     console.log("A post to weekly was made")

//     console.dir(req.body);
//     res.send("ok")
// })


// If there was no matching webpage they searched for
app.get("*", (req, res) => {
    res.send("<h1>404 Page Not Found!</h1>");
})

// Start listening
app.listen(3000, () => {
    console.log("Listening on port 3000")
})