const express = require('express');
const app = express();

const path = require("path");
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
app.use(express.json());

async function getUserByUsername(username) {
    const fakeDB = [{
        "username": "jankrum",
        "id": "123",
        "passwordHash": "$2b$10$qKOX1T9Q9tc9cx/nGGgyxeIcciU03h.cryBBDXitHLJuTi6Q6xn3O"
    }]

    for (const user of fakeDB) {
        if (user.username == username) {
            return user;
        }
    }

    return null;
}


app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    // Query the database to get the user's hashed password
    const user = await getUserByUsername(username);
    if (!user) {
        console.log("\t-Username not found");
        // The user doesn't exist - return a 401 Unauthorized response
        return res.status(401).send('Invalid username or password');
    }

    // Compare the user's hashed password with the entered password
    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatch) {
        console.log("\t-Password unmatch");
        // The password is incorrect - return a 401 Unauthorized response
        return res.status(401).send('Invalid username or password');
    }

    // Generate a session token for the user
    //const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);

    // Set the session token as an HTTP-only cookie
    //res.cookie('sessionToken', token, { httpOnly: true });

    // Return a 200 OK response
    res.status(200).end();
});


app.get("/login", (req, res) => {
    console.log("Login request");
    res.render("login");
})

app.get("/dashboard", (req, res) => {
    res.send("YOURE IN");
})

app.get("/", (req, res) => {
    console.log("Login request");
    res.render("login");
})

// app.get("/home", (req, res) => {
//     console.log("Home request");
//     res.send("<h1>Home</h1>");
// })

app.get("*", (req, res) => {
    console.log(`404: ${req.originalUrl}`);
    res.render("notFound", { badUrl: req.originalUrl });
})

app.listen(3000, () => {
    console.log("listening on port 3000")
})