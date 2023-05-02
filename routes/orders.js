const express = require("express")
const router= express.Router()
const orders=require("../models/ordersModel")
const verifie_token= require("../validators/verifyToken")
const usermodel=require("../models/userModel")
const restromodel=require("../models/restroModel")
const menumodel=require("../models/menuModel")

let qntitem=[ "Liquor",
"Beer",
"Drinks"]
router.post('/',verifie_token,async (req,res)=>{
    const userdata= await usermodel.findById(req.tokendata._id)
    if(!userdata)res.status(400).json({"message":"Access denied!"})
    const userrestro= await restromodel.findById(userdata.restroid)
    if(!userrestro)res.status(400).json({"message":"Restro not found!"})
    console.log(userdata._id);
    const invono=userrestro.restroName.substring(0, 3)+"-"+userrestro.invoiceno.toString();
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
        iscancelled:false
    })
    userrestro.invoiceno=userrestro.invoiceno+1

    try{
        const saveRestro=await userrestro.save()
        console.log(saveRestro.id)
        const newItem=await newOrders.save()
        if (req.body.isubmitted){
            let items=newItem.ordersItems
            items.forEach(async element => {
                if(qntitem.includes(element[4])){
                let oitem= await menumodel.findById(element[0])
                oitem.availableQuantity=oitem.availableQuantity-element[2]
                oitem.save()
                }
            });
        }
        res.status(201).json(newItem)
    }
    catch(error){
        res.status(400).json({message:error.message})
    }
})

//get a bar
router.get('/:id', getorderItem,(req,res)=>{
    res.send(res.order)
})

router.delete('/clearOrders/:restroid',async (req,res)=>{
    console.log(req.params.restroid)
    deletedorders = await orders.deleteMany({restroid:req.params.restroid})
    console.log(deletedorders)
    restro = await restromodel.findById(req.params.restroid)
    console.log(restro)
    restro.invoiceno=0
    const newrestro= await restro.save()
    console.log(newrestro)
    res.send("Deletion Success!")
})

router.delete('/clearOrder/:invoiceno',async (req,res)=>{
    try{
    console.log(req.params.invoiceno)
    let deletedorder = await orders.findOne({invoiceno:req.params.invoiceno})
    console.log(deletedorder)
    deletedorder.iscancelled=true
    let order= await deletedorder.save()
    console.log(order)
    res.status(201).send("Deletion Success!")}
    catch(error){
        res.status(500).json({message: error.message})
    }
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
router.patch('/:id',verifie_token, getorderItem,async(req,res)=>{

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
        const updatedorder=await res.order.save()
        if (req.body.isubmitted){
            let items=updatedorder.ordersItems
            items.forEach(async element => {
                if(qntitem.includes(element[4])){
                let oitem= await menumodel.findById(element[0])
                oitem.availableQuantity=oitem.availableQuantity-element[2]
                await oitem.save()
                }
            });
        }
        res.status(201).json(updatedorder)
    }catch(error){
        res.status(500).json({message: error.message})
    }

})

//middleware
async function getorderItem(req,res,next){
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
