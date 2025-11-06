
import type { Request,Response,NextFunction } from 'express';

import joi, { type Schema} from 'joi';
const { ValidationError } = joi;

type RequestProperty = 'body' | 'query' | 'params';

export const validationMiddleware = (schema:Schema, property:RequestProperty = 'body') => {
  return async (req:Request, res:Response, next:NextFunction) => {
    try {
      // Validate the specified property (req.body, req.query, etc.)
      const validatedValue = await schema.validateAsync(req[property]);
      console.log("validate value",validatedValue)
      // Overwrite the request property with the validated and sanitized value
      req[property] = validatedValue;

      
      console.log("req.property",req[property])
      next();
    } catch (error) {
      if (error instanceof ValidationError) {
        console.log("error-----",error)
        const message =error.details[0]?.context?.message || error.details[0]?.message;
        return res.status(400).json({ message });
        
      }
      
      next(error);
    }
  };
};



