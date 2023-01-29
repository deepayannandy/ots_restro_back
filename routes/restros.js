const express = require("express")
const router= express.Router()
const restro=require("../models/restroModel")
//create branch
const verifie_token= require("../validators/verifyToken")

router.post('/',verifie_token,async (req,res)=>{
    if (req.tokendata.UserType!="SuperAdmin") return res.status(500).json({message:"Access Pohibited!"})
    const newrestro= new restro({
        restroName:req.body.restroName,
        restroDetails:req.body.restroDetails,
        restroAddress:req.body.restroAddress,
        tax:req.body.tax,
        legalName:req.body.legalName,
        active:true,
        mobile:req.body.mobile,
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
    res.send(res.Restro)
})



//get all branch
router.get('/',async (req,res)=>{
    try{
        const restros=await restro.find()
        res.json(restros)
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
    res.Restro=Restro
    next()
}
module.exports=router
