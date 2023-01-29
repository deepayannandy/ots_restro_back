const mongoos=require("mongoose")

const ordersSchema= new mongoos.Schema({
    customerName:{
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
    taxamount:{
        type:Number,
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
})

module.exports=mongoos.model('orders',ordersSchema)