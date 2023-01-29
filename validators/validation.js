//validation
const joi =require("joi")

const resistration_validation=data=>{
const schema=joi.object().keys({ 
    email:joi.string().email().required(),
    mobile: joi.string().length(10).pattern(/[1-9]{1}[0-9]{9}/).required(),
    password:joi.string().min(6).required(), 
    Fullname:joi.string().min(3).required(),
    UserType:joi.string().required(),
    restroid:joi.string().required(),
    commision:joi.number().required(),
    UserStatus:joi.bool().required(),
});
return schema.validate(data);
}

const login_validation=data=>{
    const schema=joi.object().keys({ 
        email:joi.string().email().required(),
        password:joi.string().min(6).required(), 
    });
    return schema.validate(data);
    }

module.exports.resistration_validation=resistration_validation;
module.exports.login_validation=login_validation;