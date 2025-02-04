import Cart from "../models/cartModel.js";
import Product from "../models/productModel.js";

export const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user.id;

    const product = await Product.findById(
      productId
    );
    if (!product)
      return res
        .status(404)
        .json({ error: "Product not found" });

    let cart = await Cart.findOne({
      user: userId,
    });

    if (!cart) {
      cart = new Cart({
        user: userId,
        products: [],
      });
    }

    // Check if the product already exists in the cart
    const productIndex = cart.products.findIndex(
      (item) =>
        item.product.toString() === productId
    );

    if (productIndex > -1) {
      cart.products[productIndex].quantity +=
        quantity;
    } else {
      cart.products.push({
        product: productId,
        quantity,
      });
    }

    await cart.save();
    res.status(200).json({
      message: "Product added to cart",
      cart,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: error.message });
  }
};

export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({
      user: req.user.id,
    }).populate("products.product");

    if (!cart)
      return res
        .status(404)
        .json({ error: "Cart is empty" });

    res.status(200).json(cart);
  } catch (error) {
    res
      .status(500)
      .json({ error: error.message });
  }
};

export const removeFromCart = async (
  req,
  res
) => {
  try {
    const { productId } = req.params;
    const userId = req.user.id;

    let cart = await Cart.findOne({
      user: userId,
    });

    if (!cart)
      return res
        .status(404)
        .json({ error: "Cart not found" });

    cart.products = cart.products.filter(
      (item) =>
        item.product.toString() !== productId
    );

    await cart.save();
    res.status(200).json({
      message: "Product removed from cart",
      cart,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: error.message });
  }
};
