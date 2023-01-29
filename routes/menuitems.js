const express = require("express")
const router= express.Router()
const menueItem=require("../models/menuModel")
const verifie_token= require("../validators/verifyToken")

router.post('/',verifie_token,async (req,res)=>{
    console.log(req.tokendata.UserType);
    if (req.tokendata.UserType!="Admin" && req.tokendata.UserType!="SuperAdmin") return res.status(500).json({message:"Access Pohibited!"})
    const newMenueitem= new menueItem({
        itemName:req.body.itemName,
        itemDetails:req.body.itemDetails,
        itemCatagory:req.body.itemCatagory,
        restroid:req.body.restroid,
        price:req.body.price,
        tax:req.body.tax,
        availableQuantity:req.body.availableQuantity,
        orderedQuantity:0,
        updateDate:new Date()
    })
    try{
        const newItem=await newMenueitem.save()
        res.status(201).json(newItem._id)
    }
    catch(error){
        res.status(400).json({message:error.message})
    }
})

//get a bar
router.get('/:id', getmenuItem,(req,res)=>{
    res.send(res.item)
})



//get all bar
router.get('/',async (req,res)=>{
    try{
        const menuitems=await menueItem.find()
        res.json(menuitems)
    }catch(error){
        res.status(500).json({message: error.message})
    }
})

//get by bar 
router.get('/byrestro/:id',async (req,res)=>{
    try{
        const menuitems=await menueItem.find({"restroid":req.params.id})
        res.json(menuitems)
    }catch(error){
        res.status(500).json({message: error.message})
    }
})

//middleware
async function getmenuItem(req,res,next){
    let item
    try{
        item=await item.findById(req.params.id)
        if(item==null){
            return res.status(404).json({message:"Branch unavailable!"})
        }

    }catch(error){
        res.status(500).json({message: error.message})
    }
    res.item=item
    next()
}
module.exports=router
