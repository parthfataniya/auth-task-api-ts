import validator from 'validator';
import bcrypt from 'bcryptjs';
import dotenv from "dotenv";
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose';
import type { Document,HydratedDocument, Model } from 'mongoose';
import { mongooseConnect } from '../mongoose.ts';

const { Schema, model } = mongoose

dotenv.config()
const SECRET_KEY = process.env.SECRET_KEY!


// mongoose.connect('mongodb://127.0.0.1:27017/kill')
export interface IUser extends Document {
    name: string,
    email: string,
    password?: string,
    mobile: string,
    address: string,
    tokens: { token: string }[]
}

export interface IUserMethods {
    generateAuthToken(): Promise<string>
}

interface IUserStatic extends Model<IUser, {}, IUserMethods> {
    findByCredential(email: string, password: string): Promise<HydratedDocument<IUser & IUserMethods>>
}

const userSchema = new Schema<IUser, IUserStatic, IUserMethods>({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
        validate(value: string) {
            if (!validator.isEmail(value)) {
                throw new Error("Enter valid Email!")
            }
        }
    },
    mobile: {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 10,
        match: [/^\d{10}$/, 'Mobile number must contain only digits.'],
    },
    password: {
        type: String,
        required: true,
        minlength: 7
    },
    address: {
        type: String,
        required: true
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
}, { timestamps: true }

)


userSchema.pre('save', async function (next) {
    const user = this
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password as string, 8)
    }

    next()

})


userSchema.statics.findByCredential = async (email: string, password: string) => {
    const user = await User.findOne({ email });

    if (!user) {
        throw new Error("user not found")
    }

    const isMatch = await bcrypt.compare(password, user.password as string);

    if (!isMatch) {
        throw new Error("Password not valid") 
    }

    return user;
};


userSchema.methods.generateAuthToken = async function () {

    try {
        const user = this

        const token = jwt.sign({ id: user._id, username: user.name }, SECRET_KEY!, { expiresIn: '1h' })
        console.log(token)
        if (!user.tokens) {
            user.tokens = []
        }
        user.tokens.push({ token })

        await user.save()
        return token;
    } catch (error) {
        throw new Error("Error in generating tokens")
    }

}


export const User = model<IUser, IUserStatic>('User', userSchema)
User.createIndexes()



