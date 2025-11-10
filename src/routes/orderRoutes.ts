import { Router } from "express"
import {
  createOrder,
  getOrderHistory,
  getOrderById,
} from "../controllers/orderController.js"
import { authenticate } from "../middleware/auth.js"

const router = Router()

// All order routes require authentication
router.use(authenticate)

// POST /api/orders/create
router.post("/", createOrder)
// GET /api/orders/getHistory
router.get("/", getOrderHistory)
// GET /api/orders/:id
router.get("/:id", getOrderById)

export default router
