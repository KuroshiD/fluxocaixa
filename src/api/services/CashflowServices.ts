import { mandatoryFieldsValidation } from "../validations/generalValidation"
import { validateOperationType } from "../validations/generalValidation"
import { CashFlow } from "../models/CashFlow"
import ServiceReturn from "../../types/serviceReturn"
import { OperationCreationAtrributes, getSummaryAttributes } from "../../types/cashflowRequestData"
import { updateBalanceSummary, getSummariesInRange } from "../utils/cashflow"
import { Product } from "../models/Products"
import { Constants } from "../models/constants"
import { Op } from "sequelize"

const CashFlowServices = {
    addOperation: async (data: OperationCreationAtrributes): Promise<ServiceReturn> => {
        try {
            const requiredFields = ["date", "description", "opType", "value"];
            const missingFields = mandatoryFieldsValidation(data, requiredFields);
            if (!missingFields.isValid) {
                return {
                    data: missingFields.missingFields,
                    message: "missing required fields",
                    status: 422,
                };
            }

            if (!validateOperationType(data.opType)) {
                return {
                    data: null,
                    message: "invalid operation type",
                    status: 422,
                };
            }

            if (data.value <= 0) {
                return {
                    data: null,
                    message: "value must be greater than 0",
                    status: 422,
                };
            }

            // Verificar se o tipo é "venda" ou "compra" e se foi informado um produtoId, exceto se for "procedimento"
            const isProductRequired = ["venda", "compra"].includes(data.opType) && data.productId !== "procedimento";
            if (isProductRequired && !data.productId) {
                return {
                    data: null,
                    message: "product id is required for sale or purchase operations",
                    status: 422,
                };
            }

            let product: Product | null = null;
            if (data.opType === "venda") {
                if (data.productId !== "procedimento") {
                    // Verificar o estoque do produto para venda
                    product = await Product.findByPk(data.productId);
                    if (!product) {
                        return {
                            data: null,
                            message: "product not found",
                            status: 404,
                        };
                    }

                    // Verificar a quantidade (ammount) se for informada
                    const ammount = data.ammount || 1;
                    if (product.stock < ammount) {
                        return {
                            data: null,
                            message: "insufficient stock for sale operation",
                            status: 422,
                        };
                    }

                    // Reduzir o estoque do produto
                    await product.update({ stock: product.stock - ammount });
                    // Atualizar o valor da operação com base no preço do produto
                    data.value = product.price * ammount;
                }
            }

            if (data.opType === "compra") {
                // Verificar se o produto existe para compra
                product = await Product.findByPk(data.productId);
                if (!product) {
                    return {
                        data: null,
                        message: "product not found",
                        status: 404,
                    };
                }

                // Verificar a quantidade (ammount) se for informada
                const ammount = data.ammount || 1;
                // Aumentar o estoque do produto
                await product.update({ stock: product.stock + ammount });
                // Atualizar o valor da operação com base no preço do produto
                data.value = product.price * ammount;
            }

            // Criar a operação de cashflow
            const operation = await CashFlow.create({
                type: data.opType,
                description: data.description,
                amount: data.value,
                date: data.date,
                productId: data.productId,
                ammount: data.ammount,
            } as any);

            await updateBalanceSummary(data.opType, data.value);

            return {
                data: operation,
                message: "operation created successfully",
                status: 201,
            };
        } catch (error) {
            console.error('Error in addOperation:', error);
            return {
                data: null,
                message: "internal server error",
                status: 500,
            };
        }
    },
    getAll: async (): Promise<CashFlow[]> =>
        await CashFlow.findAll({
            include: {
                model: Product,
                required: false
            }
        }),

    getById: async (id: string): Promise<ServiceReturn> => {
        const op = await CashFlow.findByPk(id);

        if (!op)
            return {
                message: "Operation not found",
                status: 404,
                data: null
            }

        return {
            message: 'Operação obtida',
            status: 200,
            data: op
        }
    },

    deleteOperation: async (id: string): Promise<ServiceReturn> => {
        const op = await CashFlow.findByPk(id)
        if (!op)
            return {
                message: "Operation not found",
                status: 404
            }

        await op.destroy()

        return {
            message: "deletado com sucesso",
            status: 200,
            data: op
        }
    },

    getSummary: async (data: getSummaryAttributes): Promise<ServiceReturn> => {
        const requiredFields = ["initialDate", "endDate"]
        const missingFields = mandatoryFieldsValidation(data, requiredFields)

        if (!missingFields.isValid) {
            const today = new Date()
            data.initialDate = today;
            data.endDate = today;
        }

        if(missingFields.isValid) {
            data.initialDate = new Date(data.initialDate)
            data.endDate = new Date(data.endDate)
        }

        const summary = await getSummariesInRange(data.initialDate, data.endDate)

        return {
            message: "Summary",
            status: 200,
            data: summary
        }
    },

    getProfitMargin: async (): Promise<ServiceReturn> => {
        try {
            const constants = await Constants.findOne();
            if (!constants) {
                return {
                    data: null,
                    message: "Constants not found",
                    status: 404,
                };
            }
            return {
                data: constants.profitMargin,
                message: "Profit margin retrieved successfully",
                status: 200,
            };
        } catch (error) {
            console.error('Error in getProfitMargin:', error);
            return {
                data: null,
                message: "internal server error",
                status: 500,
            };
        }
    },

    setProfitMargin: async (profitMargin: number): Promise<ServiceReturn> => {
        try {
            let constants = await Constants.findOne();
            if (!constants) {
                constants = await Constants.create({ profitMargin } as any);
            } else {
                await constants.update({ profitMargin });
            }
            return {
                data: constants.profitMargin,
                message: "Profit margin updated successfully",
                status: 200,
            };
        } catch (error) {
            console.error('Error in setProfitMargin:', error);
            return {
                data: null,
                message: "internal server error",
                status: 500,
            };
        }
    },

    getOperationsByDateRange: async (initialDate: Date, endDate: Date): Promise<ServiceReturn> => {
        try {
            const operations = await CashFlow.findAll({
                where: {
                    date: {
                        [Op.between]: [initialDate, endDate]
                    }
                },
                include: {
                    model: Product,
                    required: false
                }
            });
            return {
                data: operations,
                message: "Operations retrieved successfully",
                status: 200,
            };
        } catch (error) {
            console.error('Error in getOperationsByDateRange:', error);
            return {
                data: null,
                message: "internal server error",
                status: 500,
            };
        }
    }
}

export default CashFlowServices
