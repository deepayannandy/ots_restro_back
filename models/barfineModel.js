const { bool } = require("joi")
const mongoos=require("mongoose")

const ordersSchema= new mongoos.Schema({
    gname:{
        type:String,
        required:true
    },
    fineamount:{
        type:Number,
        required:false
    },
    employeeid:{
        type:String,
        required:true
    },
    restroid:{
        type:String,
        required:true
    },
    timestamp:{
        type:String,
        required:true
    },
    ispaid:{
        type:Boolean,
        required:true
    }

})

module.exports=mongoos.model('barfine',ordersSchema)