import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { CompareContext } from "../context/CompareContext";

/**
 * VehicleCard
 *
 * Displays a single vehicle's basic info in a card.
 * Props:
 * - vehicle: { vid, name, brand, price, imageUrl }
 */
export default function VehicleCard({ vehicle }) {
  const { vid, name, brand, price, imageUrl } = vehicle;
  const { addCompare } = useContext(CompareContext);

  const handleCompare = () => {
    addCompare(vehicle);
  };

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

        <div className="mt-4 flex space-x-2">
          <Link
            to={`/catalog/${vid}`}
            className="flex-1 text-center bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            View Details
          </Link>
          <button
            onClick={handleCompare}
            className="flex-1 text-center border border-gray-400 text-gray-700 py-2 rounded hover:bg-gray-100 transition"
          >
            Compare
          </button>
        </div>
      </div>
    </div>
  );
}
