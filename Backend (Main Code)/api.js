const DATABASE_NAME = "/test.db";
const DATE_FORMAT = "en-US";

const sqlite3 = require('sqlite3').verbose();

// Returns a promise
function queryRow(member, date) {
    return new Promise((resolve, reject) => {
        // Connect to the database
        const db = new sqlite3.Database(__dirname + DATABASE_NAME);

        // Prepare the SQL query
        const queryString = `SELECT "morning_number", "afternoon_number", "confirmed" FROM ${member} WHERE date = ?`;

        // Execute the query with the provided date
        db.get(queryString, [date], (err, row) => {
            if (err) {
                // Close the database connection and reject with the error
                db.close(closeErr => {
                    if (closeErr) {
                        console.error('Error closing database:', closeErr);
                    }
                    reject(err);
                });
            } else {
                // Close the database connection
                db.close(closeErr => {
                    if (closeErr) {
                        console.error('Error closing database:', closeErr);
                    }
                });

                // Resolve with the JSON string representation of the row
                resolve(JSON.stringify(row));
            }
        });
    });
}

// Used to populate a user's page when they load in
function getDaily(req, res) {
    const { member } = req.params;
    const today = new Date().toLocaleDateString(DATE_FORMAT);

    queryRow(member, today)
        .then(jsonString => {
            console.log(jsonString);
            res.send(jsonString);
        })
        .catch(err => {
            console.error(err);
            res.sendStatus(500);
        });
}

function postDaily(req, res) {
    console.log("Post to daily from " + req.member);
    console.log(req.body);
    res.sendStatus(200);
}

// Returns a list of strings that are the days of the current work week
function getWorkDaysOfWeek() {
    const currentDay = new Date();
    const currentDayOfWeek = currentDay.getDay();
    const weekStart = new Date(currentDay.setDate(currentDay.getDate() - currentDayOfWeek));

    const workDayIndexes = [1, 2, 3, 4, 5];

    return workDayIndexes.map(offset => {
        const workDay = new Date(weekStart);
        workDay.setDate(weekStart.getDate() + offset);
        return workDay.toLocaleDateString(DATE_FORMAT);
    })
}

// Given a member and a list of dates, returns a 
function queryRows(member, dates) {
    return new Promise((resolve, reject) => {
        // Connect to the database
        const db = new sqlite3.Database(__dirname + DATABASE_NAME);

        // Prepare the SQL query
        const queryString = `SELECT "morning_number", "afternoon_number" FROM ${member} WHERE date IN (${dates.map(() => '?').join(', ')})`;

        // Execute the query with the provided dates
        db.all(queryString, dates, (err, rows) => {
            if (err) {
                // Close the database connection and reject with the error
                db.close((closeErr) => {
                    if (closeErr) {
                        console.error('Error closing database:', closeErr);
                    }
                    reject(err);
                });
            } else {
                // Close the database connection
                db.close((closeErr) => {
                    if (closeErr) {
                        console.error('Error closing database:', closeErr);
                    }
                });

                // Map the rows to an object under the "week" key
                const result = { week: rows };

                // Resolve with the JSON string representation of the result
                resolve(JSON.stringify(result));
            }
        });
    });
}

// Callback for express server that gets the user's current week
function getWeek(req, res) {
    const { member } = req.params;
    const daysOfWeek = getWorkDaysOfWeek();

    queryRows(member, daysOfWeek)
        .then(jsonString => {
            console.log(jsonString);
            res.send(jsonString);
        })
        .catch(err => {
            console.error(err);
            res.sendStatus(500);
        });
}

function postWeek(req, res) {
    console.log("Post to week!");
    res.sendStatus(200);
}

// // If the user opens the daily page (Not used)
// app.post("/api/daily", async (req, res) => {
//     console.log("A post to daily was made")

//     const today = new Date().toLocaleDateString();

//     var inputLine = req.body;
//     var sqlVals = [];

//     for (const i in inputLine) {
//         sqlVals.push(inputLine[i])
//     }
//     sqlVals.push(today)
//     console.log(sqlVals)

//     sql = `UPDATE ${ sqlVals[0] } SET Morning = ?, Afternoon = ?, Confirm = ?, MorningName = ?, AfternoonName = ? WHERE Date = ? `;

//     sqlVals.shift();

//     const confirm = new sqlite3.Database('./Backend (Main Code)/test.db', (err) => {
//         if (err) return console.error(err.message);
//         else
//             console.log("Open database connection")
//     });

//     confirm.run(sql, sqlVals, (err) => { if (err) return console.error(err.message); })


//     confirm.close((err) => {
//         if (err)
//             console.log(err.message);
//         else
//             console.log('Close the database connection.')
//     });

//     console.dir(inputLine);
//     res.send("ok")
// })
// End of Church

module.exports = { getDaily, postDaily, getWeek, postWeek };