const express = require("express");
const App = express();
const cors = require("cors");
const bearerToken = require("express-bearer-token");
const dotenv = require("dotenv");
dotenv.config()

const PORT = process.env.PORT;

App.use(cors());
App.use(express.json());
App.use(bearerToken());

App.get("/", (req, res) => {
    res.status(200).send("<h2>Attendance API</h2>")
})
// Import Route



App.listen(PORT, () => console.log("Attendance API Tunning :", PORT))