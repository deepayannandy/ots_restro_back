const { bool } = require("joi")
const mongoos=require("mongoose")

const ordersSchema= new mongoos.Schema({
    servername:{
        type:String,
        required:true
    },
    Ordervalue:{
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
    ordersItems:{
        type:Array,
        required:true
    },
    tableno:{
        type:String,
        required:true
    },
    timestamp:{
        type:Date,
        required:true
    },
    ordertype:{
        type:String,
        required:false
    },
    status:{
        type:Boolean,
        required:false
    },
    invoiceno:{
        type:String,
        required:false
    },

})

module.exports=mongoos.model('orders',ordersSchema)