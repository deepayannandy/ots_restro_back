const express = require("express")
const router= express.Router()
const restro=require("../models/restroModel")
//create branch
const verifie_token= require("../validators/verifyToken")

router.post('/',verifie_token,async (req,res)=>{
    // if (req.tokendata.UserType!="SuperAdmin") return res.status(500).json({message:"Access Pohibited!"})
    var someDate = new Date(req.body.date);
    var aDate = new Date(req.body.date);
    let nedate=someDate.setDate(someDate.getDate() + (req.body.cduration*30));
    let paynedate=aDate.setDate(aDate.getDate() + 30);
    console.log(new Date(nedate))
    const newrestro= new restro({
        restroName:req.body.restroName,
        restroDetails:req.body.restroDetails,
        restroAddress:req.body.restroAddress,
        tax:req.body.tax,
        legalName:req.body.legalName,
        active:true,
        mobile:req.body.mobile,
        validtill:nedate,
        invoiceno:0,
        contractDate:req.body.date,
        paymentRenewalDate:paynedate,
        tablecount:req.body.tablecount
    })
    try{
        const newRestro=await newrestro.save()
        res.status(201).json(newRestro._id)
    }
    catch(error){
        res.status(400).json({message:error.message})
    }
})

//get a branch
router.get('/:id', getRestro,(req,res)=>{
    res.status(201).send([res.Restro])
})
//get a branch
router.get('/isactive/:id', getRestro,(req,res)=>{
    console.log("I am called")
    var days=res.Restro.limit
    console.log(days)
    res.status(201).send({days})
})


//get all branch
router.get('/',async (req,res)=>{
    let allrestros=[]
    try{
        const restros=await restro.find()
        restros.forEach(restro=>{
            console.log(diffdate(restro.paymentRenewalDate))
            restro.limit=diffdate(restro.paymentRenewalDate)
            console.log(typeof(restro))
            allrestros.push(restro)
        })
        res.json(allrestros)
    }catch(error){
        res.status(500).json({message: error.message})
    }
})
router.patch('/:id',verifie_token, getRestro,async(req,res)=>{
    console.log(req.tokendata.UserType);
    console.log(req.body.active)
    // if (!(req.tokendata.UserType=="Admin" || req.tokendata.UserType=="SuperAdmin")) return res.status(500).json({message:"Access Pohibited!"})
    console.log("i am patch")
    console.log(typeof(req.body.date))
    console.log(req.body.date.length)
    if(req.body.date!=null && req.body.date.length!=0){
        res.Restro.paymentRenewalDate=req.body.date;
    }
    if(req.body.tablecount!=null){
        res.Restro.tablecount=req.body.tablecount;
    }
    try{
        const newUser=await res.Restro.save()
        res.status(201).json({"_id":newUser.id})
    }catch(error){
        res.status(500).json({message: error.message})
    }
})
//middleware
async function getRestro(req,res,next){
    let Restro
    try{
        Restro=await restro.findById(req.params.id)
        if(Restro==null){
            return res.status(404).json({message:"Resturent unavailable!"})
        }

    }catch(error){
        res.status(500).json({message: error.message})
    }
    Restro.limit=diffdate(Restro.paymentRenewalDate)
    res.Restro=Restro
    next()
}

function diffdate( date){
    const date1=new Date();
    const date2=new Date(date);
    const diffTime = date2 - date1;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    return diffDays
}
module.exports=router
