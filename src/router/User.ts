import express from "express";
import { userController } from "../controller/UserController.ts";
import { validationMiddleware } from '../middleware/validation.ts'
import { registervalidate,loginvalidate } from "../schema/validateAuthUserSchema.ts";

const userRouter=express.Router()

userRouter.post('/register',validationMiddleware(registervalidate) ,userController.register);
userRouter.post('/login',validationMiddleware(loginvalidate) ,userController.login);

export default userRouter;