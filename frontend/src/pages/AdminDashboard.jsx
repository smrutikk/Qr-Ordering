import { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:5000/api";

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${API}/orders`);
      setOrders(res.data);
    } catch (error) {
      console.error("Error fetching orders", error);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.patch(`${API}/orders/${id}`, { status });
      fetchOrders();
    } catch (error) {
      console.error("Error updating status", error);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000); // auto refresh
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        🧾 Orders Dashboard
      </h1>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white rounded-2xl shadow-md p-5 border border-gray-100"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-semibold text-lg">
                Table {order.table_number}
              </h2>

              <span
                className={`px-3 py-1 text-sm rounded-full font-medium ${
                  order.status === "pending"
                    ? "bg-yellow-100 text-yellow-700"
                    : order.status === "preparing"
                    ? "bg-blue-100 text-blue-700"
                    : order.status === "ready"
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {order.status}
              </span>
            </div>

            {/* Items */}
            <div className="mb-4">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between text-sm text-gray-600"
                >
                  <span>
                    {item.quantity}x {item.name}
                  </span>
                  <span>₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="flex justify-between font-semibold mb-4">
              <span>Total</span>
              <span>₹{order.total_amount}</span>
            </div>

            {/* Actions */}
            <div className="flex gap-2 flex-wrap">
              {order.status === "pending" && (
                <button
                  onClick={() => updateStatus(order.id, "preparing")}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
                >
                  Start Preparing
                </button>
              )}

              {order.status === "preparing" && (
                <button
                  onClick={() => updateStatus(order.id, "ready")}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700"
                >
                  Mark Ready
                </button>
              )}

              {order.status === "ready" && (
                <button
                  onClick={() => updateStatus(order.id, "completed")}
                  className="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-900"
                >
                  Complete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
