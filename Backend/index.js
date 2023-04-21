const express = require("express");
const app = express();
const path = require("path");

app.use(express.static(path.join(__dirname, "static")));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

app.get("/login", (req, res) => {
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