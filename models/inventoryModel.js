const { bool } = require("joi")
const mongoos=require("mongoose")

const inventorySchema= new mongoos.Schema({
    ItemName:{
        type:String,
        required:true
    },
    restroid:{
        type:String,
        required:true
    },
    ItemID:{
        type:String,
        required:false
    },
    bottelQnt:{
        type:String,
        required:true
    },
    perbottle:{
        type:String,
        required:true
    },
    timestamp:{
        type:String,
        required:true
    },
    amount:{
        type:Number,
        required:true
    }

})

module.exports=mongoos.model('inventory',inventorySchema)