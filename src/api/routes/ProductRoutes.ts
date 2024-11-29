import { Router } from "express";
import ProductController from "../controllers/ProductController";
import auth from "../middleware/jwt"


const ProductRoutes = Router()

ProductRoutes.post("/create", auth,  ProductController.create)
ProductRoutes.get("/getAll", auth, ProductController.getAll)
ProductRoutes.get("/get/:id", auth, ProductController.getById)
ProductRoutes.put("/update/:id", auth, ProductController.update)
ProductRoutes.delete("/delete/:id", auth, ProductController.delete)

export default ProductRoutes