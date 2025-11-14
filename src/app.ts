import express from 'express';
import dotenv from 'dotenv'
import router from './router/Task.ts'
import userRouter from './router/User.ts';

dotenv.config()

const app = express()

const port = process.env.PORT || 3000;
app.use(express.json())

app.use('/users', userRouter);
app.use('/task', router);

app.listen(port, () => {
    console.log("listen")
})

