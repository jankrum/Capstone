// Start of Ankrum
// Everyone's comments

//Loads express
const express = require('express');
const path = require("path");

const app = express();

app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

const sqlite3 = require('sqlite3').verbose();

// Test page
app.get("/test", (req, res) => {
    console.log("Daily request");
    res.send("<h1>Test!</h1>")
})

// Daily
app.get('/daily', function (req, res) {
    res.sendFile(__dirname + '/public/daily.html');
})

// Week
app.get('/week', function (req, res) {
    res.sendFile(__dirname + '/public/week.html');
})

// Team
app.get('/team', function (req, res) {
    res.sendFile(__dirname + '/public/team.html');
})

// Start of Baker and Church
// Used to populate a user's page when they load in
app.get("/api/daily/:member", async (req, res) => {
    const { member } = req.params;

    const today = new Date().toLocaleDateString();

    // Establishes a connection to the database
    const db = new sqlite3.Database('./test.db', err => {
        if (err) {
            console.log("Error creating connection to database");
            console.error(err.message);
            res.status(500).send("Server error");
        }
    });

    const queryString = `SELECT "Morning", "Afternoon", "Confirmed" FROM ${member} WHERE Date = '${today}'`;
    console.log(queryString);

    // Queries the database
    db.get(queryString, (err, row) => {
        if (err) {
            console.log("Error querying database");
            console.error(err.message);
            res.status(500).send("Server error");
        } else {
            res.send(JSON.stringify(row));
        }
    });

    db.close((err) => {
        if (err) {
            console.log("Error closing connection to database");
            console.log(err.message);
        }
    });
})
// End of Baker

// Start of Church
// Week
app.get("/api/week/:member", async (req, res) => {
    const { member } = req.params;

    // const week = ['5/22/2023', '5/23/2023', '5/24/2023', '5/25/2023', '5/26/2023'];

    var weekData = [];

    const week = new Date();

    for (var i = 0; i < 5; i++) {
        weekData.push(queryDatabaseWeek(member, week.toLocaleDateString()));
        console.log(week.toLocaleDateString())
        week.setDate(week.getDate() + 1)
    }

    res.send(JSON.stringify(weekData));
})

// If the user opens the daily page (Not used)
app.post("/api/daily", async (req, res) => {
    console.log("A post to daily was made")

    const today = new Date().toLocaleDateString();

    var inputLine = req.body;
    var sqlVals = [];

    for (const i in inputLine) {
        sqlVals.push(inputLine[i])
    }
    sqlVals.push(today)
    console.log(sqlVals)

    sql = `UPDATE ${sqlVals[0]} SET Morning = ?, Afternoon = ?, Confirm = ?, MorningName = ?, AfternoonName = ? WHERE Date = ?`;

    sqlVals.shift();

    const confirm = new sqlite3.Database('./Backend (Main Code)/test.db', (err) => {
        if (err) return console.error(err.message);
        else
            console.log("Open database connection")
    });

    confirm.run(sql, sqlVals, (err) => { if (err) return console.error(err.message); })


    confirm.close((err) => {
        if (err)
            console.log(err.message);
        else
            console.log('Close the database connection.')
    });

    console.dir(inputLine);
    res.send("ok")
})
// End of Church

// If there was no matching webpage they searched for
app.get("*", (req, res) => {
    res.send("<h1>404 Page Not Found!</h1>");
})

// Start listening
app.listen(3030, () => {
    console.log("Listening on port 3030")
})
