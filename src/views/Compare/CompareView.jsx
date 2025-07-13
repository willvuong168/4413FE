import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { CompareContext } from "../../context/CompareContext";

/**
 * CompareView
 *
 * Displays up to four vehicles side-by-side for comparison.
 */
export default function CompareView() {
  const { compareItems, removeCompare, clearCompare } =
    useContext(CompareContext);

  if (!compareItems.length) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl mb-4">No vehicles selected for comparison.</h2>
        <Link to="/catalog" className="text-blue-600 hover:underline">
          Return to Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="p-8 overflow-x-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold">Compare Vehicles</h1>
        <button onClick={clearCompare} className="text-red-600 hover:underline">
          Clear All
        </button>
      </div>

      <table className="min-w-full border-collapse">
        <thead>
          <tr>
            <th className="border px-4 py-2 text-left">Feature</th>
            {compareItems.map((item) => (
              <th key={item.id} className="border px-4 py-2 text-center">
                {item.make} {item.model}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <th className="border px-4 py-2 text-left">Image</th>
            {compareItems.map((item) => (
              <td key={item.id} className="border px-4 py-2 text-center">
                <img
                  src={item.imageUrls?.[0] || "/placeholder.png"}
                  alt={`${item.make} ${item.model}`}
                  className="mx-auto h-32 object-cover rounded"
                />
              </td>
            ))}
          </tr>
          <tr>
            <th className="border px-4 py-2 text-left">Price</th>
            {compareItems.map((item) => (
              <td key={item.id} className="border px-4 py-2 text-center">
                $
                {item.price.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
              </td>
            ))}
          </tr>
          <tr>
            <th className="border px-4 py-2 text-left">Year</th>
            {compareItems.map((item) => (
              <td key={item.id} className="border px-4 py-2 text-center">
                {item.year}
              </td>
            ))}
          </tr>
          <tr>
            <th className="border px-4 py-2 text-left">Mileage</th>
            {compareItems.map((item) => (
              <td key={item.id} className="border px-4 py-2 text-center">
                {item.mileage.toLocaleString()} km
              </td>
            ))}
          </tr>
          <tr>
            <th className="border px-4 py-2 text-left">Type</th>
            {compareItems.map((item) => (
              <td key={item.id} className="border px-4 py-2 text-center">
                {item.shape}
              </td>
            ))}
          </tr>
          <tr>
            <th className="border px-4 py-2 text-left">History</th>
            {compareItems.map((item) => (
              <td key={item.id} className="border px-4 py-2 text-center">
                {item.accident ? "Reported damage" : "No reported damage"}
              </td>
            ))}
          </tr>
          <tr>
            <th className="border px-4 py-2 text-left">Actions</th>
            {compareItems.map((item) => (
              <td key={item.id} className="border px-4 py-2 text-center">
                <button
                  onClick={() => removeCompare(item.id)}
                  className="text-red-600 hover:underline"
                >
                  Remove
                </button>
              </td>
            ))}
          </tr>
        </tbody>
      </table>

      <div className="mt-6 text-center">
        <Link to="/catalog" className="text-blue-600 hover:underline">
          Continue Browsing
        </Link>
      </div>
    </div>
  );
}
