import { Request, Response } from 'express';
import { OperationCreationAtrributes, getSummaryAttributes} from "../../types/cashflowRequestData"
import services from "../services/CashflowServices"

const CashFlowController = {
    // Adiciona uma nova operação ao fluxo de caixa
    addOperation: async (req: Request, res: Response) => {
        const body = req.body

        const data: OperationCreationAtrributes = {
            date: body.date,    
            description: body.description,
            opType: body.opType,
            value: body.value,
            productId: body.productId,
            ammount: body.ammount
        }

        const newOperation = await services.addOperation(data)

        res.status(newOperation.status).json({
            message: newOperation.message,
            data: newOperation.data
        })
    },

    // Retorna todas as operações do fluxo de caixa
    getAllOperations: async (req: Request, res: Response) => {
        const operations = await services.getAll();

        res.status(200).json(operations)
    },

    // Retorna uma operação específica pelo ID
    getOperationById: async (req: Request, res: Response) => {
        const id = req.params.id
        const operation = await services.getById(id);

        res.status(operation.status).json({
            message: operation.message,
            data: operation.data
        })
    },

    // Remove uma operação específica do fluxo de caixa
    deleteOperation: async (req: Request, res: Response) => {
        const id = req.params.id

        const deleteOp = await services.deleteOperation(id)

        res.status(deleteOp.status).json({
            message: deleteOp.message,
            data: deleteOp.data
        })
    },

    // Retorna o resumo financeiro do fluxo de caixa
    getFinancialSummary: async (req: Request, res: Response) => {
        const body = req.body

        const data: getSummaryAttributes = {
            initialDate: body.initialDate,
            endDate: body.endDate
        }

        const summary = await services.getSummary(data)

        res.status(summary.status).json({
            message: summary.message,
            data: summary.data
        })
    },
};

export default CashFlowController;
