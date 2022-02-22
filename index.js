const dotenv = require("dotenv");
const express = require("express");
const App = express();
const cors = require("cors");
const bearerToken = require("express-bearer-token");
dotenv.config()

const PORT = process.env.PORT;

App.use(cors());
App.use(express.json());
App.use(bearerToken());

const {db} = require('./config/database')
db.getConnection((err,connection) => {
    if(err){
        console.log(`error mysql:`, err)
    }
    console.log(`connection to mysal server : ${connection.threadId}`) 
})

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
const { sessionRoute,usersRoute,attendanceRoutes } = require("./routers");

App.use('/session',sessionRoute)
App.use('/users', usersRoute);
App.use('/attendance', attendanceRoutes)

App.listen(PORT, () => console.log("Attendance API Tunning :", PORT))