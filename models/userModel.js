const mongoos=require("mongoose")

// users type SuperAdmin Admin Employee
const userSchema= new mongoos.Schema({
    Fullname:{
        type:String,
        required:true
    },
    nickname:
    {
        type:String,
        required:true
    },
    mobile:{
        type:String,
        required:true
    },
    UserType:{
        type:String,
        required:true
    },
    restroid:{
        type:String,
        required:true
    },
    restroname:{
        type:String,
        required:false
    },
    UserStatus:{
        type:Boolean,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    onBoardingDate:{
        type:String,
        required:false
    },
    Status:{
        type:String,
        required:false
    },
    StatusBg:{
        type:String,
        required:false
    },
    tips:{
        type:Number,
        required:false
    },
    imageURL:{
        type:String,
        required:false
    },
})

module.exports=mongoos.model('User',userSchema )