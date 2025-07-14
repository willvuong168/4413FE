import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { CartContext } from "../../context/CartContext";

export default function CheckoutView() {
  const { cartItems, clearCart } = useContext(CartContext);
  const navigate = useNavigate();

  // Form state
  const [form, setForm] = useState({
    email: "",
    firstName: "",
    lastName: "",
    shippingAddress: "",
    cardInfo: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const orderPayload = {
        email: form.email,
        firstName: form.firstName,
        lastName: form.lastName,
        shippingAddress: form.shippingAddress,
        items: cartItems.map((item) => ({
          vehicleId: item.vehicleId || item.id, // fallback to id if vehicleId not present
          quantity: item.quantity || 1,
        })),
        cardInfo: form.cardInfo,
        total: cartItems.reduce(
          (acc, item) => acc + item.price * (item.quantity || 1),
          0
        ),
      };
      console.log(orderPayload);
      const res = await axios.post("/api/orders/place", orderPayload);
      console.log(res.data);
      if (res.data.order.status === "ORDERED") {
        clearCart();
        navigate("/confirmation", {
          state: { success: true, order: res.data.order },
        });
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
        {/* Contact & Shipping Information */}
        <div>
          <h2 className="text-xl font-semibold mb-2">
            Contact & Shipping Information
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full border rounded p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                required
                className="w-full border rounded p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                required
                className="w-full border rounded p-2"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium mb-1">
                Shipping Address
              </label>
              <input
                type="text"
                name="shippingAddress"
                value={form.shippingAddress}
                onChange={handleChange}
                required
                className="w-full border rounded p-2"
                placeholder="123 Main St, City, Province, ZIP"
              />
            </div>
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
            name="cardInfo"
            value={form.cardInfo}
            onChange={handleChange}
            required
            className="w-full border rounded p-2"
            placeholder="1234 5678 9012 3456"
          />
        </div>

        {error && <p className="text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-black py-3 rounded hover:bg-blue-700 transition"
        >
          {loading ? "Processing..." : "Confirm Order"}
        </button>
      </form>
    </div>
  );
}
