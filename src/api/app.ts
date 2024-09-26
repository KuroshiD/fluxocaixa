import express from 'express'
import bodyParser from 'body-parser';


import UserRoutes from './routes/UserRoutes';

const app = express()

app.use(bodyParser.json())
app.use("/user", UserRoutes)

export default app;