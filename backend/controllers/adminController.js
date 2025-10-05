import { Order } from '../models/index.js';

const adminController = {
  async getAllOrders(req, res, next) {
    try {
      const orders = await Order.find({}, null, { sort: { createdAt: -1 } })
        .populate('customerId', '-password')
        .exec();
      res.json(orders);
    } catch (err) {
      next(err);
    }
  },

  async updateStatus(req, res, next) {
    try {
      const { orderId, status } = req.body;
      await Order.updateOne({ _id: orderId }, { status });
      res.json({ message: 'Status updated successfully' });
    } catch (err) {
      next(err);
    }
  }
};

export default adminController;
