// Ankrum's code and comments


const express = require('express');
const app = express();
app.use(express.json());
app.use(express.static(__dirname + "/public"));

// Stuff we use to authenticate
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
app.use(express.json());

// Mock database call function
async function getUserByUsername(username) {
    const fakeDB = [{
        "username": "jankrum",
        "id": "123",
        "passwordHash": "$2b$10$qKOX1T9Q9tc9cx/nGGgyxeIcciU03h.cryBBDXitHLJuTi6Q6xn3O"
    }]

    // Search the database for a matching username
    for (const user of fakeDB)
        if (user.username == username)
            return user;
}

// Authenticate username and password
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    console.log("Login attempt");

    // Query the database to get the user's hashed password
    const user = await getUserByUsername(username);
    if (!user) {
        console.log("-Username not found");  // Used for debugging
        // The user doesn't exist - return a 401 Unauthorized response
        return res.status(401).send('Invalid username or password');
    }

    // Compare the user's hashed password with the entered password
    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatch) {
        console.log("-Password unmatch");  // Used for debugging
        // The password is incorrect - return a 401 Unauthorized response
        return res.status(401).send('Invalid username or password');
    }

    console.log("-Successful login!")

    // Generate a session token for the user
    //const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);

    // Set the session token as an HTTP-only cookie
    //res.cookie('sessionToken', token, { httpOnly: true });

    // Return a 200 OK response
    res.status(200).end();
});

// If the user is requesting a login
app.get("/login", (req, res) => {
    console.log("Login request");
    res.render("login");
})

// If they are not requesting any specific page
app.get("/", (req, res) => {
    console.log("Login request");
    res.render("login");
})

// If they are requesting the dashboard
app.get("/dashboard", (req, res) => {
    console.log("Dashboard request");
    res.send("dashboard");
})

// If there was no matching webpage they searched for
app.get("*", (req, res) => {
    res.render("notFound", { badUrl: req.originalUrl });
})

// Start listening
app.listen(3000, () => {
    console.log("Listening on port 3000")
})