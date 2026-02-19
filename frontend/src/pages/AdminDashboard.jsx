import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const API = "http://localhost:5000";

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("active");
  const previousOrderCountRef = useRef(0);
  const { token } = useAuth();

  const restaurantId = parseInt(localStorage.getItem("restaurant_id"), 10) || 1;

  const playNotification = () => {
    const audio = new Audio("/notification.mp3");
    audio.play().catch((err) => console.log("Audio blocked:", err));
  };

  const fetchOrders = useCallback(async () => {
    if (!token) return;

    try {
      const res = await axios.get(`${API}/orders/${restaurantId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const normalized = Array.isArray(res.data)
        ? res.data.map((order) => ({
            ...order,
            order_id: order.order_id ?? order.id,
            status: String(order.status || "").toUpperCase(),
            items: Array.isArray(order.items) ? order.items : [],
          }))
        : [];

      const sorted = normalized.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );

      if (
        previousOrderCountRef.current > 0 &&
        sorted.length > previousOrderCountRef.current
      ) {
        playNotification();
      }

      previousOrderCountRef.current = sorted.length;
      setOrders(sorted);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  }, [restaurantId, token]);

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`${API}/order/update_status/${id}`, { status });
      fetchOrders();
    } catch (error) {
      console.error("Status update failed:", error);
    }
  };

  useEffect(() => {
    const interval = setInterval(fetchOrders, 5000);
    const initialLoad = setTimeout(() => {
      fetchOrders();
    }, 0);

    return () => {
      clearTimeout(initialLoad);
      clearInterval(interval);
    };
  }, [fetchOrders]);

  const filteredOrders =
    filter === "all"
      ? orders
      : filter === "completed"
      ? orders.filter((o) => o.status === "SERVED")
      : orders.filter((o) => o.status !== "SERVED");

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Owner Dashboard</h1>

      <div className="flex gap-3 mb-6 flex-wrap">
        <button
          onClick={() => setFilter("active")}
          className={`px-4 py-2 rounded-lg ${
            filter === "active" ? "bg-blue-600 text-white" : "bg-white border"
          }`}
        >
          Active Orders
        </button>

        <button
          onClick={() => setFilter("completed")}
          className={`px-4 py-2 rounded-lg ${
            filter === "completed" ? "bg-green-600 text-white" : "bg-white border"
          }`}
        >
          Completed
        </button>

        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-lg ${
            filter === "all" ? "bg-gray-800 text-white" : "bg-white border"
          }`}
        >
          All
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filteredOrders.map((order) => (
          <div
            key={order.order_id}
            className={`bg-white rounded-2xl shadow-md p-5 border transition-all ${
              order.status === "CREATED" ? "border-yellow-400" : ""
            }`}
          >
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-semibold text-lg">Table {order.table_id}</h2>

              <span
                className={`px-3 py-1 text-xs rounded-full font-medium ${
                  order.status === "CREATED"
                    ? "bg-yellow-100 text-yellow-700"
                    : order.status === "PREPARING"
                    ? "bg-blue-100 text-blue-700"
                    : order.status === "READY"
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {order.status}
              </span>
            </div>

            <div className="mb-4 space-y-1 text-sm text-gray-600">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between">
                  <span>
                    {item.quantity} x {item.name}
                  </span>
                  <span>Rs {item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-between font-semibold mb-4">
              <span>Total</span>
              <span>Rs {order.total_amount}</span>
            </div>

            <div className="flex gap-2 flex-wrap">
              {order.status === "CREATED" && (
                <button
                  onClick={() => updateStatus(order.order_id, "PREPARING")}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
                >
                  Start Preparing
                </button>
              )}

              {order.status === "PREPARING" && (
                <button
                  onClick={() => updateStatus(order.order_id, "READY")}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm"
                >
                  Mark Ready
                </button>
              )}

              {order.status === "READY" && (
                <button
                  onClick={() => updateStatus(order.order_id, "SERVED")}
                  className="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm"
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
