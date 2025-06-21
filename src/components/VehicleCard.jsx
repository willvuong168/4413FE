import { Link } from "react-router-dom";

/**
 * VehicleCard
 *
 * Displays a single vehicle's basic info in a card.
 * Props:
 * - vehicle: { vid, name, brand, price, imageUrl }
 */
export default function VehicleCard({ vehicle }) {
  const { vid, name, brand, price, imageUrl } = vehicle;

  return (
    <div className="border rounded-lg shadow-md overflow-hidden flex flex-col">
      <img
        src={imageUrl || "/placeholder.png"}
        alt={`${brand} ${name}`}
        className="h-48 w-full object-cover"
      />

      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            {brand} {name}
          </h3>
          <p className="mt-2 text-gray-600 text-xl">
            ${price.toLocaleString()}
          </p>
        </div>

        <Link
          to={`/catalog/${vid}`}
          className="mt-4 inline-block text-center bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
