import { type ITask, Task } from "../schema/taskSchema.ts";
import { response, type Request, type Response } from 'express'
import mongoose from "mongoose";

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

            const subtaskObject = { title, description, scheduledate }
            const task = await Task.findOne({ _id: id, auther: user._id })

            if (!task) {
                return res.status(404).send({ message: 'Task not found' })
            }

            const subtask = task.subtasks?.push(subtaskObject)
            await task.save()

            return res.status(200).send({ message: "subtask added success", data: subtask })
        } catch (error: any) {
            res.status(500).send({ error: error.message })
        }


    }

    getTaskByUser = async (req: Request, res: Response) => {
        try {
            const user = req.user
            const task = await Task.find({ auther: req.user })

            if (!task) {
                return res.status(404).send('Task not found')
            }

            return res.status(200).send({ task })

        }
        catch (error: any) {
            return res.status(500).send({ error: error.message })
        }

    }

    getsub = async (req: Request, res: Response) => {

        try {
            const user = req.user
            const { id } = req.params

            const subtask = await Task.findOne({ 'subtasks._id': id, auther: user._id }, { 'subtasks.$': 1 })

            if (!subtask) {
                return res.status(200).send({ message: 'subtask not found' })
            }

            return res.status(200).send({ data: subtask })
        } catch (error: any) {
            return res.status(500).send({ error: error.message })
        }

    }

    updateTaskbyuser = async (req: Request, res: Response) => {

        try {
            const user = req.user
            const { id } = req.params
            const updates = req.body
            const task = await Task.findOne({ _id: id, auther: user._id })

            if (!task) {
                return res.status(404).send({ message: "Task not found" })
            }

            if (task?.subtasks?.[0]?.status != 'completed') {
                if (updates.status == 'completed') {
                    return res.status(404).send({ message: 'You can not update status completed until all subtask completed!' })
                }
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

            const task = await Task.findOne({ 'subtasks._id': id, auther: user._id })

            if (!task) {
                return res.status(200).send({ message: 'subtask not found' })
            }

            const subtask = (task.subtasks as any).id(id)
            if (!subtask) {
                res.status(404).send("not update")
            }

            const update = Object.assign(task.subtasks?.[0] ?? {}, req.body)

            if (!update) {
                return res.status(404).send({ message: 'update not perform' })
            }
            await task.save()


            return res.status(200).send({ message: 'update success', data: update })

        } catch (error: any) {
            return res.status(500).send({ error: error.message })
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

            return res.status(200).send({ message: 'task delete success', data: task })
        } catch (error: any) {
            res.status(500).send({ message: error.message })
        }

    }

    deleteSubTask = async (req: Request, res: Response) => {

        try {

            const user = req.user
            const { id } = req.params

            const subtask = await Task.findOne({ auther: user._id, 'subtasks._id': id }, { 'subtasks.$': 1 })

            if (!subtask) {
                return res.status(404).send({ message: "subtask not found" })
            }

            const deletetask = await Task.findByIdAndUpdate(subtask._id, { $pull: { subtasks: { _id: id } } })

            if (!deletetask) {
                return res.status(404).send({ message: "delete not perform!" })
            }

            return res.status(200).send({ message: "delete perform", data: subtask })

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



}

export const taskController = new TaskController()

