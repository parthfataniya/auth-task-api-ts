import { type ITask, SubTask, Task } from "../schema/taskSchema.ts";
import { type Request, type Response } from 'express'
import mongoose from "mongoose";
import { User } from "../schema/userSchema.ts";
import { start } from "repl";

class TaskController {

    addTask = async (req: Request, res: Response) => {

       
         try {
            const user = req.user
            const { title, description, scheduledate } = req.body

            const taskObject = { title, description, scheduledate, auther: user._id }
            const task = new Task(taskObject)
            const savetask = await task.save()
            const populateTask = await savetask.populate('auther', '_id name email')

            return res.status(200).send({ populateTask })

        } catch (error: any) {
            return res.status(500).send({ error: error.message })
        }
    }

    

    addsubTask = async (req: Request, res: Response) => {

        try {
            const { id } = req.params
            const user = req.user
            const { title, description, scheduledate } = req.body

            const subtaskObject = { title, description, scheduledate, parentTask: id }
            const task = await Task.findOne({ _id: id, auther: user._id })

            if (!task) {
                return res.status(404).send({ message: 'Task not found' })
            }

            const subtask = new SubTask(subtaskObject)

            if (!subtask) {
                return res.status(404).send({ message: 'SubTask not added' })
            }

            await subtask.save()
            task.subtasks?.push(subtask._id)
            await task.save()

            return res.status(200).send({ message: "subtask added success" })
        } catch (error:any) {
            res.status(500).send({error:error.message})
        }
        

    }

    getTaskByUser = async (req: Request, res: Response) => {
        try {
            const user = req.user

            if (!user) {
                return res.status(404).send('User not found')
            }
            else {
                const task = await Task.find({ auther: req.user })

                if (!task) {
                    return res.status(404).send('Task not found')
                }

                return res.status(200).send({ task })
            }
            
        } catch (error:any) {
            res.status(500).send({error:error.message})
        }
        
    }

    getsubtask = async (req: Request, res: Response) => {

        try {
            const user = req.user
            const { id } = req.params

            if (!user) {
                return res.status(404).send({ message: 'User not found' })
            }

            const subtask = await SubTask.findById({ _id: id }).populate('parentTask', 'title auther')

            if (!subtask || !subtask.parentTask) {
                return res.status(404).send({ message: 'SubTask not found!' })
            }

            const parentTask1 = subtask.parentTask as ITask

            if (String(parentTask1.auther) !== String(user._id)) {
                return res.status(404).send({ message: 'SubTask not found!' })
            }

            return res.status(200).send({ subtask })
        } catch (error: any) {
            return res.status(500).send({ error: error.message })
        }

    }


    updateTaskbyuser = async (req: Request, res: Response) => {

        try {
            const user = req.user
            if (!user) {
                return res.status(404).send({ message: "User not found" })
            }

            const { id } = req.params
            const updates = req.body
            const task = await Task.findOne({ _id: id, auther: user._id })

            if (!task) {
                return res.status(404).send({ message: "Task not found" })
            }

            const updatetask = Object.assign(task ?? {}, updates)

            if (!updatetask) {
                return res.status(404).send({ message: "Task not update" })
            }
            await updatetask.save()

            return res.status(200).send({ message: "Task update success", Task: updatetask })

        } catch (error: any) {
            return res.status(500).send({ error: error.message })
        }
    }

    updatesubtask = async (req: Request, res: Response) => {

        try {
            const user = req.user
            const { id } = req.params

            if (!user) {
                return res.status(404).send('User not found!')
            }

            const subtask = await SubTask.findById({ _id: id }).populate('parentTask', 'auther')

            const parentTask = subtask?.parentTask as ITask

            if (String(parentTask.auther) !== String(user._id)) {
                return res.status(404).send({ message: 'Subtask not found' })
            }

            const updates = req.body
            const update = Object.assign(subtask ?? {}, updates)

            if (!update) {
                return res.status(404).send({ message: 'SubTask not updated' })
            }
            await update.save()

            return res.status(200).send({ message: 'update success', data: update })

        } catch (error: any) {
            return res.status(500).send({ error: error.message })
        }
    }

