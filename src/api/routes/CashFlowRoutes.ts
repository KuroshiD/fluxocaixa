import { Router } from 'express'
import CashFlow from '../controllers/CashflowController'

const CashFlowRoutes = Router()

CashFlowRoutes.post('/add', CashFlow.addOperation) // ok
CashFlowRoutes.get('/getAll', CashFlow.getAllOperations) // ok
CashFlowRoutes.get('/get/:id', CashFlow.getOperationById)
CashFlowRoutes.post('/summary', CashFlow.getFinancialSummary)
CashFlowRoutes.delete('/delete/:id', CashFlow.deleteOperation)


export default CashFlowRoutes;