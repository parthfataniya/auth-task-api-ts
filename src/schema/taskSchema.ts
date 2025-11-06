import mongoose from "mongoose";
import { mongooseConnect } from "../mongoose.ts";
import type { HydratedDocument } from "mongoose";
const { Schema, model } = mongoose

export interface ITask {
    title: string,
    description: string,
    scheduledate: Date
}

// export type ITaskDocument = HydratedDocument<ITask>;

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
    }
},
    { timestamps: true }
)


export const Task = model<ITask>('Task', taskSchema) 