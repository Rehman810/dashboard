import Order from "../models/orderModel.js";
import Cart from "../models/cartModel.js";
import Product from "../models/productModel.js";

export const placeOrder = async (req, res) => {
  try {
    const userId = req.user.id;

    const userCart = await Cart.findOne({
      user: userId,
    }).populate("products.product");

    if (
      !userCart ||
      userCart.products.length === 0
    ) {
      return res
        .status(400)
        .json({ error: "Cart is empty" });
    }

    const totalAmount = userCart.products.reduce(
      (acc, item) =>
        acc + item.product.price * item.quantity,
      0
    );

    const order = new Order({
      user: userId,
      cart: userCart._id,
      totalAmount,
    });

    await order.save();

    for (const item of userCart.products) {
      const product = await Product.findById(
        item.product
      );
      if (product) {
        product.soldCount += item.quantity;
        await product.save();
      }
    }

    res.status(201).json({
      message: "Order placed successfully",
      order,
    });

    userCart.products = [];
    await userCart.save();
  } catch (error) {
    res
      .status(500)
      .json({ error: error.message });
  }
};

export const getOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    const orders = await Order.find({
      user: userId,
    })
      .populate("cart")
      .populate("cart.products.product");

    if (!orders || orders.length === 0) {
      return res
        .status(404)
        .json({ error: "No orders found" });
    }

    res.status(200).json(orders);
  } catch (error) {
    res
      .status(500)
      .json({ error: error.message });
  }
};
