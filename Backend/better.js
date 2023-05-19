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
            }
        ]
    }
];

// Collects data from the calender database for the user upon page load
function queryDatabase(member, date) {
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
    const today = "13MAY2023";
    //Queries the database using the member name and today's date
    const data = queryDatabase(member, today);

    //console.log(data);
    //Sends the data to the user
    res.send(JSON.stringify(data));
})

// If the user opens the daily page (Not used)
app.post("/api/daily", async (req, res) => {
    console.log("A post to daily was made")

    console.dir(req.body);
    res.send("ok")
})


// If there was no matching webpage they searched for
app.get("*", (req, res) => {
    res.send("<h1>404 Page Not Found!</h1>");
})

// Start listening
app.listen(3000, () => {
    console.log("Listening on port 3000")
})