    update=async (req:Request,res:Response)=>{

        try {
            
            const user=req.user
            const { type,id }=req.params

            let update=null

            if (type=='task')
            {
                update=await Task.findOne({_id:id,auther:user._id})
            }

            else if(type=='subtask')
            {
                const subtask=await SubTask.findById(id).populate('parentTask','auther')

                if(!subtask)
                {
                    return res.status(404).send({message:'Subtask not found!'})
                }

                const parentTask=subtask.parentTask as ITask

                if(String(parentTask.auther) !== String(user._id))
                {
                    return res.status(404).send({message:'Subtask not found!'})
                }

                update=subtask
            }

            if(!update){
                return res.status(404).send({message:'Update not perform!'})
            }

            const data=Object.assign(update ?? {},req.body)
            await update?.save() 

            return res.status(200).send({message:'update success',data:data})

        } catch (error:any) {
            res.status(500).send({error:error.message})
        }
    }



    deleteTaskbyuser = async (req: Request, res: Response) => {

        try {
             const user = req.user
            const { id } = req.params;

        

            const task = await Task.findOneAndDelete({ auther: user._id, _id: id })

            if (!task) {
                return res.status(404).send({ message: "Task not found" })
            }

            await SubTask.deleteMany({ parentTask: id })

            return res.status(200).send({ message: 'task delete success', data: task })
        } catch (error:any) {
            res.status(500).send({message:error.message})
        }
       

    }

    deleteSubTask = async (req: Request, res: Response) => {

        try {
            const user = req.user
            const { id } = req.params

            if (!user) {
                return res.status(404).send({ message: 'User not found' })
            }

            const subtask = await SubTask.findById({ _id: id }).populate('parentTask', 'auther')

            if (!subtask) {
                return res.status(404).send({ message: 'Subtask not found!' });
            }

            if (!subtask.parentTask) {
                return res.status(404).send({ message: 'parent not found!' });
            }

            const parentTask = subtask?.parentTask as ITask

            if (String(parentTask.auther) !== String(user._id)) {
                return res.status(404).send({ message: 'Subtask auther not found!' })
            }

            const deletesubtask = await SubTask.findOneAndDelete({ _id: id })

            await Task.findByIdAndUpdate(parentTask._id, { $pull: { subtasks: new mongoose.Types.ObjectId(subtask._id) } }, { new: true });

            return res.status(200).send({ message: 'Subtask delete success', data: deletesubtask })

        } catch (error: any) {
            return res.status(500).send({ error: error.message })
        }
    }

    getAllTask = async (req: Request, res: Response) => {

        try {
            const page: number = parseInt(req.query.page as string) || 1;
            const limit: number = parseInt(req.query.limit as string) || 10;
            const skip = (page - 1) * limit;
            const task = await Task.find().skip(skip).limit(limit)

            const totalTask = await Task.find()
            const total = totalTask.length
            const totalPages = Math.ceil(total / limit)

            if (!task) {
                return res.status(404).send({ message: "Task not available" })
            }

            if (page > totalPages) {
                return res.status(404).send({ message: `Data available across only ${totalPages} pages.` })
            }

            return res.status(200).send({ page, limit, total: total, totalPages, data: task })

        }
        catch (error: any) {
            return res.status(500).send({ error: error.message })
        }

    }

    getAllSUbTask = async (req: Request, res: Response) => {

        try {
            const page: number = parseInt(req.query.page as string) || 1;
            const limit: number = parseInt(req.query.limit as string) || 10;
            const skip = (page - 1) * limit;
            const task = await SubTask.find().skip(skip).limit(limit)

            const totalTask = await SubTask.find()
            const total = totalTask.length
            const totalPages = Math.ceil(total / limit)

            if (!task) {
                return res.status(404).send({ message: "Task not available" })
            }

            if (page > totalPages) {
                return res.status(404).send({ message: `Data available across only ${totalPages} pages.` })
            }

            return res.status(200).send({ page, limit, total: total, totalPages, data: task })
        }
        catch (error: any) {
            return res.status(500).send({ error: error.message })
        }
    }

}

export const taskController = new TaskController()

