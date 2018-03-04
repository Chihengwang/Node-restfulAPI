const Order =require('../models/order');
const Product=require('../models/product');
const mongoose= require('mongoose');
exports.orders_get_all=(req,res,next)=>{
    Order.find()
    .select('product quantity _id')
    //選擇想要填充的order 字段
    .populate('product','name')
    .exec()
    .then(docs=>{
        console.log(docs);
        res.status(201).json({
            count: docs.length,
            message:"Fetched all!!",
            orders: docs.map(doc=>{
                return{
                    _id:doc._id,
                    product: doc.product,
                    quantity: doc.quantity,
                    request:{
                        type:"GET",
                        url:"http://localhost:3000/order/"+doc._id
                    }
                }
            })
        });
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({
            error:err,
        })
    });
};
//======for post order
exports.orders_create_order=(req,res,next)=>{
    //we have to check whether we have the product id in the model Product
    //if not found, we couldn't save the order.
    Product.findById(req.body.productId)
    .then(product => {
        console.log(product)
        if (!product) {
          return res.status(404).json({
            message: "Product not found"
          });
        }
        const order = new Order({
          _id: mongoose.Types.ObjectId(),
          quantity: req.body.quantity,
          //這裡可以直接傳整個model.findbyid(id)對象
          product: req.body.productId
        });
        //if resolve return model object
        return order.save();
      })
      .then(result => {
        console.log(result);
        res.status(201).json({
          message: "Order stored",
          createdOrder: {
            _id: result._id,
            product: result.product,
            quantity: result.quantity
          },
          request: {
            type: "GET",
            url: "http://localhost:3000/order/" + result._id
          }
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
}

exports.orders_get_order=(req,res,next)=>{
    Order.findById(req.params.OrderId)
    .select('_id quantity product')
    .exec()
    .then((doc)=>{
        if(!doc){
            return res.status(404).json({
                message:"order not found",
            });
        }
        res.status(201).json({
            order:doc,
            request:{
                type:"GET",
                url: "http://localhost:3000/orders/" + doc._id
            }
        })
    })
    .catch((err)=>{
        res.status(500).json({
            error:err
        })
    })
}


exports.orders_delete_order=(req,res,next)=>{
    Order.remove({_id: req.params.OrderId}).exec()
    .then((doc)=>{
        res.status(201).json({
            message:"Delete sucessfully",
            order:doc,
            request:{
                type:"POST",
                url: "http://localhost:3000/orders/",
                body:{
                    productId:'ID',
                    quantity: 'Number'
                }
            }
        })
    })
    .catch((err)=>{
        res.status(500).json({
            error:err,
        })
    })
    
}