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

const { db } = require('./config/database')
db.getConnection((err, connection) => {
    if(err) {
        console.log(`err mysql connecntion`, err.message)
    }
    console.log(`connected mysql: ${connection.threadId}`)
})
// Import Route

const { attendanceRoute } = require('./routers');
App.use('/attendance', attendanceRoute);



App.listen(PORT, () => console.log("Attendance API Tunning :", PORT))