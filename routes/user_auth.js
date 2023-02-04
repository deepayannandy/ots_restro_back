const express = require("express")
const router= express.Router()
const usermodel=require("../models/userModel")
const validator= require("../validators/validation")
const bcrypt = require("bcryptjs")
const jwt= require("jsonwebtoken")
const nodemailer = require('nodemailer');
const mongodb=require("mongodb");
require("dotenv").config()

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'appsdny@gmail.com',
    pass: process.env.MAILER_PASS,
  },
  port:465,
  host:"smtp.gmail.com"
});

const verifie_token= require("../validators/verifyToken")

//login user
router.post('/login',async (req,res)=>{
    //validate the data
    const valid=validator.login_validation(req.body);
    if(valid.error){
        return res.status(400).send({"message":valid.error.details[0].message});
    };
    const user=await usermodel.findOne({mobile:req.body.mobile});
    if(!user) return res.status(400).send({"message":"User dose not exist!"});

    // validate password
    const validPass=await bcrypt.compare(req.body.password,user.password);
    if(!validPass) return res.status(400).send({"message":"Emailid or password is invalid!"});
    if (!user.UserStatus) return res.status(400).send({"message":"User is not an active user!"});

    //create and assign token
    const token= jwt.sign({_id:user._id,UserType:user.UserType},process.env.SECREAT_TOKEN);
    res.header('auth-token',token).send(token);
})
//create user
router.post('/register',async (req,res)=>{
    let ts = Date.now();

    let date_ob = new Date(ts);
    let date = date_ob.getDate();
    let month = date_ob.getMonth() + 1;
    let year = date_ob.getFullYear();
    //validate the data
    const valid=validator.resistration_validation(req.body);
    if(valid.error){
        return res.status(400).send(valid.error.details[0].message);
    }
    const mobile_exist=await usermodel.findOne({mobile:req.body.mobile});
    if(mobile_exist) return res.status(400).send({"message":"Mobile number already exist!"});

    //hash the password
    const salt= await bcrypt.genSalt(10);
    const hashedpassword= await bcrypt.hash(req.body.password,salt);
    
    const datenow=year + "-" + ("0" + month).slice(-2) + "-" + ("0" + date).slice(-2);
    console.log(datenow);
    const user= new usermodel({
        Fullname:req.body.Fullname,
        mobile:req.body.mobile,
        restroid:req.body.restroid,
        UserType:req.body.UserType,
        UserStatus:true, 
        password:hashedpassword,
        Status:"Active",
        StatusBg:"#8BE78B",
        onBoardingDate:datenow,
        tips:0,
    })
    try{
        const newUser=await user.save()
        res.status(201).json({"_id":newUser.id})
        
    }
    catch(error){
        res.status(400).json({message:error.message})
    }
})


//get a user
router.get('/:id' ,getUser, (req,res,)=>{

    res.send(res.user)
})
// get my data
router.get("/mydata/me",verifie_token,async (req,res)=>{
    console.log(req.tokendata._id)
    const user=await usermodel.findOne({_id:req.tokendata._id});
    if(!user) return res.status(400).send({"message":"User dose not exist!"});
    res.send(user)

})

//get all user
router.get('/',verifie_token,async (req,res)=>{
    const user=await usermodel.findOne({_id:req.tokendata._id});
    if(!user) return res.status(400).send({"message":"User dose not exist!"});
    if(!user.restroid) return res.status(400).send({"message":"No Employee branch found"});
    console.log(req.tokendata.UserType)
    try{
        if(req.tokendata.UserType=="SuperAdmin"){
            const users=await usermodel.find();
            res.json(users)
        }
        else{
            const users=await usermodel.find({restroid:user.restroid});
            res.json(users)
        }
    }catch(error){
        res.status(500).json({message: error.message})
    }
})

//update user
router.patch('/:id',verifie_token, getUser,async(req,res)=>{
    console.log(req.tokendata.UserType);
    if (!(req.tokendata.UserType=="Admin" || req.tokendata.UserType=="SuperAdmin")) return res.status(500).json({message:"Access Pohibited!"})
    if(req.body.email!=null){
        res.user.email=req.body.email;
    }
    if(req.body.tips!=null){
        res.user.tips=req.body.tips;
    }
    if(req.body.commision!=null){
        res.user.commision=req.body.commision;
    }
    if(req.body.mobile!=null){
        res.user.mobile=req.body.mobile;
    }
    if(req.body.UserStatus!=null){
        res.user.UserStatus=req.body.UserStatus;
        if (req.body.UserStatus==false){
            res.user.Status="Pending";
            res.user.StatusBg="#FEC90F";
        }
        else{
            res.user.Status="Active";
            res.user.StatusBg="#8BE78B";
        }
    }
    if(req.body.UserType!=null){
        res.user.UserType=req.body.UserType;
    }
    try{
        const newUser=await res.user.save()
        res.status(201).json({"_id":newUser.id})
    }catch(error){
        res.status(500).json({message: error.message})
    }
})


router.delete("/:id",async (req,res)=>{
    console.log(req.params.id)
    user=await usermodel.findById(req.params.id)
        if(user==null){
            return res.status(404).json({message:"User unavailable!"})
        }
    

    try{
        const reasult= await usermodel.deleteOne({_id: new mongodb.ObjectId(req.params.id)})
        res.json(reasult)
    }catch(error){
        res.status(500).json({message: error.message})
    }
})

//middleware
async function getUser(req,res,next){
    let user
    try{
        user=await usermodel.findById(req.params.id)
        if(user==null){
            return res.status(404).json({message:"User unavailable!"})
        }

    }catch(error){
        res.status(500).json({message: error.message})
    }
    res.user=user
    next()
}
module.exports=router