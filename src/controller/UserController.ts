import { User } from "../schema/userSchema.ts";
import express, { Router, type Request, type Response } from 'express'
import { registervalidate,loginvalidate } from "../schema/validateAuthUserSchema.ts";
import { validationMiddleware } from "../middleware/validation.ts";

class UserController {

    register = async (req: Request, res: Response) => {

        const { name, email, password, mobile, address } = req.body

        const userObject = { name, email, password, mobile, address }
        const user = new User(userObject)
        try {
            await user.save()
            return res.status(200).send({ user })
        } catch (error) {
            return res.status(500).send(error)
        }
    }

    login = async (req: Request, res: Response) => {

        const { email, password } = req.body

        try {
            const user = await User.findByCredential(req.body.email, req.body.password);
            const token=await user.generateAuthToken()
            return res.status(200).send({ user, token});
        } catch (error: any) {
            return res.status(500).send({ error: error.message });
        }
    }

}

export const userController = new UserController();

