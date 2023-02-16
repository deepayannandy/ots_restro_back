const express = require("express")
const router= express.Router()
const orders=require("../models/ordersModel")
const verifie_token= require("../validators/verifyToken")
const usermodel=require("../models/userModel")
const restromodel=require("../models/restroModel")

router.post('/',verifie_token,async (req,res)=>{
    const userdata= await usermodel.findById(req.tokendata._id)
    if(!userdata)res.status(400).json({"message":"Access denied!"})
    const userrestro= await restromodel.findById(userdata.restroid)
    if(!userrestro)res.status(400).json({"message":"Restro not found!"})
    console.log(userdata._id);
    const invono=userrestro.restroName.substring(0, 4)+"-"+userrestro.invoiceno.toString();
    const newOrders= new orders({
        servername:req.body.servername,
        Ordervalue:req.body.Ordervalue,
        employeeid:userdata._id,
        restroid:userdata.restroid,
        ordersItems:req.body.ordersItems,
        tableno:req.body.tableno,
        statu:false,
        timestamp:req.body.timestamp,
        invoiceno: invono,
        ordertype:req.body.ordertype,
        isubmitted:req.body.isubmitted,
    })
    userrestro.invoiceno=userrestro.invoiceno+1

    try{
        const saveRestro=await userrestro.save()
        console.log(saveRestro.id)
        const newItem=await newOrders.save()
        res.status(201).json(newItem)
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
    console.log(req.params.id);
    try{
        const menuitems=await orders.find({"restroid":req.params.id})
        res.status(201).json(menuitems)
    }catch(error){
        res.status(500).json({message: error.message})
    }
})

//get by bar not submitted
router.get('/byrestronotsubmitted/:id',async (req,res)=>{
    console.log(req.params.id)
    try{
        const menuitems=await orders.find({"restroid":req.params.id,isubmitted:false})
        res.status(201).json(menuitems)
    }catch(error){
        res.status(500).json({message: error.message})
    }
})
//get by bar not submitted
router.get('/bydate/:id&:date',async (req,res)=>{
    console.log(req.params.id)
    console.log(req.params.date)
    try{
        const menuitems=await orders.find({"restroid":req.params.id, isubmitted: true,"timestamp":{ $regex: req.params.date }})
        res.status(201).json(menuitems)
    }catch(error){
        res.status(500).json({message: error.message})
    }
})

// patch order
router.patch('/:id',verifie_token, getmenuItem,async(req,res)=>{
    console.log(req.body.Ordervalue)
    if(req.body.isubmitted!=null){
        res.order.isubmitted=req.body.isubmitted;
    }
    if(req.body.Ordervalue!=null){
        res.order.Ordervalue=req.body.Ordervalue;
    }
    if(req.body.ordersItems!=null){
        res.order.ordersItems=req.body.ordersItems;
    }
    try{
        const updatedorder=res.order.save()
        res.status(201).json(updatedorder._id)
    }catch(error){
        res.status(500).json({message: error.message})
    }

})

//middleware
async function getmenuItem(req,res,next){
    let order
    try{
        order=await orders.findById(req.params.id)
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
