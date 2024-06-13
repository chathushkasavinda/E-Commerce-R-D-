const port = 4001;
const express =require("express")
const app = express();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const { error } = require("console");

app.use(express.json())
app.use(cors())

// Database connection mongoDB

mongoose.connect('mongodb://chathushkasavinda18:savinda123@ac-ctoyxy1-shard-00-00.6a4chek.mongodb.net:27017,ac-ctoyxy1-shard-00-01.6a4chek.mongodb.net:27017,ac-ctoyxy1-shard-00-02.6a4chek.mongodb.net:27017/JBC?ssl=true&replicaSet=atlas-6vyeyv-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0');

// API creation

app.get('/',(req,res)=>{
    res.send('express is running')
})

// Image storage engine

const storage = multer.diskStorage({
    destination:'./upload/images',
    filename:(req,file,cb)=>{
        return cb(null,`${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})

const upload = multer({storage:storage});

// Creating endpoint for images
app.use(('/images',express.static('upload/images')))
app.post("/upload",upload.single('product'),(req, res)=>{
    res.json({
        success:1,
        image_url:`http://localhost:${port}/images/${req.file.filename}`
    })
})

// schema for creating products

const Product = mongoose.model('Product',{
    id:{
        type:Number,
        required: true,
    },
    name:{
        type:String,
        required: true,
    },
    image:{
        type:String,
        required: true,
    },
    new_price:{
        type:Number,
        required: true,
    },
    old_price:{
        type:Number,
        required: true,
    },
    date:{
        type:Date,
        default:Date.now
    },
    available:{
        type:Boolean,
        default:true,
    },
})

app.post('/addproduct',async(req,res)=>{
    const product = new Product({
        id:req.body.id,
        name:req.body.name,
        image:req.body.image,
        category:req.body.category,
        new_price:req.body.new_price,
        old_price:req.body.old_price,
    });
    console.log(product)
    await product.save();
    console.log("Saved");
    res.json({
        success:true,
        name:req.body.name,
    })
})

app.listen(port, (error)=>{
    if(!error){
        console.log("server is runngin " + port)
    } else {
        console.log("error" + error)
    }
})