const {db,dbQuery} = require('../config/database');
const {createToken, hashPassword} = require('../config/jwt')
const { uploader } = require('../config/multer');

module.exports={
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
   },
    login: async (req,res)=>{
        try{
            let {nis,password} = req.body;
            let loginSQL = await dbQuery(`select u.*,r.role,s.session,t.status from users u join session s on u.idsession = s.idsession join role r on u.idrole = r.idrole join status t on u.idstatus=t.idstatus where nis = '${nis}' and password = '${hashPassword(password)}';`);
            if(loginSQL.length > 0){
                let {iduser,session,role,status,nis,email,phone,age,address,photo,gender,fullname} = loginSQL[0];
                let token = createToken({iduser,session,role,status,nis,email,phone,age,address,photo,gender,fullname});
                console.log("login success ✔")
                res.status(200).send({
                    success : true,
                    message : 'Login Success',
                    dataLogin : {nis,fullname,token,photo,session,role,status,nis,email,phone,age,address,gender},
                    error : ''
                })
            }else{
                res.status(200).send({
                    success : false,
                    message : 'Login Failed'
                })
            }
        }
        catch (error){
            console.log('error login', error);
            res.status(500).send({
                success : false,
                message : 'API LOGIN ERROR',
                error
            })
        }
    },
    keepLogin: async (req,res)=>{
        try{
            // iduser hanya untuk fungsi select dan ada pada token. tidak ditampilkan pada reducer
            if(req.dataStudent.iduser){
                console.log("keep login berhasil ✔")
                let keepSQL = await dbQuery(`select u.*,r.role,s.session,t.status from users u join session s on u.idsession = s.idsession join role r on u.idrole = r.idrole join status t on u.idstatus=t.idstatus where iduser=${req.dataStudent.iduser};`);
                // console.log('hasil', keepSQL);
                let {session,role,status,nis,email,phone,age,address,photo,gender,fullname,iduser} = keepSQL[0];
                let token = createToken({session,role,status,nis,email,phone,age,address,photo,gender,fullname,iduser});
                    res.status(200).send({
                        message : 'keep success',
                        success : true,
                        dataKeep : {session,role,status,nis,email,phone,age,address,photo,gender,token,fullname}
                    })
            }
        }
        catch(error){
            console.log('error keep login :', error);
            res.status(500).send({
                success : false,
                message : 'Keep failed',
                error
            })
        }
    }
}