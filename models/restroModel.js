const { tableize } = require("i/lib/methods")
const mongoos=require("mongoose")

//new bar  
const restroSchema= new mongoos.Schema({
    restroName:{
        type:String,
        required:true
    },
    restroDetails:{
        type:String,
        required:true
    },
    restroAddress:{
        type:String,
        required:true
    },
    legalName:{
        type:String,
        required:true
    },
    tax:{
        type:String,
        required:true
    },
    mobile:{
        type:String,
        required:true
    },
    active:{
        type:Boolean,
        required:true
    },
    validtill:{
        type:Date,
        required:true
    },
    contractDate:{
        type:Date,
        required:true
    },
    invoiceno:{
        type:Number,
        required:true
    },
    paymentRenewalDate:{
        type:Date,
        required:true
    },
    limit:{
        type:Number,
    },
    tablecount:{
        type:Number,
    }
})

module.exports=mongoos.model('Restro',restroSchema)