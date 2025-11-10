import { Router } from "express"
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js"
import { authenticate, authorize } from "../middleware/auth.js"

const router = Router()

// Public routes: no authentication required
router.get("/", getProducts) // GET /api/products
router.get("/:id", getProductById) // GET /api/products/:id

// Protected admin routes:+ require authentication and admin role
router.post("/", authenticate, authorize("admin"), createProduct) // POST /api/products
router.put("/:id", authenticate, authorize("admin"), updateProduct) // PUT /api/products/:id
router.delete("/:id", authenticate, authorize("admin"), deleteProduct) // DELETE /api/products/:id

export default router
