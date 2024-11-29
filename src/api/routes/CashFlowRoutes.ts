import { Router } from 'express'
import CashFlow from '../controllers/CashflowController'
import auth from "../middleware/jwt"


const CashFlowRoutes = Router()

CashFlowRoutes.post('/add', auth, CashFlow.addOperation) // ok
CashFlowRoutes.get('/getAll', auth, CashFlow.getAllOperations) // ok
CashFlowRoutes.get('/get/:id', auth, CashFlow.getOperationById)

CashFlowRoutes.post('/summary', auth, CashFlow.getFinancialSummary)
CashFlowRoutes.delete('/delete/:id', auth, CashFlow.deleteOperation)
CashFlowRoutes.get("/profitMargin", auth, CashFlow.getProfitMargin)
CashFlowRoutes.post("/setProfitMargin", auth, CashFlow.setProfitMargin)
CashFlowRoutes.post('/getByDate', auth, CashFlow.getOperationsByDateRange)

export default CashFlowRoutes;