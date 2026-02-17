import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function MenuPage() {
  const navigate = useNavigate();
  const {
    cart,
    addToCart,
    decreaseQty,
    totalItems,
    totalAmount,
  } = useCart();

  const menuItems = [
    {
      id: 1,
      name: "Veg Burger",
      price: 120,
      image:
        "https://images.unsplash.com/photo-1550547660-d9450f859349",
    },
    {
      id: 2,
      name: "Paneer Pizza",
      price: 250,
      image:
        "https://images.unsplash.com/photo-1601924582975-7e3e8d3e3f03",
    },
    {
      id: 3,
      name: "Cold Coffee",
      price: 90,
      image:
        "https://images.unsplash.com/photo-1509042239860-f550ce710b93",
    },
  ];

  const getQty = (id) => {
    const item = cart.find((c) => c.id === id);
    return item ? item.qty : 0;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-100 pb-28">

      {/* HEADER */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white p-6 rounded-b-3xl shadow-lg">
        <h1 className="text-3xl font-bold tracking-wide">
          Sharma Café
        </h1>
        <p className="text-sm mt-1 opacity-90">
          Delicious food • Fast service
        </p>
      </div>

      {/* MENU SECTION */}
      <div className="px-4 mt-6 space-y-6">
        {menuItems.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-3xl shadow-lg overflow-hidden active:scale-[0.99] transition"
          >
            <img
              src={`${item.image}?auto=format&fit=crop&w=800&q=80`}
              alt={item.name}
              className="w-full h-48 object-cover"
            />

            <div className="p-5 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-semibold text-gray-800">
                  {item.name}
                </h3>
                <p className="text-orange-600 font-bold mt-1 text-lg">
                  ₹{item.price}
                </p>
              </div>

              {getQty(item.id) === 0 ? (
                <button
                  onClick={() => addToCart(item)}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-full font-semibold shadow-md transition active:scale-95"
                >
                  Add
                </button>
              ) : (
                <div className="flex items-center gap-3 bg-orange-50 px-3 py-1 rounded-full">
                  <button
                    onClick={() => decreaseQty(item)}
                    className="w-8 h-8 bg-gray-200 rounded-full text-lg font-bold"
                  >
                    −
                  </button>
                  <span className="font-semibold text-lg">
                    {getQty(item.id)}
                  </span>
                  <button
                    onClick={() => addToCart(item)}
                    className="w-8 h-8 bg-orange-500 text-white rounded-full text-lg font-bold"
                  >
                    +
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* STICKY CART */}
      {totalItems > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white shadow-2xl px-6 py-4 rounded-t-3xl border-t">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">
                {totalItems} items added
              </p>
              <p className="text-xl font-bold text-gray-800">
                ₹{totalAmount}
              </p>
            </div>

            <button
              onClick={() => navigate("/cart")}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-full font-semibold shadow-lg transition active:scale-95"
            >
              View Cart →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
