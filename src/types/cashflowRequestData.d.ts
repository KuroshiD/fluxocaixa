export interface OperationCreationAtrributes {
    opType: 'venda' | 'compra' | 'taxa' | 'aluguel'
    description: string
    value: number
    date: Date
    productId?: string,
    ammount?: number
}

export interface getSummaryAttributes {
    initialDate: Date,
    endDate: Date
}



