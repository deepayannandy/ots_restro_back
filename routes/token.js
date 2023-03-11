const express = require("express")
const router= express.Router()
const token=require("../models/tokenModel")
//create branch
const verifie_token= require("../validators/verifyToken")

router.post('/',verifie_token,async (req,res)=>{
    if (req.tokendata.UserType!="Admin") return res.status(500).json({message:"Access Pohibited!"})

    const newToken= new token({
        servername:req.body.servername,
        tokenamount:req.body.tokenamount,
        employeeid:req.body.employeeid,
        restroid:req.body.restroid,
        timestamp:req.body.timestamp,
        ispaid:false,
    })
    try{
        const newtoken=await newToken.save()
        res.status(201).json(newtoken._id)
    }
    catch(error){
        res.status(400).json({message:error.message})
    }
})

//get a branch
router.get('/:id', getRestro,(req,res)=>{
    res.send(res.token)
})

//get a barfine
router.get('/query/:employeeid&:date',async (req,res)=>{
    console.log(req.params.employeeid)
    console.log(req.params.date)
    try{
        const fines=await token.find({"employeeid":req.params.employeeid,"timestamp":{ $regex: req.params.date }})
        res.status(201).json(fines)
    }catch(error){
        res.status(500).json({message: error.message})
    }

})


//get all branch
router.get('/',async (req,res)=>{
    try{
        const restros=await token.find()
        res.status(201).json(restros)
    }catch(error){
        res.status(500).json({message: error.message})
    }
})

//patch token
router.patch('/:id',getRestro,async (req,res)=>{
    if(req.body.ispaid!=null){
        res.token.ispaid=req.body.ispaid;
    }
    try{
        const updatedorder=await res.token.save()
        res.status(201).json(updatedorder)
    }catch(error){
        res.status(500).json({message: error.message})
    }

    
})

//get by bar not submitted
router.get('/bydate/:id&:date',async (req,res)=>{
    console.log(req.params.id)
    console.log(req.params.date)
    try{
        const tokenitems=await token.find({"restroid":req.params.id, isubmitted: true,"timestamp":{ $regex: req.params.date }})
        res.status(201).json(tokenitems)
    }catch(error){
        res.status(500).json({message: error.message})
    }
})

//middleware
async function getRestro(req,res,next){
    let Token
    try{
        Token=await token.findById(req.params.id)
        if(Token==null){
            return res.status(404).json({message:"Barfine unavailable!"})
        }

    }catch(error){
        res.status(500).json({message: error.message})
    }
    res.token=Token
    next()
}
module.exports=router
