import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders } from "../store/ordersSlice";
import moment from "moment";
import { Link } from "react-router-dom";

const Orders = () => {
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  return (
    <section className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4">
        <h1 className="font-bold text-lg mb-4">All Orders</h1>

        {loading && <p className="text-blue-600 font-medium">Loading orders...</p>}
        {error && <p className="text-red-500 font-medium">{error}</p>}

        <div className="overflow-x-auto mt-4">
          <table className="w-full table-auto bg-white rounded shadow">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left">Order ID</th>
                <th className="px-4 py-2 text-left">Phone</th>
                <th className="px-4 py-2 text-left">Address</th>
                <th className="px-4 py-2 text-left">Time</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
                orders.map((order) => (
                  <tr key={order._id} className="border-b hover:bg-gray-50">
                    <td className="border px-4 py-2 text-blue-600">
                      <Link to={`/customer/orders/${order._id}`}>{order._id}</Link>
                    </td>
                    <td className="border px-4 py-2">{order.phone}</td>
                    <td className="border px-4 py-2">{order.address}</td>
                    <td className="border px-4 py-2">
                      {moment(order.createdAt).format("hh:mm A")}
                    </td>
                  </tr>
                ))
              ) : (
                !loading && (
                  <tr>
                    <td colSpan="4" className="p-4 text-center text-gray-500">
                      No orders found!
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default Orders;
