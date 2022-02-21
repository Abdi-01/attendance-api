// gunakan createPool

const mysqsl = require('mysql');
const util = require('util');
const db = mysqsl.createPool({
    connectionLimit: 1000,
    connectTimeout: 60 * 60 * 1000,
    acquireTimeout: 60 * 60 * 1000,
    host: process.env.DB_HOST,
    user: "root",
    password: "root",
    database: "attendace",
});
const dbQuery = util.promisify(db.query).bind(db);
module.exports = {db,dbQuery};
