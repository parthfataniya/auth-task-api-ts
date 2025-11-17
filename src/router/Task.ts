import express from "express";
import { taskController } from "../controller/TaskController.ts";
import { auth } from '../middleware/auth.ts'
import { validationMiddleware } from '../middleware/validation.ts'
import { getparam, addTaskvalidate, updateTaskvalidate } from "../schema/validateAuthUserSchema.ts";

const router = express.Router()


router.post('/', auth, validationMiddleware(addTaskvalidate), taskController.addTask);

router.post('/subtask/:id', auth, validationMiddleware(addTaskvalidate), taskController.addsubTask) 



router.get('/getAll', auth, taskController.getAllTask)

router.get('/', auth, taskController.getTaskByUser)

router.get('/sub/:id',auth,validationMiddleware(getparam, 'params'),taskController.getsub)



router.patch('/updatebyuser/:id', auth, validationMiddleware(updateTaskvalidate), taskController.updateTaskbyuser)

router.patch('/sub/:id',auth,validationMiddleware(updateTaskvalidate),taskController.upsubtask)



router.delete('/deletebyuser/:id', auth, validationMiddleware(getparam, 'params'), taskController.deleteTaskbyuser);

router.delete('/sub/:id', auth, validationMiddleware(getparam, 'params'), taskController.deleteSubTask)

export default router;