import express from "express";
import { userController } from "../controller/UserController.ts";
import { taskController } from "../controller/TaskController.ts";
import { auth } from '../middleware/auth.ts'
import { validationMiddleware } from '../middleware/validation.ts'
import { registervalidate,loginvalidate,getparam,addTaskvalidate,updateTaskvalidate } from "../schema/validateAuthUserSchema.ts";

const router=express.Router()

router.post('/',auth,validationMiddleware(addTaskvalidate), taskController.add);
        
router.get('/getAll',auth,taskController.getAll)

router.get('/:id',auth,validationMiddleware(getparam,'params'),taskController.get)
        
router.patch('/:id',auth,validationMiddleware(updateTaskvalidate), taskController.update);

router.delete('/:id',auth,validationMiddleware(getparam,'params'), taskController.delete);

export default router;