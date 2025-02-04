import Product from "../models/productModel.js";

export const getAllProductsService = async ({ page, limit, sort, category, tags, search }) => {
  const pageLimit = parseInt(limit, 10);
  const pageNum = parseInt(page, 10);

  let filter = {};
  if (category) filter.category = category;
  if (tags) filter.tags = { $in: tags.split(",") };
  if (search) filter.name = { $regex: search, $options: "i" }; 

  let sortBy = {};
  if (sort === "price") {
    sortBy.price = 1; 
  } else if (sort === "price_desc") {
    sortBy.price = -1;
  }

  const products = await Product.find(filter)
    .sort(sortBy)
    .skip((pageNum - 1) * pageLimit)
    .limit(pageLimit);

  const totalProducts = await Product.countDocuments(filter);

  return { products, totalProducts };
};

export const createProductService = async (productData) => {
  const { name, slug, description, price, category, tags, color, size, images, totalStock } = productData;

  const newProduct = new Product({
    name,
    slug,
    description,
    price,
    category,
    tags: tags || [],
    color,
    size,
    images: images || [],
    totalStock,
  });

  await newProduct.save();
  return newProduct;
};

export const updateProductService = async (id, updatedData) => {
    return await Product.findByIdAndUpdate(
      id,
      { $set: updatedData },
      { new: true } // Return the updated document
    );
  };

  export const deleteProductService = async (id) => {
    return await Product.findByIdAndDelete(id);
  };