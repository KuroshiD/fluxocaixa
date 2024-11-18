import express from 'express'
import bodyParser from 'body-parser';


import UserRoutes from './routes/UserRoutes';
import CashFlowRoutes from './routes/CashFlowRoutes'
import PublicRoutes from './routes/FrontRoutes'
import ProductRoutes from './routes/ProductRoutes';

const app = express()

app.use(bodyParser.json())
app.use("/", PublicRoutes)
app.use("/user", UserRoutes)
app.use("/cashflow", CashFlowRoutes)
app.use("/products", ProductRoutes)

export default app;