// controllers/customer/orderController.js
import { Order} from "../models/index.js";

const orderController = {
  async store(req, res) {
    try {
      const { items, totalItems, totalPrice, phone, address, paymentType } = req.body;

      // validation
      if (!items || !totalItems || !totalPrice || !phone || !address) {
        return res.status(400).json({ message: "All fields are required" });
      }

      // customerId backend se (req.user se)
      const customerId = req.user._id;

      const order = new Order({
        customerId,
        items,
        totalItems,
        totalPrice,
        phone,
        address,
        paymentType,
        paymentStatus: paymentType === "cod" ? false : true,
      });

      const savedOrder = await order.save();

      return res.status(201).json({
        message: "Order placed successfully",
        order: savedOrder,
      });
    } catch (error) {
      console.error("Order Save Error:", error);
      return res.status(500).json({ message: "Something went wrong" });
    }
  },

  // user ke orders fetch karna
  async index(req, res) {
    try {
      const orders = await Order.find({ customerId: req.user._id }).sort({ createdAt: -1 });
      return res.json(orders);
    } catch (err) {
      return res.status(500).json({ message: "Error fetching orders" });
    }
  },

  // Admin: sab orders fetch karne ke liye
  async allOrders(req, res) {
    try {
      const orders = await Order.find().sort({ createdAt: -1 });
      return res.json(orders);
    } catch (err) {
      return res.status(500).json({ message: "Error fetching all orders" });
    }
  },
};

export default orderController;
