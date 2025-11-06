import joi,{type ExternalHelpers} from 'joi'
import { User } from './userSchema.ts'



const existUser=async (value:string,helpers:ExternalHelpers)=>{
    const user=await User.findOne({email:value})

    if (user) {
         return helpers.error('any.custom', { message: 'this email is alreeady exists' }) as never;
  }

    return value;

}



export const registervalidate=joi.object({
    name:joi.string().min(3).required().messages({
        'string.empty':'Enter the name!',
        'any.required':'Name is required!'
    }),
    email:joi.string().email().required().external(existUser).messages({
        'string.empty':'Enter the email!',
        'any.required':'Email is required',
        'string.email':'Enter valid email'
        
        
    }),
    
    mobile:joi.string().pattern(/^\d{10}$/).required().messages({
        'string.empty':'Enter the number!',
        'any.required':'Number is required!',
        'string.pattern.base':'Enter valid number'
    }),
    password:joi.string().min(8).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/).required().messages({
        'string.empty':'Enter the password!',
        'any.required':'Password is required!',
        'string.min':'Password length must be 8',
        'string.pattern.base':'Password must contain atleaset one uppercase,one lowercase,one digit,one special character'
    }),
    address:joi.string().required().messages({
        'any.required':'Address is required',
        'string.empty':"Enter the address"
    }),
    
})


export const loginvalidate=joi.object({
    email:joi.string().email().required().messages({
        'string.empty':'Enter the email!',
        'any.required':'Email is required',
    }),
    password:joi.string().required().messages({
        'string.empty':'Enter the number!',
        'any.required':'Number is required!',
    })
})

export const addTaskvalidate=joi.object({
    title:joi.string().required().messages({
        'string.empty':'Enter the title!',
        'any.required':'title is required',
    }),
    description:joi.string().required().messages({
        'string.empty':'Enter the description!',
        'any.required':'description is required',
    }),
    scheduledate:joi.date().greater('now').required().messages({
      'any.required': 'date is required',
      'date.greater': 'date must be in the future and valid format like "yyyy-mm-dd"',
    })
})

export const updateTaskvalidate=joi.object({
    title:joi.string().messages({
        'string.empty':'Enter the title !',
        'any.required':'title is required',
    }),
    description:joi.string().messages({
        'string.empty':'Enter the description!',
        'any.required':'description is required',
    }), 
    scheduledate:joi.date().greater('now').messages({
      'date.greater': 'date must be in the future and valid format like "yyyy-mm-dd"',
    })
})

export const getparam=joi.object({
    id:joi.string().length(24).required().messages({
        'string.empty':'Enter the id!',
        'any.required':'id is required',
        'string.length':"id length must be 24"
    })
})

