import { Request, Response } from 'express'
import { ProductCreationAttributes } from "../../types/productsRequestData" 
import ProductServices from '../services/ProductServices'

const ProductController = {
    create: async (req: Request, res: Response) => {
        const body = req.body
        const data: ProductCreationAttributes = {
            name: body.name,
            price: body.price,
            description: body.description,
            stock: body.stock
        }
        
        const result = await ProductServices.create(data)
        return res.status(result.status).json(result)
    },

    getAll: async (req: Request, res: Response) => {
        const result = await ProductServices.getAll()
        return res.status(200).json({
            message: "Products retrieved successfully",
            data: result,
            status: 200
        })
    },

    getById: async (req: Request, res: Response) => {
        const id = req.params.id
        const result = await ProductServices.getById(id)
        return res.status(result.status).json(result)
    },

    update: async (req: Request, res: Response) => {
        const id = req.params.id
        const data: Partial<ProductCreationAttributes> = {
            name: req.body.name,
            price: req.body.price,
            description: req.body.description,
            stock: req.body.stock
        }
        
        const result = await ProductServices.update(id, data)
        return res.status(result.status).json(result)
    },

    delete: async (req: Request, res: Response) => {
        const id = req.params.id
        const result = await ProductServices.delete(id)
        return res.status(result.status).json(result)
    },
}

export default ProductController