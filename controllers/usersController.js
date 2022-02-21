const {db,dbQuery} = require('../config/database');
const {createToken, hashPassword} = require('../config/jwt')

module.exports={
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