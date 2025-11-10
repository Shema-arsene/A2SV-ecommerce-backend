import type { Response } from "express"
import Product from "../models/Product.js"
import type { AuthRequest } from "../middleware/auth.js"

// Create a new product
export const createProduct = async (req: AuthRequest, res: Response) => {
  try {
    const { name, description, price, stock, category } = req.body

    if (!name || !description || !price || !stock || !category) {
      res.status(400).json({ message: "All product fields are required!" })
      return
    }

    if (typeof price !== "number" || typeof stock !== "number") {
      return res.status(400).json({
        success: false,
        message: "Price and stock must be numbers",
        errors: ["Invalid data type for price or stock"],
      })
    }

    const product = new Product({
      name: name.trim(),
      description: description.trim(),
      price,
      stock,
      category: category.trim(),
    })

    await product.save()

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      object: product,
      errors: null,
    })
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: "Product creation failed",
      errors: [error.message],
    })
  }
}

// Get all products with pagination and search
export const getProducts = async (req: AuthRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 10
    const search = (req.query.search ?? "").toString().trim()
    const skip = (page - 1) * limit

    let query: any = {}
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ]
    }

    const totalProducts = await Product.countDocuments(query)
    const products = await Product.find(query)
      .select("name description price stock category")
      .skip(skip)
      .limit(limit)

    res.json({
      success: true,
      message: "Products fetched successfully",
      object: products,
      pageNumber: page,
      pageSize: limit,
      totalSize: totalProducts,
      totalPages: Math.ceil(totalProducts / limit),
      errors: null,
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve products",
      errors: [error.message],
    })
  }
}

// Get a single product by ID
export const getProductById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params
    const product = await Product.findById(id).select(
      "name description price stock category"
    )

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
        errors: ["Product with the given ID was not found"],
      })
    }

    res.json({
      success: true,
      message: "Product fetched successfully",
      object: product,
      errors: null,
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch the product",
      errors: [error.message],
    })
  }
}

// Update a product by ID
export const updateProduct = async (req: AuthRequest, res: Response) => {
  try {
    const product = await Product.findById(req.params.id)

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
        errors: ["Product with the given ID was not found"],
      })
    }

    const updates = ["name", "description", "price", "stock", "category"]
    updates.forEach((update) => {
      if (req.body[update] !== undefined) {
        ;(product as any)[update] = req.body[update]
      }
    })

    await product.save()

    res.json({
      success: true,
      message: "Product updated successfully",
      object: product,
      errors: null,
    })
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: "Product update failed",
      errors: [error.message],
    })
  }
}

// Delete a product by ID
export const deleteProduct = async (req: AuthRequest, res: Response) => {
  try {
    const product = await Product.findById(req.params.id)

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
        errors: ["Product with the given ID was not found"],
      })
    }

    await Product.findByIdAndDelete(req.params.id)

    res.json({
      success: true,
      message: "Product deleted successfully",
      object: null,
      errors: null,
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to delete product",
      errors: [error.message],
    })
  }
}
