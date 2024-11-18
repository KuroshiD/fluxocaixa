import { Router } from "express";
import ProductController from "../controllers/ProductController";

const ProductRoutes = Router()

ProductRoutes.post("/create", ProductController.create)
ProductRoutes.get("/getAll", ProductController.getAll)
ProductRoutes.get("/get/:id", ProductController.getById)
ProductRoutes.put("/update/:id", ProductController.update)
ProductRoutes.delete("/delete/:id", ProductController.delete)

export default ProductRoutes