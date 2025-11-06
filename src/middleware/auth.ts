import jwt, {type JwtPayload} from 'jsonwebtoken'
import { User } from '../schema/userSchema.ts'
import donenv from 'dotenv'
import type { Request,Response,NextFunction } from 'express'

donenv.config()
const SECRET_KEY=process.env.SECRET_KEY as string

interface authrequest extends Request{
    user?:any
    token?:string
}

export async function auth(req:authrequest,res:Response,next:NextFunction){
    const header=req.headers['authorization']
    const token = header && header.split(" ")[1];

    if (!token)
    {
        return res.status(401).send({message:"token not provided"})
    }

    try {
        
        const decode=jwt.verify(token,SECRET_KEY ) as JwtPayload & {id:string}
        console.log(decode)
        const user=await User.findOne({_id:decode.id,"tokens.token":token})

        if (!user){
            return res.status(401).send({message:"Usre not found"})
        }

        req.user=user
        req.token=token

        next()
    } catch (error) {
        return res.status(403).send({message:"Invalid or expire token"})
    }

}