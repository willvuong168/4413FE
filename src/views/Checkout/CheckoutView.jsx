import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { CartContext } from "../../context/CartContext";

export default function CheckoutView() {
  const { cartItems, clearCart } = useContext(CartContext);
  const navigate = useNavigate();

  // Form state
  const [billingInfo, setBillingInfo] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    province: "",
    country: "",
    zip: "",
  });
  const [cardNumber, setCardNumber] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBillingInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const orderPayload = {
        billingInfo,
        payment: { cardNumber },
        items: cartItems,
      };
      const res = await axios.post("/api/orders", orderPayload);

      if (res.data.status === "APPROVED") {
        clearCart();
        navigate("/confirmation", { state: { success: true } });
      } else {
        setError("Credit Card Authorization Failed.");
      }
    } catch (err) {
      console.error("Checkout error", err);
      setError("An error occurred during checkout.");
    } finally {
      setLoading(false);
    }
  };

  if (!cartItems.length) {
    return (
      <div className="p-8">
        <h2 className="text-2xl mb-4">Your cart is empty</h2>
        <Link to="/catalog" className="text-blue-600 hover:underline">
          Browse Vehicles
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Billing Information */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Billing Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: "First Name", name: "firstName" },
              { label: "Last Name", name: "lastName" },
              { label: "Address", name: "address" },
              { label: "City", name: "city" },
              { label: "Province/State", name: "province" },
              { label: "Country", name: "country" },
              { label: "ZIP/Postal Code", name: "zip" },
            ].map(({ label, name }) => (
              <div key={name}>
                <label className="block text-sm font-medium mb-1">
                  {label}
                </label>
                <input
                  type="text"
                  name={name}
                  value={billingInfo[name]}
                  onChange={handleChange}
                  required
                  className="w-full border rounded p-2"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Payment */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Payment</h2>
          <label className="block text-sm font-medium mb-1">
            Credit Card Number
          </label>
          <input
            type="text"
            name="cardNumber"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            required
            className="w-full border rounded p-2"
            placeholder="1234 5678 9012 3456"
          />
        </div>

        {error && <p className="text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition"
        >
          {loading ? "Processing..." : "Confirm Order"}
        </button>
      </form>
    </div>
  );
}
