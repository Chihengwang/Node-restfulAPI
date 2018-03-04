const mongoose=require('mongoose');
const User = require('../models/user');
//use bcrypt package to encrypt our password
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


exports.user_get_all=(req,res,next)=>{
    User.find()
    .select('_id email password')
    .exec()
    .then(docs=>{
        res.status(200).json(docs);
    })
    .catch(err=>{
        res.status(404).json({
            error : err
        })
    })
};
exports.user_signup=(req,res,next)=>{
    //dealing with the existent email
    User.find({email:req.body.email})
    .exec()
    .then(user=>{
        // console.log(user);
        if(user.length>0){
            res.status(409).json({
                message:'User exist!!!'
            })
        }else{
            bcrypt.hash(req.body.password,10,(err,hash)=>{
                if(err){
                    return res.status(500).json({
                        error:err
                    });
                }else{
                    const user= new User({
                        _id: new mongoose.Types.ObjectId(),
                        email: req.body.email,
                        password: hash
                    })
                    //資料傳進來的格式不符合email的re就會傳出error
                    user.save()
                    .then(result=>{
                        console.log(result);
                        res.status(201).json({
                            message:'user created',
                            user:result
                        });
                    })
                    .catch(err=>{
                        console.log(err);
                        res.status(500).json({
                            error:err,
                        });
                    });
                }
            })
        }
        //the user data you send in is the empty array
        //so if you want to chech the user is null just to 
        //make sure that the length of this array is zero.
    });
}

exports.user_login=(req,res,next)=>{
    User.find({email:req.body.email})
    .exec()
    .then(user=>{
        if(user.length<1){
            //Auth failed
            return res.status(401).json({
                message:'This email is not vaild or not existing!'
            });
        }
        bcrypt.compare(req.body.password,user[0].password,(err,result)=>{
            if(err){
                return res.status(401).json({
                    message:'This email is not vaild or not existing!'
                });
            }
            if(result){
                const token = jwt.sign({
                    email: user[0].email,
                    _id: user[0]._id,
                },process.env.JWT_KEY,
                {
                    expiresIn: "1h",
                });
                console.log(process.env.JWT_KEY);
                return res.status(200).json({
                    message:'Auth successfully',
                    token: token
                })
            }
            res.status(401).json({
                message:"Auth failed",
            });
        })
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({
            error:err
        })
    })
}

exports.user_delete=(req,res,next)=>{
    User.remove({_id: req.params.userId})
    .exec()
    .then(doc=>{
        res.status(200).json({
            message:'delete sucessfully'
        })
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({
            error:err
        })
    })
}