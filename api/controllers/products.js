const Product= require('../models/product');
const mongoose=require('mongoose');
exports.product_get_all=(req,res,next)=>{
    Product.find()
    .select('name price _id productImage')
    .exec()
    .then(docs=>{
        // console.log(docs);
        //If i don't want to fetch all the products, you can just pass the select method
        const response={
            count: docs.length,
            message:"Sucessfully fetched!!",
            products: docs.map(doc=>{
                return{
                    name: doc.name,
                    price: doc.price,
                    id: doc._id,
                    productImage: doc.productImage,
                    request:{
                        type:'GET',
                        url:"http://localhost:3000/product/"+doc.id
                    }
                }
            }),
        }
        res.status(200).json(response);
 
    })
    .catch(err=>{
        res.status(500).json({message:err})
    })
}

exports.products_create_product=(req,res,next)=>{
    console.log(req.file);
    const product=new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    });
    //product.save()是一個promist對象
    product.save().then(doc=>{
        console.log(doc);
        res.status(201).json({
            message:'Created product sucessfully',
            product: {
                    name: doc.name,
                    price: doc.price,
                    id: doc._id,
                    productImage: doc.productImage,
                    request:{
                        type:"GET",
                        url: "http://localhost:3000/product/"+doc._id
                    }
                }
            })
    }).catch(err=>{
        console.log(err.message);
        res.status(500).json({error:err})

    })
    // console.log(req.body);
}

exports.products_get_product=(req,res,next)=>{
    const id = req.params.productId;
    //使用product model 去取得id
    Product.findById(id)
    .select('name price _id productImage')
    .exec()
    .then(doc=>{
        console.log(doc);
        //http://localhost:3000/product/5a96bcf7d5d5ae3f5c0ab797
        //假如輸入未知的主健會得到null
        if(doc){
            res.status(200).json({
                product: doc,
                request:{
                    type:'GET',
                    url: "http://localhost:3000/product/"+doc._id
                }
            })
        }else{
            res.status(404).json({message:'no vaild!!'})
        }
        
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({error:err})
    })
}

exports.products_update_product=(req,res,next)=>{
    const id= req.params.productID;
    console.log(id);
    var updateOps={};
    //需要傳入陣列物件
    // req.body.forEach(element => {
    //     // console.log(Object.keys(element));
    //     Object.keys(element).forEach(key=>{
    //         updateOps[key]=element[key]
    //     })
    // });
    //設定要更改的數據為ops.propName 想要傳入的key值 ，ops.value是物件['key']的值
    for(const ops of req.body){
        console.log(ops);
        updateOps[ops.propName]=ops.value;
    }
    console.log(updateOps);
    Product.update({ _id: id }, { $set: updateOps })
    .exec()
    .then(doc => {
      console.log(doc);
      res.status(200).json({
          message:'product updated',
          request:{
                type:'GET',
                url: "http://localhost:3000/product/"+id
          }
      })
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
}


exports.products_delete_product=(req,res,next)=>{
    const id =req.params.productID;
    console.log(id);
    Product.remove({_id:id})
    .exec()
    .then(result=>{
        res.status(200).json({
            message:'Deleted sucessfully',
            type:"POST",
            url:"http://localhost:3000/product/",
            data_body:{
                name:"string",
                price:"number"
            }
        });
    })
    .catch(err=>{
        res.status(500).json({message:err})
    })
}