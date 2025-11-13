import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addOrder, fetchAdminOrders, updateOrderStatus } from "../store/admin/adminOrdersSlice";
import moment from "moment";
import { io } from "socket.io-client";
import Toast from "../components/Toast/Toast"; // ✅ import Toast



const AdminOrders = () => {
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector((state) => state.adminOrders);
  const [toast, setToast] = useState(null); // ✅ toast state

  const socket = useRef(null);

  useEffect(() => {
    // Socket connection
    socket.current = io("http://localhost:5000");

    // Admin join orders room
    socket.current.emit("join_orders_room");

  // listen for new orders
  socket.current.on("newOrder", (order) => {
    dispatch(addOrder(order));
    // ✅ Show toast notification
      setToast(`🛒 New order received from ${order.customerId?.name || "Unknown"}`);
    // dispatch({
    //   type: "adminOrders/addOrder",
    //   payload: order,
    // });
  });
  // Fetch initial admin orders
    dispatch(fetchAdminOrders());

  // cleanup
  return () => {
    socket.current.off("newOrder"); // event listener remove
      socket.current.disconnect();    // socket disconnect
  };
  }, [dispatch]);

  const handleStatusChange = (id, status) => {
    dispatch(updateOrderStatus({ id, status }));
  };

  if (loading) return <p>Loading orders...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <section className="p-6 mt-10 bg-gray-50 min-h-screen">
      <div className="container mx-auto">
        <h2 className="text-2xl font-bold mb-6">Admin Orders</h2>

        {orders.length === 0 ? (
          <p>No orders found</p>
        ) : (
          <div className="overflow-x-auto bg-white rounded shadow">
            <table className="w-full table-auto border-collapse border border-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left border">Customer</th>
                  <th className="px-4 py-3 text-left border">Items</th>
                  <th className="px-4 py-3 text-left border">Total</th>
                  <th className="px-4 py-3 text-left border">Status</th>
                  <th className="px-4 py-3 text-left border">Payment</th>
                  <th className="px-4 py-3 text-left border">Created At</th>
                  <th className="px-4 py-3 text-left border">Update</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50 border-b">
                    <td className="px-4 py-3 border">{order.customerId?.name ?? "Unknown"}</td>
                    
                    <td className="px-4 py-3 border">
                        <p>{order._id}</p>
                      {order.items && Object.values(order.items).map((mi) => (
                        <div key={mi.product?._id}>
                          {mi.product?.name ?? "Unknown"} — {mi.quantity} pcs
                        </div>
                      ))}
                    </td>

                    <td className="px-4 py-3 border">₹{order.totalPrice}</td>
                    <td className="px-4 py-3 border">{order.status || "pending"}</td>
                    <td className="px-4 py-3 border">{order.paymentStatus ? "Paid" : "Not Paid"}</td>
                    <td className="px-4 py-3 border">{moment(order.createdAt).format("DD MMM YYYY, hh:mm A")}</td>
                    
                    <td className="px-4 py-3 border">
                      <select
                        value={order.status || "pending"}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        className="px-3 py-2 border rounded"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="prepared">Prepared</option>
                        <option value="delivered">Delivered</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* ✅ Toast notification */}
      {toast && (
        <Toast
          message={toast}
          type="success"
          onClose={() => setToast(null)}
        />
      )}
    </section>
  );
};

export default AdminOrders;
