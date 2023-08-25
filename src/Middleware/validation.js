import joi from 'joi'
import { Types } from 'mongoose'


const validationObjectId =(value,helper)=>{

    if(Types.ObjectId.isValid(value)){
        return true 
    }else {

        return helper.message("invalid id")

    }
}

export const generalFeilds = {

    email:joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
    password:joi.string().min(3).required(),
    file:joi.object({
        fieldname:joi.string().required(),
        originalname:joi.string().required(),
        encoding:joi.string().required(),
        mimetype:joi.string().required(),
        destination:joi.string().required(),
        filename:joi.string().required(),
        path:joi.string().required(),
        size:joi.number().positive().required(),
        dest:joi.string(),
    }),
    id:joi.string().custom(validationObjectId).required(),
}

const validation = (schema)=>{
    return (req,res,next)=>{

        const inputmethods = {...req.body,...req.query,...req.params};
        if(req.file){
            inputmethods.file=req.file;
        }
        const validationresult = schema.validate(inputmethods,{abortEarly:false});
        if(validationresult.error?.details){
            return res.json({message:"valiation error",validationError:validationresult.error?.details});
        }return next();
}
}

export default validation;