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
        itemSubCatagory:req.body.itemSubCatagory,
        ldcommition:req.body.ldcommition,
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

//patch all item
router.patch('/:id',verifie_token, getmenuItem,async(req,res)=>{
    if(req.body.price!=null){
        res.item.price=req.body.price;
    }
    if(req.body.ldcommition!=null){
        res.item.ldcommition=req.body.ldcommition;
    }
    if(req.body.availableQuantity!=null){
        res.item.availableQuantity=req.body.availableQuantity;
    }
    if(req.body.updateDate!=null){
        res.item.updateDate=req.body.updateDate;
    }

    try{
        const updatedorder=res.item.save()
        res.status(201).json(updatedorder._id)
    }catch(error){
        res.status(500).json({message: error.message})
    }

})
router.delete("/:id",async (req,res)=>{
    console.log(req.params.id)
    item=await menueItem.findById(req.params.id)
        if(item==null){
            return res.status(404).json({message:"User unavailable!"})
        }
    

    try{
        const reasult= await menueItem.deleteOne({_id: new mongodb.ObjectId(req.params.id)})
        res.statusCode(201).json(reasult)
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
        item=await menueItem.findById(req.params.id)
        if(item==null){
            return res.status(404).json({message:"Item unavailable!"})
        }

    }catch(error){
        res.status(500).json({message: error.message})
    }
    res.item=item
    next()
}
module.exports=router
