import type { Request, Response, NextFunction } from 'express';
import joi, { type Schema } from 'joi';

const { ValidationError } = joi;

type RequestProperty = 'body' | 'query' | 'params';

export const validationMiddleware = (schema: Schema, property: RequestProperty = 'body') => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      
      const validatedValue = await schema.validateAsync(req[property]);
      req[property] = validatedValue;

      next();

    } catch (error) {
      if (error instanceof ValidationError) {

        const message = error.details[0]?.context?.message || error.details[0]?.message;
        return res.status(400).json({ message })
        
      }

      next(error);
    }
  };
};



