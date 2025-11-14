import express from "express";
import { taskController } from "../controller/TaskController.ts";
import { auth } from '../middleware/auth.ts'
import { validationMiddleware } from '../middleware/validation.ts'
import { getparam, addTaskvalidate, updateTaskvalidate } from "../schema/validateAuthUserSchema.ts";

const router = express.Router()


router.post('/', auth, validationMiddleware(addTaskvalidate), taskController.addTask);

router.post('/subtask/:id', auth, validationMiddleware(addTaskvalidate), taskController.addsubTask) 



router.get('/getAll', auth, taskController.getAllTask)

router.get('/subtask', auth, taskController.getAllSUbTask) 

router.get('/subtask/:id', auth, validationMiddleware(getparam, 'params'), taskController.getsubtask) 

router.get('/', auth, taskController.getTaskByUser)



router.patch('/updatebyuser/:id', auth, validationMiddleware(updateTaskvalidate), taskController.updateTaskbyuser)

router.patch('/subtask/:id', auth, validationMiddleware(updateTaskvalidate), taskController.updatesubtask)

router.patch('/:type/:id',auth,taskController.update)


router.delete('/deletebyuser/:id', auth, validationMiddleware(getparam, 'params'), taskController.deleteTaskbyuser);

router.delete('/subtask/:id', auth, validationMiddleware(getparam, 'params'), taskController.deleteSubTask)

export default router;