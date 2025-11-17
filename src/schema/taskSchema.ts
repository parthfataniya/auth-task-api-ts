import mongoose from "mongoose";
import { type IUser } from "./userSchema.ts";
import { mongooseConnect } from "../mongoose.ts";

const { Schema, model } = mongoose

export interface ISubTask {
    
    title: string,
    description: string,
    scheduledate: Date,
    status?: string,
    
}

export interface ITask {
    _id: mongoose.Types.ObjectId;
    title: string,
    description: string,
    scheduledate: Date,
    status?: string,
    auther: mongoose.Types.ObjectId | IUser,
    subtasks?:ISubTask[] | null,
}

const subtaskschema=new Schema({
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        scheduledate: {
            type: Date,
            required: true,
            validate(value: Date) {
                const today = new Date()
                today.setHours(0, 0, 0, 0)
                if (value < today) {
                    throw new Error("date is invalid can not able to enter past date")
                }
            }
        },
        status: {
            type: String,
            enum: ['pending', 'in-process', 'completed'],
            default: 'pending'
        }
}, { _id: true }
)


const taskSchema = new Schema<ITask>({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    scheduledate: {
        type: Date,
        required: true,
        validate(value: Date) {
            const today = new Date()
            today.setHours(0, 0, 0, 0)
            if (value < today) {
                throw new Error("date is invalid can not able to enter past date")
            }
        }
    },
    status: {
        type: String,
        enum: ['pending', 'in-process', 'completed'],
        default: 'pending'
    },
    auther: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    subtasks:{
        type:[subtaskschema],
        default:[]
    },
},
    { timestamps: true }
)


export const Task = model<ITask>('Task', taskSchema) 