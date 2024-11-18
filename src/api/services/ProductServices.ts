import { mandatoryFieldsValidation } from "../validations/generalValidation"
import ServiceReturn from "../../types/serviceReturn"
import { ProductCreationAttributes } from "../../types/productsRequestData"
import { Product } from "../models/Products"

const ProductServices = {
    create: async(data: ProductCreationAttributes): Promise<ServiceReturn> => {
        const requiredFields = ["name", "price"]
        const missingFields = mandatoryFieldsValidation(data, requiredFields)

        if (!missingFields.isValid) 
            return {
                data: missingFields.missingFields,
                message: "missing required fields",
                status: 422
            }

        if(data.price < 0) 
            return {
                data: null,
                message: "Price must be greater than zero",
                status: 422
            }
        
        const newProduct = {
            name: data.name,
            price: data.price,
            ...(data.description && { description: data.description}),
            ...(data.stock && { stock: data.stock})
        }
        const product = await Product.create(newProduct as any)

        if(!product)
            return {
                message: "Error creating product",
                status: 500,
                data: null
            }

        return {
            message: "Product created",
            status: 201,
            data: product
        }        
    },

    getAll: async (): Promise<Product[]> => await Product.findAll(),

    getById: async (id: string): Promise<ServiceReturn> => {
        const product = await Product.findByPk(id)

        if(!product)
            return {
                message: "Product not found",
                status: 404,
                data: null
            }

        return {
            message: "Product found",
            status: 200,
            data: product
        }
    },

    update: async (id: string, data: Partial<ProductCreationAttributes>): Promise<ServiceReturn> => {
        const product = await Product.findByPk(id)

        if(!product)
            return {
                message: "Product not found",
                status: 404,
                data: null
            }

        if(data.price !== undefined && data.price < 0) 
            return {
                data: null,
                message: "Price must be greater than zero",
                status: 422
            }

        const updatedProduct = await product.update(data)

        if(!updatedProduct)
            return {
                message: "Error updating product",
                status: 500,
                data: null
            }

        return {
            message: "Product updated successfully",
            status: 200,
            data: updatedProduct
        }
    },

    delete: async (id: string): Promise<ServiceReturn> => {
        const product = await Product.findByPk(id)

        if(!product)
            return {
                message: "Product not found",
                status: 404,
                data: null
            }

        await product.destroy()

        return {
            message: "Product deleted successfully",
            status: 200,
            data: null
        }
    }
}

export default ProductServices