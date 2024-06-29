const port = 1023;
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
app.use('/images',express.static('upload/images'))
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
    category:{
        type:String,
        required:true,
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
    console.log('addproduct')
    let products = await Product.find({});
    let id;
    if(products.length>0){
        let last_product_array = products.slice(-1);
        let last_product = last_product_array[0];
        id = last_product.id+1;
    }else{
        id = 1;
    }
    const product = new Product({
        id:id,
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

// Delete products

app.post('/removeproduct',async(req,res)=>{
    await Product.findOneAndDelete({id:req.body.id});
    console.log("Removed");
    res.json({
        success:true,
        name:req.body.name
    })
})

// getting all products
app.get('/allproducts',async(req,res)=>{
   let products =  await Product.find({});
   console.log('All products fetched')
   res.send(products)
})

const User = mongoose.model('User',{
    name:{
        type:String,
    },
    email:{
        type:String,
        unique:true,
    },
    password:{
        type:String,   
    },
    cartData:{
        type:Object,
    },
    date:{
        type:Date,
        default:Date.now
    }
});

app.get('/signup',async(req,res)=>{
    console.log("get signup")
})

app.post('/signup',async(req,res)=>{
    console.log("signup section")
    let check = await User.findOne({email:req.body.email});
    if(check){
        return res.status(400).json({
            success:false,
            errors:"Existing user found with same email",
        });
    }
    let cart = {}
    for(let i = 0; i<300; i++){
        cart[i] = 0;
    }
    const user = new User({
        name:req.body.name,
        email:req.body.email,
        password:req.body.password,
        cartData:cart,
    })

    await user.save();
    const data = {
        user:{
            id: user.id,
        },
    };

    const token = jwt.sign(data, "secret_ecom");
    res.json({success:true,token})
})

// create user login 

app.post('/login',async(req,res)=>{
    let user = await User.findOne({email:req.body.email})
    if(user){
        const passMatch = req.body.password === user.password;
        if(passMatch){
            const data = {
                user: {
                    id:user.id,
                },
            };
            const token = jwt.sign(data,'secret_ecom')
            res.json({success:true,token});
        }else{
            res.json({success:false,errors:'Wrong password'});
        }
    }else{
        res.json({success:false,errors:'Wrong Email address'});
    }
});

// new collection

app.get('/newcollection',async (req,res)=>{
    let products = await Product.find({});
    let newcollection = products.slice(1).slice(-8);
    console.log("new collection fetching");
    res.send(newcollection);
})

// popular

app.get('/popularproducts',async (req,res)=>{
    let products = await Product.find({category:'clothing'});
    let popularproducts = products.slice(0, 4);
    console.log("popurlar products fetching");
    res.send(popularproducts);
})

//creating middleware to fetch user
const fetchUser = async (req, res, next) => {
    const token = req.header('auth-token');
    if(!token){
        res.status(401).send({errors: "please authenticate using valid login"});
    } else{
        try {
            const data = jwt.verify(token, "secret_ecom");
            req.user = data.user;
            next();
        } catch (error) {
            res.status(401).send({errors: "please authenticate using valid token"});
        }
    }
};

// adding products in cartdata

app.post('/addtocart',fetchUser,async(req,res)=>{
    console.log("Added",req.body.itemId);

    let userData = await User.findOne({_id:req.user.id});
    userData.cartData[req.body.itemId]+= 1;
    await User.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData});
    res.send('Added');
})

//  remove product in cartdata

app.post('/removefromcart',fetchUser,async(req,res)=>{
    console.log("Removed",req.body.itemId);

    let userData = await User.findOne({_id:req.user.id});
    if(userData.cartData[req.body.itemId]>0)
    userData.cartData[req.body.itemId]-= 1;
    await User.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData});
    res.send('remove');
})

app.listen(port, (error)=>{
    if(!error){
        console.log("server is runngin " + port)
    } else {
        console.log("error" + error)
    }
})