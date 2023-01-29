const mongoos=require("mongoose")

const menuSchema= new mongoos.Schema({
    itemName:{
        type:String,
        required:true
    },
    itemDetails:{
        type:String,
        required:false
    },
    itemCatagory:{
        type:String,
        required:true
    },
    restroid:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    tax:{
        type:Number,
        required:true
    },
    availableQuantity:{
        type:Number,
        required:true
    },
    orderedQuantity:{
        type:Number,
        required:true
    },
    updateDate:{
        type:Date,
        required:true
    },
})

module.exports=mongoos.model('menu',menuSchema)