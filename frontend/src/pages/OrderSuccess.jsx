import { useNavigate } from "react-router-dom";

export default function OrderSuccess() {
  const navigate = useNavigate();
  const orderId = Math.floor(Math.random() * 100000);

  return (
    <div className="min-h-screen bg-amber-50 flex flex-col items-center justify-center px-6 text-center">
      <div className="bg-white p-8 rounded-3xl shadow-lg w-full max-w-md">
        <div className="text-5xl mb-4">✅</div>

        <h1 className="text-2xl font-bold mb-2">
          Order Placed Successfully!
        </h1>

        <p className="text-gray-600 mb-4">
          Your Order ID is #{orderId}
        </p>

        <p className="text-sm text-gray-500 mb-6">
          Please wait while we prepare your food.
        </p>

        <button
          onClick={() => navigate("/")}
          className="w-full bg-amber-500 text-white py-3 rounded-full font-semibold"
        >
          Back to Menu
        </button>
      </div>
    </div>
  );
}
