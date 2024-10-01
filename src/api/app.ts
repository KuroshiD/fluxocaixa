import express from 'express'
import bodyParser from 'body-parser';


import UserRoutes from './routes/UserRoutes';
import PublicRoutes from './routes/FrontRoutes'

const app = express()

app.use(bodyParser.json())
app.use("/", PublicRoutes)
app.use("/user", UserRoutes)

export default app;