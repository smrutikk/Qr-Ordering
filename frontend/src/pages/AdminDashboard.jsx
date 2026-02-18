import { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:5000";

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("active");
 
  const [previousOrderCount, setPreviousOrderCount] = useState(0);


  const fetchOrders = async () => {
  try {
    const res = await axios.get(`${API}/orders`);

    const sorted = res.data.sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );

    if (sorted.length > previousOrderCount) {
      playNotification();
    }

    setPreviousOrderCount(sorted.length);
    setOrders(sorted);

  } catch (error) {
    console.error("Error fetching orders:", error);
  }
};


  const updateStatus = async (id, status) => {
    try {
      await axios.patch(`${API}/orders/${id}`, { status });
      fetchOrders();
    } catch (error) {
      console.error("Status update failed:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  const filteredOrders =
    filter === "all"
      ? orders
      : filter === "completed"
      ? orders.filter((o) => o.status === "completed")
      : orders.filter((o) => o.status !== "completed");

  const playNotification = () => {
    const audio = new Audio("/notification.mp3");
    audio.play().catch((err) => console.log("Audio blocked:", err));
  };


  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Owner Dashboard
      </h1>

      {/* FILTER BUTTONS */}
      <div className="flex gap-3 mb-6 flex-wrap">
        <button
          onClick={() => setFilter("active")}
          className={`px-4 py-2 rounded-lg ${
            filter === "active"
              ? "bg-blue-600 text-white"
              : "bg-white border"
          }`}
        >
          Active Orders
        </button>

        <button
          onClick={() => setFilter("completed")}
          className={`px-4 py-2 rounded-lg ${
            filter === "completed"
              ? "bg-green-600 text-white"
              : "bg-white border"
          }`}
        >
          Completed
        </button>

        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-lg ${
            filter === "all"
              ? "bg-gray-800 text-white"
              : "bg-white border"
          }`}
        >
          All
        </button>
      </div>

      {/* ORDERS GRID */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filteredOrders.map((order) => (
          <div
            key={order.id}
            className={`bg-white rounded-2xl shadow-md p-5 border transition-all ${
            order.status === "pending"
             ? "border-yellow-400"
             : ""
            }`}

          >
            {/* Header */}
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-semibold text-lg">
                Table {order.table_id}
              </h2>

              <span
                className={`px-3 py-1 text-xs rounded-full font-medium ${
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
            <div className="mb-4 space-y-1 text-sm text-gray-600">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between">
                  <span>
                    {item.quantity} × {item.name}
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
                  onClick={() =>
                    updateStatus(order.id, "preparing")
                  }
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
                >
                  Start Preparing
                </button>
              )}

              {order.status === "preparing" && (
                <button
                  onClick={() =>
                    updateStatus(order.id, "ready")
                  }
                  className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm"
                >
                  Mark Ready
                </button>
              )}

              {order.status === "ready" && (
                <button
                  onClick={() =>
                    updateStatus(order.id, "completed")
                  }
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
