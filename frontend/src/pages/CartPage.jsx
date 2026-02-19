import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import axios from "axios";

export default function CartPage() {
  const navigate = useNavigate();
  const { cart, clearCart } = useCart();
  const API = "http://localhost:5000";

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const placeOrder = async () => {
    const tableId = localStorage.getItem("table_id");
    const restaurantId = localStorage.getItem("restaurant_id");

    if (!tableId || !restaurantId) {
      alert("Table information missing. Please scan QR again.");
      return false;
    }

    try {
      const orderData = {
        restaurant_id: parseInt(restaurantId, 10),
        table_id: parseInt(tableId, 10),
        items: cart.map((item) => ({
          menu_item_id: item.id,
          quantity: item.qty,
        })),
      };

      await axios.post(`${API}/order/create`, orderData);
      return true;
    } catch (err) {
      console.error(err);
      alert("Order failed.");
      return false;
    }
  };

  const handlePlaceOrder = async () => {
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    const success = await placeOrder();
    if (!success) return;

    clearCart();
    navigate("/success");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-100 pb-24">
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white p-6 rounded-b-3xl shadow-lg">
        <button onClick={() => navigate(-1)} className="text-sm opacity-90">
          Back
        </button>
        <h1 className="text-2xl font-bold mt-2">Your Order</h1>
      </div>

      <div className="px-4 mt-6 space-y-4">
        {cart.length === 0 && (
          <div className="text-center text-gray-500 mt-10">Your cart is empty</div>
        )}

        {cart.map((item) => (
          <div
            key={item.id}
            className="bg-white p-4 rounded-2xl shadow-md flex justify-between items-center"
          >
            <div>
              <h3 className="font-semibold text-gray-800">{item.name}</h3>
              <p className="text-sm text-gray-500">
                Rs {item.price} x {item.qty}
              </p>
            </div>

            <p className="font-bold text-orange-600">Rs {item.price * item.qty}</p>
          </div>
        ))}

        {cart.length > 0 && (
          <>
            <div className="bg-white p-4 rounded-2xl shadow-md flex justify-between text-lg font-bold">
              <span>Total</span>
              <span className="text-orange-600">Rs {total}</span>
            </div>

            <button
              onClick={handlePlaceOrder}
              className="w-full bg-amber-500 text-white py-4 rounded-full font-semibold"
            >
              Place Order
            </button>
          </>
        )}
      </div>
    </div>
  );
}
