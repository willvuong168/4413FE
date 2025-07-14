import { Link, useLocation } from "react-router-dom";

export default function ConfirmationView() {
  const location = useLocation();
  // The response now has { message, order }
  const message = location.state?.message || "Order placed successfully!";
  const order = location.state?.order;

  return (
    <div className="max-w-xl mx-auto p-8 text-center">
      <h1 className="text-3xl font-bold mb-4">Thank You for Your Order!</h1>
      <p className="text-lg mb-6">{message}</p>
      {order && (
        <div className="mb-6 p-4 border rounded bg-gray-50 text-left">
          <h2 className="text-xl font-semibold mb-2">Order Summary</h2>
          <p>
            <span className="font-medium">Order Number:</span>{" "}
            {order.orderNumber}
          </p>
          <p>
            <span className="font-medium">Order ID:</span> {order.id}
          </p>
          <p>
            <span className="font-medium">Email:</span> {order.email}
          </p>
          <p>
            <span className="font-medium">Name:</span> {order.firstName}{" "}
            {order.lastName}
          </p>
          <p>
            <span className="font-medium">Shipping Address:</span>{" "}
            {order.shippingAddress}
          </p>
          <p>
            <span className="font-medium">Status:</span> {order.status}
          </p>
          <p>
            <span className="font-medium">Card Info:</span> **** **** ****{" "}
            {String(order.cardInfo).slice(-4)}
          </p>
          <div className="mt-4">
            <h3 className="font-semibold mb-1">Items:</h3>
            <table className="w-full text-sm border">
              <thead>
                <tr>
                  <th className="border px-2 py-1">Vehicle ID</th>
                  <th className="border px-2 py-1">Quantity</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item, idx) => (
                  <tr key={idx}>
                    <td className="border px-2 py-1">{item.vehicleId}</td>
                    <td className="border px-2 py-1">{item.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4">
            <span className="font-medium">Total:</span> $
            {order.total?.toLocaleString()}
          </p>
        </div>
      )}
      <Link to="/catalog" className="text-blue-600 hover:underline text-lg">
        Continue Shopping
      </Link>
    </div>
  );
}
