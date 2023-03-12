const express = require("express")
const router= express.Router()
const inventory=require("../models/inventoryModel")
//create branch
const verifie_token= require("../validators/verifyToken")
const menumodel=require("../models/menuModel")

router.post('/',verifie_token,async (req,res)=>{
    

    const newInventory= new inventory({
        ItemName:req.body.ItemName,
        restroid:req.body.restroid,
        ItemID:req.body.ItemID,
        bottelQnt:req.body.bottelQnt,
        perbottle:req.body.perbottle,
        timestamp:req.body.timestamp,
        amount:req.body.amount
    })
    try{
        const newinventory=await newInventory.save()
        let oitem= await menumodel.findById(req.body.ItemID)
        oitem.availableQuantity=oitem.availableQuantity+(req.body.bottelQnt*req.body.perbottle)
        oitem.save()
        res.status(201).json(newinventory._id)
    }
    catch(error){
        res.status(400).json({message:error.message})
    }
})

//get a branch
router.get('/:id',async (req,res)=>{
    try{
        const fines=await inventory.find({"restroid":req.params.id})
        res.status(201).json(fines)
    }catch(error){
        res.status(500).json({message: error.message})
    }
})

//get a barfine
router.get('/query/:restroid&:date',async (req,res)=>{
    console.log(req.params.employeeid)
    console.log(req.params.date)
    try{
        const fines=await inventory.find({"restroid":req.params.restroid,"timestamp":{ $regex: req.params.date }})
        res.status(201).json(fines)
    }catch(error){
        res.status(500).json({message: error.message})
    }

})


// //get all branch
// router.get('/',async (req,res)=>{
//     try{
//         const restros=await inventory.find()
//         res.status(201).json(restros)
//     }catch(error){
//         res.status(500).json({message: error.message})
//     }
// })

// //patch token
// router.patch('/:id',getRestro,async (req,res)=>{
//     if(req.body.ispaid!=null){
//         res.token.ispaid=req.body.ispaid;
//     }
//     try{
//         const updatedorder=await res.token.save()
//         res.status(201).json(updatedorder)
//     }catch(error){
//         res.status(500).json({message: error.message})
//     }

    
// })

//get by bar not submitted
router.get('/bydate/:id&:date',async (req,res)=>{
    console.log(req.params.id)
    console.log(req.params.date)
    try{
        const tokenitems=await inventory.find({"restroid":req.params.id, isubmitted: true,"timestamp":{ $regex: req.params.date }})
        res.status(201).json(tokenitems)
    }catch(error){
        res.status(500).json({message: error.message})
    }
})

//middleware
async function getRestro(req,res,next){
    let Inventory
    try{
        Inventory=await inventory.findById(req.params.id)
        if(Inventory==null){
            return res.status(404).json({message:"Barfine unavailable!"})
        }

    }catch(error){
        res.status(500).json({message: error.message})
    }
    res.token=Inventory
    next()
}
module.exports=router
