import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { CompareContext } from "../context/CompareContext";

/**
 * VehicleCard
 *
 * Displays a single vehicle's detailed info in a card.
 * Props:
 * - vehicle: {
 *     id,
 *     quantity,
 *     price,
 *     hotDeal,
 *     shape,
 *     brand,
 *     model,
 *     year,
 *     mileage,
 *     newVehicle,
 *     accident,
 *     exteriorColor,
 *     interiorColor,
 *     interiorMaterial,
 *     description,
 *     imageUrls
 *   }
 */
export default function VehicleCard({ vehicle }) {
  const {
    id,
    quantity,
    price,
    shape,
    brand,
    model,
    exteriorColor,
    interiorColor,
    interiorMaterial,
    year,
    mileage,
    description,
    newVehicle,
    accident,
    hotDeal,
    imageUrls = [],
  } = vehicle;
  const { addCompare } = useContext(CompareContext);

  const handleCompare = () => {
    addCompare(vehicle);
  };

  // Use the first image as the primary display
  const primaryImage = imageUrls.length > 0 ? imageUrls[0] : "/placeholder.png";

  return (
    <div className="border rounded-lg shadow-md overflow-hidden flex flex-col">
      <div className="relative">
        {hotDeal && (
          <span className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 text-xs font-semibold rounded">
            Hot Deal
          </span>
        )}
        <img
          src={primaryImage}
          alt={`${brand} ${model}`}
          className="h-48 w-full object-cover"
        />
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            {brand} {model} ({shape})
          </h3>
          <p className="mt-1 text-gray-600">
            <span className="font-medium">Year:</span> {year}
          </p>
          <p className="mt-1 text-gray-600">
            <span className="font-medium">Exterior:</span> {exteriorColor}
          </p>
          <p className="mt-1 text-gray-600">
            <span className="font-medium">Interior:</span> {interiorColor}{" "}
            {interiorMaterial}
          </p>
          <p className="mt-1 text-gray-600">
            <span className="font-medium">Mileage:</span>{" "}
            {mileage.toLocaleString()} km
          </p>
          <p className="mt-1 text-gray-600">
            <span className="font-medium">Available:</span> {quantity} units
          </p>
          <p className="mt-2 text-gray-700 italic text-sm">{description}</p>
          <div className="mt-2 flex space-x-2">
            <span
              className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                newVehicle
                  ? "bg-green-100 text-green-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {newVehicle ? "New" : "Used"}
            </span>
            <span
              className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                accident
                  ? "bg-red-100 text-red-800"
                  : "bg-blue-100 text-blue-800"
              }`}
            >
              {accident ? "Accident Reported" : "No Accidents"}
            </span>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <p className="text-xl font-semibold text-gray-800">
            ${price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
          <div className="flex space-x-2">
            <Link
              to={`/catalog/${id}`}
              className="px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              View Details
            </Link>
            <button
              onClick={handleCompare}
              className="border border-gray-400 text-gray-700 px-4 py-2 rounded hover:bg-gray-100 transition"
            >
              Compare
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
