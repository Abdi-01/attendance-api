const { db, dbQuery } = require('../config/database');
const { hashPassword } = require('../config/jwt');
const { uploader } = require('../config/multer');

module.exports = {
    getData: (req, res, next) => {
        db.query(
            `SELECT * FROM users;`,
            (err, results) => {
                if (err) {
                    console.log(err)
                    res.status(400).send(err)
                };
                res.status(200).send(results);
            })
    },
    register: async (req, res) => {
        try {
            const uploadFile = uploader("/imgProducts", "IMGUSER").array("images", 1)
            uploadFile(req, res, async (error) => {
                try {
                    console.log("file", req.files)
                    console.log("req.body", req.body.data)
                    let { nis, fullname, email, password, idsession, phone, age, address, filename, gender, idrole, idstatus } = JSON.parse(req.body.data)
                    let insertSQL = await dbQuery(`INSERT INTO users (iduser, nis, fullname, email, password, idsession, phone, age, address, photo, gender, idrole, idstatus) VALUES
                    (null,
                    ${nis}, 
                    ${db.escape(fullname)}, 
                    ${db.escape(email)}, 
                    ${db.escape(hashPassword(password))},
                    ${idsession},
                    ${db.escape(phone)},
                    ${age},
                    ${db.escape(address)},
                    ${db.escape(`http://localhost:2500/imgProducts/${req.files[0].filename}`)},
                    ${db.escape(gender)},
                    ${idrole},
                    ${idstatus});`)
                    res.status(200).send({
                        success: true,
                        message: "register success"
                    })
                } catch (error) {
                    console.log(error)
                    res.status(500).send({
                        success: true,
                        message: "Failed ❌",
                        error: ""
                    });
                }
            })
        } catch (error) {
            console.log(error)
            res.status(500).send({
                success: true,
                message: "Failed ❌",
                error: ""
            });
        }
    }
}