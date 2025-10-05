// backend/controllers/admin/adminOrderController.js
import { Order } from '../../models/index.js';

const adminOrderController = {
  async index(req, res) {
    try {
      // return orders except completed, newest first
      const orders = await Order.find({ status: { $ne: 'completed' } })
        .populate('customerId', '-password')
        .sort({ createdAt: -1 })
        .exec();

      return res.json(orders);
    } catch (err) {
      console.error("Admin Orders Fetch Error:", err);
      return res.status(500).json({ message: "Error fetching all orders" });
    }
  },

  async updateStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!status) return res.status(400).json({ message: "Status is required" });

      const order = await Order.findById(id);
      if (!order) return res.status(404).json({ message: "Order not found" });

      order.status = status;
      await order.save();

      // return populated order (so frontend gets customer.name etc)
      const populated = await Order.findById(id).populate('customerId', '-password');
      return res.json({ message: "Status updated", order: populated });
    } catch (err) {
      console.error("Admin Update Status Error:", err);
      return res.status(500).json({ message: "Error updating status" });
    }
  }
};

export default adminOrderController;
