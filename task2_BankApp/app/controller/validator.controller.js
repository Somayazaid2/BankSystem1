const validator = require("validator")
class ValiadtorController{
    static isEmptyString = (val)=>{
        return val.length //0=false >0 =true
    }
    static isValidEmail = (val) => {
        return validator.isEmail(val)  //true false
    }
    static isValidPhone = (val) =>{
        return validator.isMobilePhone(val)
    }
    static isEmptyIcon = (val) => {
        return validator.isEmpty(val)
    }
}
module.exports = ValiadtorController