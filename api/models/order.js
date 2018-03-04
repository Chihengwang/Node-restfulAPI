const mongoose=require('mongoose');

const orderSchema=mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,//key
    //創建關聯
    product:{type:mongoose.Schema.Types.ObjectId,ref:'Product',required: true},
    //if you pass nothing, it would put one automatically.
    quantity:{type:Number,default:1}
});


module.exports=mongoose.model('Order',orderSchema);