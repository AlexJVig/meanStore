const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');


const Product = require('../models/product');

router.get('/',(req,res,next) => {
    Product.find()
        .select('name price _id').exec().then(docs=>{
        const response = {
            count : docs.length,
            products : docs.map(doc=>{
                return{
                    name: doc.name,
                    price : doc.price,
                    _id : doc.id,
                    url:{
                        request:{
                            type:'GET',
                            url:'http://localhost:3000/products/'+ doc._id
                        }
                    }
                }
            })
        };
        res.status(200).json(response);
    })
        .catch(err=> {
            console.log(err);
            res.status(500).json({error:err});
        });
});


router.post('/',(req,res,next) => {
    const product = new Product({
        _id : new mongoose.Types.ObjectId(),
        name: req.body.name,
        price:req.body.price
    });
    product.save().then(result =>{
        res.status(201).json({
            message:'Created product successfully',
            createdProduct: {
                name: result.name,
                price : result.price,
                _id : result.id,
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/products/' + result._id
                }
            }
        });
    })
        .catch(err=> {
            console.log(err);
            res.status(500).json({error:err});
        });
});


router.get('/:productID',(req,res,next) => {
    const id = req.params.productID;
    Product.findById(id).select('name price _id').exec().then(doc=>{
        console.log("From DB",doc);
        if(doc) {
            res.status(200).json({
                product: doc,
                request: {
                    type:'GET',
                    url: 'http;//localhost:3000/products'
                }
            });
        }else{
            res.status(404).json({message : 'No valid entry found for ID'});
        }
    })
        .catch(err=> {
            console.log(err);
            res.status(500).json({error:err});
        });
});

router.patch('/:productID',(req,res,next) => {
    const id = req.params.productID;
    const updateOpt = {};
    for (const ops of req.body){
        updateOpt[ops.propName] = ops.value;
    }
    Product.update({_id:id},{$set : updateOpt})
        .select('name price _id').exec().then(result=>{
        res.status(200).json({
            message:'Product updated',
            request: {
                type:'GET',
                url: 'http;//localhost:3000/products' +id
            }
        });
    })
        .catch(err=> {
            console.log(err);
            res.status(500).json({error:err});
        });
});


router.delete('/:productID',(req,res,next) => {
    const id = req.params.productID;
    Product.remove({_id:id})
        .exec().then(result=>{
        res.status(200).json({
            message:'Product deleted',
            request: {
                type:'POST',
                url: 'http;//localhost:3000/products',
                body:{name : 'String',price:'Number'}
            }
        });
    })
        .catch(err=> {
            console.log(err);
            res.status(500).json({error:err});
        });
});


module.exports = router;