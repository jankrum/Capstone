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

// Given data it confirms to the database
function updateTodayInDatabase(name, data) {
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database(__dirname + DATABASE_NAME);

        const morningNumber = data.morning_number;
        const afternoonNumber = data.afternoon_number;
        const morningName = data.morning_name;
        const afternoonName = data.afternoon_name;
        const date = new Date().toLocaleDateString(DATE_FORMAT);

        if (!morningNumber || !afternoonNumber || !morningName || !afternoonName) {
            console.error(data);
            reject("Missing number or name in data ^");
        }

        const query = `UPDATE ${name} SET morning_number = ?, afternoon_number = ?, confirmed = 1, morning_name = ?, afternoon_name = ? WHERE date = ?;`;

        db.run(query, [morningNumber, afternoonNumber, morningName, afternoonName, date], function (err) {
            if (err) {
                db.close((closeErr) => {
                    if (closeErr) {
                        console.error('Error closing database:', closeErr);
                    }
                    reject(err);
                });
            } else {
                const numRowsUpdated = this.changes;
                console.log(`Updated ${numRowsUpdated} row(s) for name '${name}' and date '${date}'.`);

                db.close((closeErr) => {
                    if (closeErr) {
                        console.error('Error closing database:', closeErr);
                    }
                    resolve();
                });
            }
        });
    });
}

// Updates todays value in databse and confrims
function postDaily(req, res) {
    const { member } = req.params;
    const data = req.body;

    updateTodayInDatabase(member, data)
        .then(() => {
            console.log('Confirmation successful.');
            res.sendStatus(200);
        })
        .catch((err) => {
            console.error('Error updating confirmation:', err);
            res.sendStatus(500);
        });
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

// Given a member and a list of dates, returns the morning and afternoon numbers for those dates
function queryRows(member, dates) {
    return new Promise((resolve, reject) => {
        // Connect to the database
        const db = new sqlite3.Database(__dirname + DATABASE_NAME);

        // Prepare the SQL query
        const queryString = `SELECT "morning_number", "afternoon_number", "date" FROM ${member} WHERE date IN (${dates.map(() => '?').join(', ')})`;

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
            // console.log(jsonString);
            res.send(jsonString);
        })
        .catch(err => {
            console.error(err);
            res.sendStatus(500);
        });
}

// Queries database and updates morning or afternoon values in database
function updateSpecificDayInDatabase(member, data) {
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database(__dirname + DATABASE_NAME);

        const { date, half, number, name } = data;
        const halfNumber = `${half}_number`;
        const halfName = `${half}_name`;

        const query = `UPDATE ${member} SET '${halfNumber}' = ${number}, '${halfName}' = '${name}' WHERE date = '${date}';`;
        console.log(query);

        db.run(query, function (err) {
            if (err) {
                db.close((closeErr) => {
                    if (closeErr) {
                        console.error('Error closing database:', closeErr);
                    }
                    reject(err);
                });
            } else {
                const numRowsUpdated = this.changes;
                console.log(`Updated ${numRowsUpdated} row(s) for name '${member}' and date '${date}'.`);

                db.close((closeErr) => {
                    if (closeErr) {
                        console.error('Error closing database:', closeErr);
                    }
                    resolve();
                });
            }
        });
    });
}

// Posts the value from the weekly changes to the database
function postWeek(req, res) {
    const { member } = req.params;
    const data = req.body;

    updateSpecificDayInDatabase(member, data)
        .then(() => {
            console.log('Week change successful.');
            res.sendStatus(200);
        })
        .catch((err) => {
            console.error('Error changing weekday:', err);
            res.sendStatus(500);
        });
}

module.exports = { getDaily, postDaily, getWeek, postWeek };