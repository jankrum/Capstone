const DATABASE_NAME = "/test.db";
const DATE_FORMAT = "en-US";

const sqlite3 = require('sqlite3').verbose();

// Returns every week day of the current year as a list of strings
function getWorkDaysOfYear() {
    const today = new Date();
    const currentYear = today.getFullYear();
    const startDate = new Date(currentYear, 0, 1);
    const endDate = new Date(currentYear, 11, 31);

    const workDays = [];

    // Returns the incremented date
    function incrementDate(date) {
        return new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
    }

    // Iterate over each day between start and end date
    let date = startDate;
    while (date <= endDate) {
        const dayOfWeek = date.getDay();

        // Add the date to workDays if it's not a weekend (Saturday or Sunday)
        if (dayOfWeek !== 0 && dayOfWeek !== 6) {
            workDays.push(date.toLocaleDateString(DATE_FORMAT));
        }

        date = incrementDate(date);
    }

    return workDays;
}

// Given an id, potentially creates a table for the given id and populates it with rows for every weekday 
function createTableAndInsertRows(id) {
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database(__dirname + DATABASE_NAME);

        // Inserts all of the weekdays of current year into the table we found/created
        function insertRows() {
            const insertQuery = `INSERT INTO ${id} (morning_number, afternoon_number, confirmed, morning_name, afternoon_name, date) VALUES (?, ?, ?, ?, ?, ?);`;
            const insertStatement = db.prepare(insertQuery);

            const dates = getWorkDaysOfYear();

            // For every weekday of the year, add it to the database
            dates.forEach((date) => {
                insertStatement.run(0, 0, false, '', '', date);
            });

            insertStatement.finalize((finalizeErr) => {
                if (finalizeErr) {
                    console.error('Error finalizing statement:', finalizeErr);
                }

                db.close((closeErr) => {
                    if (closeErr) {
                        console.error('Error closing database:', closeErr);
                    }
                    resolve();
                });
            });
        }

        // Check if table already exists
        db.get("SELECT name FROM sqlite_master WHERE type='table' AND name=?;", [id], (err, row) => {
            if (err) {
                db.close((closeErr) => {
                    if (closeErr) {
                        console.error('Error closing database:', closeErr);
                    }
                    reject(err);
                });
            } else if (row) {
                // Table exists, no need to create it
                console.log(`Table '${id}' already exists.`);
                insertRows();
            } else {
                // Table does not exist, create it
                const createTableQuery = `CREATE TABLE ${id} (
          morning_number INTEGER,
          afternoon_number INTEGER,
          confirmed BOOLEAN,
          morning_name TEXT,
          afternoon_name TEXT,
          date TEXT
        );`;
                console.log(`Table '${id}' does not exist-- currently making it.`);

                db.run(createTableQuery, (createErr) => {
                    if (createErr) {
                        db.close((closeErr) => {
                            if (closeErr) {
                                console.error('Error closing database:', closeErr);
                            }
                            reject(createErr);
                        });
                    } else {
                        console.log(`Table '${id}' created.`);
                        insertRows();
                    }
                });
            }
        });
    });
}

const member = process.argv[2];

if (member) {
    // If there is an argument for member, create/populate a table for the member
    createTableAndInsertRows(member)
        .then(() => {
            const year = new Date().getFullYear();
            console.log(`Successfully populated table '${member}' for the year of ${year}!`);
        })
        .catch((err) => {
            console.error(`Error creating table or inserting rows for '${member}':`, err);
        });
} else {
    // If no member was given, tell the user
    console.error("Missing member argument");
}