function MenuItemCard({ item, addToCart }) {
  return (
    <div className="bg-white rounded-xl shadow p-4 flex justify-between items-center">
      <div>
        <h2 className="font-semibold text-lg">{item.name}</h2>
        <p className="text-gray-600">₹{item.price}</p>
      </div>

      <button
        onClick={() => addToCart(item)}
        className="bg-green-500 text-white px-4 py-2 rounded-lg active:scale-95 transition"
      >
        Add
      </button>
    </div>
  );
}

export default MenuItemCard;
