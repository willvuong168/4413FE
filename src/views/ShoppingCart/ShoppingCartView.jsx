import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../../context/CartContext";
import VehicleCard from "../../components/VehicleCard";

export default function ShoppingCartView() {
  const { cartItems, updateQuantity, removeItem, clearCart } =
    useContext(CartContext);
  const navigate = useNavigate();

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleCheckout = () => {
    navigate("/checkout");
  };

  if (cartItems.length === 0) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl mb-4">Your shopping cart is empty</h2>
        <Link to="/catalog" className="text-blue-600 hover:underline">
          Browse Vehicles
        </Link>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>

      <div className="space-y-6">
        {cartItems.map((item) => (
          <div
            key={item.vid}
            className="flex items-center space-x-4 border-b pb-4"
          >
            <div className="w-24 h-24 flex-shrink-0">
              <img
                src={item.imageUrl || "/placeholder.png"}
                alt={`${item.brand} ${item.name}`}
                className="object-cover w-full h-full rounded"
              />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold">
                {item.brand} {item.name}
              </h2>
              <p className="text-gray-600">
                Price: ${item.price.toLocaleString()}
              </p>
              <div className="mt-2 flex items-center space-x-2">
                <label htmlFor={`qty-${item.vid}`}>Qty:</label>
                <input
                  id={`qty-${item.vid}`}
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) =>
                    updateQuantity(item.vid, parseInt(e.target.value, 10))
                  }
                  className="w-16 border rounded p-1"
                />
              </div>
            </div>
            <div className="text-right space-y-2">
              <p className="font-semibold">
                ${(item.price * item.quantity).toLocaleString()}
              </p>
              <button
                onClick={() => removeItem(item.vid)}
                className="text-red-600 hover:underline"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Summary & Actions */}
      <div className="mt-8 flex justify-between items-center">
        <div>
          <button
            onClick={clearCart}
            className="text-sm text-red-600 hover:underline"
          >
            Clear Cart
          </button>
        </div>
        <div className="text-right">
          <p className="text-xl font-semibold mb-4">
            Total: ${totalPrice.toLocaleString()}
          </p>
          <button
            onClick={handleCheckout}
            className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
