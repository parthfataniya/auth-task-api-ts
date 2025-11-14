import { User } from "../schema/userSchema.ts";
import { type Request, type Response } from 'express'


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

        try {
            const user = await User.findByCredential(req.body.email, req.body.password);
            const token = await user.generateAuthToken()
            return res.status(200).send({ user, token });
        } catch (error: any) {
            return res.status(500).send({ error: error.message });
        }
    }

    logout = async (req: Request, res: Response) => {
        try {
            req.user.tokens = req.user.tokens.filter(
                (t: { token: string }) => t.token !== req.token
            );
            await req.user.save()
            return res.status(200).send({ message: 'User logout success' })
        } catch (error: any) {
            return res.status(500).send({ error: error.message, message: 'failed to logout' })
        }
    }

    logoutAll = async (req: Request, res: Response) => {
        try {
            req.user.tokens = []
            await req.user.save()
            return res.status(200).send({ message: 'logout from all device' })
        } catch (error: any) {
            return res.status(500).send({ error: error.message, message: 'failed to logout' })
        }
    }
    
}

export const userController = new UserController();

