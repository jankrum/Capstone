// This is Ankrum's code
const express = require('express');
const path = require("path");

const app = express();

app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));
// app.set("view engine", "ejs");
// app.set("views", path.join(__dirname, "/views"));

const calendarDatabase = [
    {
        name: "snuffy",
        planner: [
            {
                date: "12MAY2023",
                morning: {
                    name: undefined,
                    value: undefined
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

app.get("/test", (req, res) => {
    console.log("Daily request");
    res.send("<h1>Test!</h1>")
})

app.get("/api/daily/:member", async (req, res) => {
    const { member } = req.params;

    const today = "13MAY2023";

    const data = queryDatabase(member, today);

    //console.log(data);

    res.send(JSON.stringify(data));
})


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