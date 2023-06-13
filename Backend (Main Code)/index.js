// Start of Ankrum
// Everyone's comments

const express = require('express');
const app = express();
app.use(express.json());
app.use(express.static(__dirname + "/public"));

const api = require(__dirname + "/api");

// Daily (The default)
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/daily.html');
})

// Also Daily
app.get('/daily', (req, res) => {
    res.sendFile(__dirname + '/public/daily.html');
})

// Week
app.get('/week', (req, res) => {
    res.sendFile(__dirname + '/public/week.html');
})

// Team
app.get('/team', (req, res) => {
    res.sendFile(__dirname + '/public/team.html');
})

// API stuff
app.get("/api/daily/:member",
    api.getDaily
)

app.post("/api/daily/:member",
    api.postDaily
)

app.get("/api/week/:member",
    api.getWeek
)
app.post("/api/week/:member",
    api.postWeek
)

// If there was no matching webpage they searched for
app.get("*", (req, res) => {
    res.send("<h1>404 Page Not Found!</h1>");
})

// Start listening
app.listen(3030, () => {
    console.log("Listening on port 3030");
})
