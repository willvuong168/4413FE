import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../../context/CartContext";

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
        {cartItems.map((item) => {
          const {
            id,
            brand,
            model,
            price,
            quantity,
            imageUrl,
            customizations = {},
          } = item;

          return (
            <div key={id} className="flex items-start space-x-4 border-b pb-4">
              <div className="w-24 h-24 flex-shrink-0">
                <img
                  src={imageUrl || "/placeholder.png"}
                  alt={`${brand} ${model}`}
                  className="object-cover w-full h-full rounded"
                />
              </div>

              <div className="flex-1">
                <h2 className="text-lg font-semibold">
                  {brand} {model}
                </h2>
                <p className="text-gray-600">
                  Price: ${price.toLocaleString()}
                </p>

                {/* Customizations */}
                {customizations.exteriorColor && (
                  <p className="text-gray-700 text-sm mt-1">
                    Exterior: {customizations.exteriorColor}
                  </p>
                )}
                {customizations.interiorColor && (
                  <p className="text-gray-700 text-sm">
                    Interior Color: {customizations.interiorColor}
                  </p>
                )}
                {customizations.interiorFabric && (
                  <p className="text-gray-700 text-sm">
                    Interior Fabric: {customizations.interiorFabric}
                  </p>
                )}

                <div className="mt-2 flex items-center space-x-2">
                  <label htmlFor={`qty-${id}`}>Qty:</label>
                  <input
                    id={`qty-${id}`}
                    type="number"
                    min="1"
                    max={item.availableQuantity}
                    value={quantity}
                    onChange={(e) => {
                      let val = parseInt(e.target.value, 10);
                      if (isNaN(val) || val < 1) val = 1;
                      if (val > item.availableQuantity)
                        val = item.availableQuantity;
                      updateQuantity(id, val);
                    }}
                    className="w-16 border rounded p-1"
                  />
                </div>
              </div>

              <div className="text-right space-y-2">
                <p className="font-semibold">
                  ${(price * quantity).toLocaleString()}
                </p>
                <button
                  onClick={() => removeItem(id)}
                  className="text-red-600 hover:underline"
                >
                  Remove
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary & Actions */}
      <div className="mt-8 flex justify-between items-center">
        <button
          onClick={clearCart}
          className="text-sm text-red-600 hover:underline"
        >
          Clear Cart
        </button>

        <div className="text-right">
          <p className="text-xl font-semibold mb-4">
            Total: ${totalPrice.toLocaleString()}
          </p>
          <button
            onClick={handleCheckout}
            className="bg-blue-600 text-black px-6 py-3 rounded hover:bg-blue-700 transition"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
