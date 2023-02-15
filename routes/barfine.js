const express = require("express")
const router= express.Router()
const barfine=require("../models/barfineModel")
//create branch
const verifie_token= require("../validators/verifyToken")

router.post('/',verifie_token,async (req,res)=>{
    if (req.tokendata.UserType!="Admin") return res.status(500).json({message:"Access Pohibited!"})

    const newBarFine= new barfine({
        gname:req.body.gname,
        fineamount:req.body.fineamount,
        employeeid:req.body.employeeid,
        restroid:req.body.restroid,
        timestamp:req.body.timestamp,
        ispaid:req.body.ispaid
    })
    try{
        const newBF=await newBarFine.save()
        res.status(201).json(newBF._id)
    }
    catch(error){
        res.status(400).json({message:error.message})
    }
})

//get a branch
router.get('/:id', getRestro,(req,res)=>{
    res.send(res.Barfine)
})

//get a barfine
router.get('/query/:restroid&:date',async (req,res)=>{
    console.log(req.params.restroid)
    console.log(req.params.date)
    try{
        const fines=await barfine.find({"restroid":req.params.restroid,"timestamp":{ $regex: req.params.date }})
        res.status(201).json(fines)
    }catch(error){
        res.status(500).json({message: error.message})
    }

})


//get all branch
router.get('/',async (req,res)=>{
    try{
        const restros=await barfine.find()
        res.json(restros)
    }catch(error){
        res.status(500).json({message: error.message})
    }
})

//middleware
async function getRestro(req,res,next){
    let Barfine
    try{
        Barfine=await barfine.findById(req.params.id)
        if(Barfine==null){
            return res.status(404).json({message:"Barfine unavailable!"})
        }

    }catch(error){
        res.status(500).json({message: error.message})
    }
    res.Barfine=Barfine
    next()
}
module.exports=router
