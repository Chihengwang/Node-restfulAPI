const express = require('express');

const app = express();
const bodyParser= require('body-parser');
const morgan= require('morgan');
const mongoose=require('mongoose');

//connect to mongo db

mongoose.connect('mongodb://node-shop:'+process.env.MONGODB_PW+'@cluster0-shard-00-00-9sev8.mongodb.net:27017,cluster0-shard-00-01-9sev8.mongodb.net:27017,cluster0-shard-00-02-9sev8.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin');

mongoose.Promise=global.Promise;
// 解析 application/json
app.use(bodyParser.json());	
// 解析 application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended:false}));
app.use('/uploads',express.static('uploads'))
app.use(morgan('dev'));
//引入product 的 router

//開放給所有client端可以去打這個api
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    // console.log(req.method);
    if (req.method === 'OPTIONS') {
        // console.log(req.method);
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
  });
  //===============================================================
const productRouter= require('./api/routes/products');
//引入 order 的router
const orderRouter=require('./api/routes/order');

const userRouter=require('./api/routes/user');
//設定router的prefix
app.use('/product',productRouter);

app.use('/order', orderRouter);

app.use('/user', userRouter);
//處理錯誤的route如下
app.use((req, res, next) => {
    const error = new Error("not found");
    //新增一個對象 裡面給status code =404
    error.status=404;
    next(error);
});

app.use((error,req, res, next) => {
    res.status(error.status||500);
    res.json({
        error:{
            message:error.message
        }
    });

});


module.exports=app;