const express = require("express")
const router= express.Router()
const orders=require("../models/ordersModel")
const verifie_token= require("../validators/verifyToken")
const usermodel=require("../models/userModel")

router.post('/',verifie_token,async (req,res)=>{
    const userdata= await usermodel.findById(req.tokendata._id)
    if(!userdata)res.status(400).json({"message":"Access denied!"})
    console.log(userdata._id);
    const newOrders= new orders({
        servername:req.body.servername,
        Ordervalue:req.body.Ordervalue,
        employeeid:userdata._id,
        restroid:userdata.restroid,
        ordersItems:req.body.ordersItems,
        tableno:req.body.tableno,
        statu:false,
        timestamp:Date.now(),

        ordertype:req.body.ordertype,
    })
    try{
        const newItem=await newOrders.save()
        res.status(201).json(newItem._id)
    }
    catch(error){
        res.status(400).json({message:error.message})
    }
})

//get a bar
router.get('/:id', getmenuItem,(req,res)=>{
    res.send(res.order)
})



//get all bar
router.get('/',async (req,res)=>{
    try{
        const menuitems=await orders.find()
        res.json(menuitems)
    }catch(error){
        res.status(500).json({message: error.message})
    }
})

//get by bar 
router.get('/byrestro/:id',async (req,res)=>{
    try{
        const menuitems=await orders.find({"restroid":req.params.id})
        res.json(menuitems)
    }catch(error){
        res.status(500).json({message: error.message})
    }
})

//middleware
async function getmenuItem(req,res,next){
    let order
    try{
        order=await order.findById(req.params.id)
        if(order==null){
            return res.status(404).json({message:"Branch unavailable!"})
        }

    }catch(error){
        res.status(500).json({message: error.message})
    }
    res.order=order
    next()
}
module.exports=router
