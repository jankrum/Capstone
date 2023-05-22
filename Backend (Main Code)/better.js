// This is Ankrum's code
// Church's comments

//Loads express
const express = require('express');
const { Callbacks } = require('jquery');
const path = require("path");

const app = express();

app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

const date = new Date().toLocaleDateString();


console.log(date);



// app.set("view engine", "ejs");
// app.set("views", path.join(__dirname, "/views"));


const sqlite3 = require('sqlite3').verbose();
let sql;

const db = new sqlite3.Database('/Users/john.church/Desktop/Capstone/Backend (Main Code)/test.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) return console.error(err.message);
    else
        console.log("Open database connection")
});

// sql = `CREATE TABLE "test" (
// 	"Morning"	INTEGER,
// 	"Afternoon"	INTEGER,
// 	"Confirm"	BOOLEAN,
//     "MorningName"    TEXT,
//     "AfternoonName"     TEXT
// );`;
// db.run(sql);


//Dummy data calender
const calendarDatabase = [
    {
        // Member name
        name: "snuffy",
        planner: [
            {
                // Date template
                date: "5/22/2023",
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
                date: "5/23/2023",
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
                date: "5/24/2023",
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
                date: "5/25/2023",
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
                date: "5/26/2023",
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
    const today = date;
    //Queries the database using the member name and today's date
    const data = queryDatabaseDay(member, today);

    //console.log(data);
    //Sends the data to the user
    res.send(JSON.stringify(data));
})

// Weekly 
app.get("/api/week/:member", async (req, res) => {
    const { member } = req.params;

    // const week = ['5/22/2023', '5/23/2023', '5/24/2023', '5/25/2023', '5/26/2023'];

    var weekData = [];

    var x = 0;
    const week = new Date(date)

    for (var i = 0; i < 5; i++) {
        week.setDate(week.getDate() + x)
        weekData.push(queryDatabaseWeek(member, week.toLocaleDateString()));
        console.log(week.toLocaleDateString())
        x = 1;
    }
    res.send(JSON.stringify(weekData));

})

// If the user opens the daily page (Not used)
app.post("/api/daily", async (req, res) => {
    console.log("A post to daily was made")

    var inputLine = req.body;
    var sqlVals = [];

    for (const i in inputLine) {
        sqlVals.push(inputLine[i])
    }
    sqlVals.push(date)
    console.log(sqlVals)

    sql = `UPDATE test SET Morning = ?, Afternoon = ?, Confirm = ?, MorningName = ?, AfternoonName = ? WHERE Date = ?`;

    db.run(sql, sqlVals, (err) => { if (err) return console.error(err.message); })


    db.close((err) => {
        if (err)
            console.log(err.message);
        else
            console.log('Close the database connection.')
    });

    console.dir(inputLine);
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
app.listen(3030, () => {
    console.log("Listening on port 3000")
})