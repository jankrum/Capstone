// sql = `CREATE TABLE "22May2023" (
// 	"Morning"	INTEGER,
// 	"Afternoon"	INTEGER,
// 	"Confirm"	BOOLEAN,
//     "MorningName"    TEXT,
//     "AfternoonName"     TEXT
// );`;
// db.run(sql);

// Returns a list of strings that are the days of the current work week
const DATABASE_NAME = "/test.db";
const DATE_FORMAT = "en-US";

const sqlite3 = require('sqlite3').verbose();

function getTodayString() {
    return new Date().toLocaleDateString(DATE_FORMAT);
}

// Returns every week day of the current year as a list of strings
function getWorkDaysOfYear() {
    const today = new Date();
    const currentYear = today.getFullYear();
    const startDate = new Date(currentYear, 0, 1);
    const endDate = new Date(currentYear, 11, 31);

    const workDays = [];

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

function createTableAndInsertRows(id) {
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database(__dirname + DATABASE_NAME);

        // Check if table already exists
        db.get(`SELECT name FROM sqlite_master WHERE type='table' AND name=?;`, [id], (err, row) => {
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
                const sql = `CREATE TABLE ${id} (
          morning_number INTEGER,
          afternoon_number INTEGER,
          confirmed BOOLEAN,
          morning_name TEXT,
          afternoon_name TEXT,
          date TEXT
        );`;

                db.run(sql, (createErr) => {
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

        function insertRows() {
            const dates = getWorkDaysOfYear();

            const insertSql = `INSERT INTO ${id} (morning_number, afternoon_number, confirmed, morning_name, afternoon_name, date) VALUES (?, ?, ?, ?, ?, ?);`;
            const insertStatement = db.prepare(insertSql);

            // Iterate over array and insert rows
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
    });
}

function createMember(member) {
    createTableAndInsertRows(member)
        .then(() => {
            const year = getTodayString().slice(-4);
            console.log(`Successfully created a table for '${member}' for the year of ${year}!`)
        })
        .catch((err) => {
            console.error(`Error creating table or inserting rows for '${member}':`, err);
        });

}

function fillWeek(db, member) {
    const date = getTodayString();
    console.log(`Filling the week of '${date}' for '${member}'`);
    console.log("Week populated!!!");
}

function main(args) {
    const [command, member] = args;

    if (!command) {
        console.log("Missing a command");
        return;
    }

    if (!member) {
        console.log("Missing a member");
        return;
    }

    switch (command.toLowerCase()) {
        case "create_member":
            createMember(member);
            break;
        case "fill_week":
            fillWeek(member);
            break;
        default:
            console.log(`COMMAND '${command}' not known`);
    }
}

const arguments = process.argv.slice(2);
main(arguments);