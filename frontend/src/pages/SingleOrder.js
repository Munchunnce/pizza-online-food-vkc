import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

// Line Awesome icons
const statusSteps = [
  { key: "order_placed", label: "Order Placed", iconClass: "las la-receipt" },
  {
    key: "confirmed",
    label: "Order Confirmation",
    iconClass: "las la-check-circle",
  },
  { key: "prepared", label: "Preparation", iconClass: "las la-concierge-bell" },
  { key: "delivered", label: "Out for Delivery", iconClass: "las la-truck" },
  { key: "completed", label: "Complete", iconClass: "las la-flag-checkered" },
];

const SingleOrder = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const res = await fetch(`/api/customer/orders/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch order");
        const data = await res.json();
        setOrder(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!order) return <p>Order not found</p>;

  const currentStepIndex = statusSteps.findIndex(
    (step) => step.key === order.status
  );

  return (
    <section className="container mx-auto status bg-gray-50 min-h-screen p-6 mt-3">
      <div className="container mx-auto">
        <div className="status-box w-full lg:w-2/3 mx-auto relative">
          <div className="flex items-center justify-between mb-12">
            <h1 className="text-xl font-bold">Track Delivery Status</h1>
            <h6 className="bg-white py-1 rounded-full px-4 text-green-600 text-xs">
              {order._id}
            </h6>
          </div>

          <ul className="relative ml-20">
            {statusSteps.map((step, idx) => {
              const isCompleted = idx < currentStepIndex;
              const isCurrent = idx === currentStepIndex;
              const isUpcoming = idx > currentStepIndex;

              const activeColor = "#FE5F1E";
              const completedColor = "#B0B0B0";

              return (
                <li key={step.key} className="relative pb-16">
                  {/* Line */}
                  {idx !== statusSteps.length - 1 && (
                    <span
                      className="absolute left-2.5 top-7 bottom-0 w-[2px] transition-all duration-500 ease-in-out"
                      style={{
                        backgroundColor: isCompleted
                          ? completedColor
                          : isCurrent
                          ? activeColor
                          : "#D3D3D3",
                      }}
                    ></span>
                  )}

                  {/* Dot */}
                  <span
                    className={`absolute left-1 top-2 w-4 h-4 rounded-full transition-all duration-500 ease-in-out`}
                    style={{
                      backgroundColor: isCompleted
                        ? completedColor
                        : isCurrent
                        ? activeColor
                        : "#D3D3D3",
                      boxShadow: isCurrent ? `0 0 8px ${activeColor}` : "none",
                    }}
                  ></span>

                  {/* Icon */}
                  <i
                    className={`absolute left-[-4.5rem] top-[-0.3rem] text-4xl md:text-5xl transition-all duration-500 ease-in-out ${step.iconClass}`}
                    style={{
                      color: isCompleted
                        ? completedColor
                        : isCurrent
                        ? activeColor
                        : "#D3D3D3",
                    }}
                  ></i>

                  {/* Text */}
                  <span
                    className="ml-8 text-lg md:text-xl font-medium transition-all duration-300 ease-in-out"
                    style={{
                      color: isCompleted
                        ? completedColor
                        : isCurrent
                        ? activeColor
                        : "#A9A9A9",
                    }}
                  >
                    {step.label}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default SingleOrder;
