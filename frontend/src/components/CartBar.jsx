import { useNavigate } from "react-router-dom";

function CartBar({ cart }) {
  const navigate = useNavigate();

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black text-white p-4 flex justify-between items-center">
      <div>
        {cart.length} items | ₹{total}
      </div>

      <button
        onClick={() => navigate("/cart", { state: { cart } })}
        className="bg-green-500 px-4 py-2 rounded-lg"
      >
        View Cart
      </button>
    </div>
  );
}

export default CartBar;
