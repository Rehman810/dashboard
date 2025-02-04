import { getAllProductsService, createProductService, updateProductService, deleteProductService } from "../services/productService.js";

export const getAllProducts = async (req, res) => {
  try {
    const { page = 1, limit = 12, sort = "price", category, tags, search } = req.query;
    
    const { products, totalProducts } = await getAllProductsService({ page, limit, sort, category, tags, search });

    res.json({
      products,
      totalPages: Math.ceil(totalProducts / limit),
      currentPage: page,
      totalProducts,
    });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};

export const createProduct = async (req, res) => {
  try {
    const newProduct = await createProductService(req.body);
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};

export const updateProduct = async (req, res) => {
  const { id } = req.params;  // Get the MongoDB _id from route parameters
  try {
    const updatedProduct = await updateProductService(id, req.body);

    if (!updatedProduct) {
      return res.status(404).json({ msg: "Product not found" });
    }

    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;  // Get the MongoDB _id from route parameters
  try {
    const deletedProduct = await deleteProductService(id);

    if (!deletedProduct) {
      return res.status(404).json({ msg: "Product not found" });
    }

    res.json({ msg: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};
