
const express = require('express');
const router= express.Router();
const mongoose=require('mongoose');
const Order=require('../models/order');
const Product=require('../models/product');
const checkAuth= require('../middleware/check-auth');
//這個地方的router 設定 是要設定給app.js裡面的app.use 去做router設定app.use('path',router)

const OrderController =require('../controllers/orders');

router.get('/',checkAuth,OrderController.orders_get_all);

router.post('/',checkAuth,OrderController.orders_create_order);
//冒號後面的變數名稱 要跟 下面的req.params裡面的變數名稱相同
router.get('/:OrderId',checkAuth,OrderController.orders_get_order);

router.delete('/:OrderId',checkAuth,OrderController.orders_delete_order);

module.exports=router;
