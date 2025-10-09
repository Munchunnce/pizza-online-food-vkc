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
      // ✅ populate customer details for real-time admin notification
      const populatedOrder = await savedOrder.populate("customerId");
      // 🔔 Emit to admin dashboard in realtime
      if (global.io) {
        global.io.to("orders_room").emit("newOrder", populatedOrder);
      }

      return res.status(201).json({
        message: "Order placed successfully",
        order: populatedOrder,
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

  async show(req, res) {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    // Authorize
    if (req.user._id.toString() !== order.customerId.toString()) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    return res.json(order); // JSON response for React
  } catch (err) {
    console.error("Fetch single order error:", err);
    return res.status(500).json({ message: "Something went wrong" });
  }
}

};

export default orderController;
