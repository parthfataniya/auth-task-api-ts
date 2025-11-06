import express from 'express';
import { userController } from './controller/UserController.ts';
import dotenv from 'dotenv'
// import { taskController } from './controller/TaskController.ts';
import router  from './router/Task.ts'
import userRouter from './router/user.ts';


dotenv.config()

const app = express()

const port = process.env.PORT || 3000;
app.use(express.json())

app.use('/users', userRouter);
app.use('/task', router);

app.listen(port, () => {
    console.log("listen")
})