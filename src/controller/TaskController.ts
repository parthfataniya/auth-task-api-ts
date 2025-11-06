import { Task } from "../schema/taskSchema.ts";
import {  type Request, type Response } from 'express'


class TaskController {

    add = async (req: Request, res: Response) => {

        const { title, description, scheduledate } = req.body

        try {
            const taskObject = { title, description, scheduledate }
            const task = new Task(taskObject)
            await task.save()
            return res.status(200).send({ task })
        } catch (error: any) {
            return res.status(500).send({ error: error.message })
        }
    }

    get = async (req: Request, res: Response) => {

        const id = req.params.id
        
        try {
            const task = await Task.findById(id)
            if (!task) {
                res.status(404).send({ message: "User not found" })
            }
            return res.status(200).send(task)
        } catch (error: any) {
            return res.status(500).send({ error: error.message })
        }
    }

    update = async (req: Request, res: Response) => {


        const { title, description, scheduledate } = req.body

        try {
            const id = req.params.id
            const updates = req.body
            const task = await Task.findById(id)
            if (!task) {
                res.status(404).send({ message: "Task not found" })
            }

            const update = Object.assign(task ?? {}, updates)

            if (!update) {
                res.status(404).send({ message: "task not found" })
            }
            await update.save()

            return res.status(200).send({ message: "Update success", data: update })

        } catch (error: any) {
            res.status(500).send({ error: error.message })
        }

    }

    delete = async (req: Request, res: Response) => {

        const { id } = req.params

        try {
            const task = await Task.findOneAndDelete({ _id: id })
            if (!task) {
                res.status(404).send({ message: "User not found" })
            }
            return res.status(200).send({ task })


        } catch (error: any) {
            return res.status(500).send({ error: error.message })
        }

    }

    getAll = async (req: Request, res: Response) => {

        try {
            const page: number = parseInt(req.query.page as string) || 1;
            const limit: number = parseInt(req.query.limit as string) || 10;
            const skip = (page - 1) * limit;
            const task = await Task.find().skip(skip).limit(limit)

            const totalTask = await Task.find()
            const total = totalTask.length
            const totalPages = Math.ceil(total / limit)

            if (!task) {
                res.status(404).send({ message: "Task not available" })
            }

            if (page > totalPages) {
                res.status(404).send({ message: `Data available across only ${totalPages} pages.` })
            }
            return res.status(200).send({ page, limit, total: total, totalPages, data: task })
        } catch (error: any) {
            return res.status(500).send({ error: error.message })
        }

    }
}

export const taskController = new TaskController()

