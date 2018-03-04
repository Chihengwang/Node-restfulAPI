
const express = require('express');
const router= express.Router();
const mongoose=require('mongoose');
const Product=require('../models/product');
const multer= require('multer');
const checkAuth=require('../middleware/check-auth');

const ProductsController=require('../controllers/products');

var storage = multer.diskStorage({
    //设置上传后文件路径，uploads文件夹会自动创建。
       destination: function (req, file, cb) {
           cb(null, './uploads')
      }, 
    //给上传文件重命名，获取添加后缀名
     filename: function (req, file, cb) {
         var fileFormat = (file.originalname).split(".");
         cb(null, file.fieldname + '-' + Date.now() + "." + fileFormat[fileFormat.length - 1]);
     }
});  
const fileFilter=(req,file,cb)=>{
    //reject the file
    if(file.mimetype==='image/jpeg'||file.mimetype==='image/png'){
        cb(null,true);
    }else{
        cb(null,false);      
    }

}
const upload= multer({storage:storage,
    limits:{
        //5MB
        fileSize: 1024*1024*5,
    },
    fileFilter:fileFilter,
})
//這個地方的router 設定 是要設定給app.js裡面的app.use 去做router設定app.use('path',router)
//取得所有data product.find()就是取得所有資料
router.get('/',ProductsController.product_get_all);
//對這個post加入中間件
router.post('/',checkAuth,upload.single('productImage'),ProductsController.products_create_product);
//冒號後面的變數名稱 要跟 下面的req.params裡面的變數名稱相同
router.get('/:productId',checkAuth,ProductsController.products_get_product);

//另外定義一個update 用的route router.patch
router.patch('/:productID',checkAuth,ProductsController.products_update_product);

router.delete('/:productID',checkAuth,ProductsController.products_delete_product);
module.exports=router;
