import React, { useState, useContext } from "react";
import { CartContext } from "../context/CartContext";

/**
 * VehicleCustomization
 *
 * Lets users customize vehicle options before adding to cart.
 * Props:
 * - vehicle: {
 *     id, price, vin, shape, make, model, color,
 *     year, mileage, description, newVehicle, accident, hotDeal,
 *     imageUrls: string[]
 *   }
 */
export default function VehicleCustomization({ vehicle }) {
  const { addItem } = useContext(CartContext);
  const {
    id,
    price,
    vin,
    shape,
    make,
    model,
    color, // default exterior color
    imageUrls = [], // array of image URLs
  } = vehicle;

  // Available customization options (could be fetched per model)
  const exteriorOptions = [
    "White",
    "Red",
    "Blue",
    "Black",
    "Silver",
    "Yellow",
    "Gray",
  ];
  const interiorColorOptions = ["Black", "Beige", "Gray"];
  const interiorFabricOptions = [
    "Leather",
    "Vegan Leather",
    "Cloth",
    "Synthetic Leather",
  ];

  const [selectedExterior, setSelectedExterior] = useState(color);
  const [selectedInteriorColor, setSelectedInteriorColor] = useState(
    interiorColorOptions[0]
  );
  const [selectedInteriorFabric, setSelectedInteriorFabric] = useState(
    interiorFabricOptions[0]
  );

  const handleAdd = () => {
    const customizedItem = {
      id,
      vin,
      shape,
      make,
      model,
      price,
      imageUrl: imageUrls[0] || "", // fallback if empty
      customizations: {
        exteriorColor: selectedExterior,
        interiorColor: selectedInteriorColor,
        interiorFabric: selectedInteriorFabric,
      },
    };
    addItem(customizedItem);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md space-y-4 mt-8">
      <h2 className="text-2xl font-semibold">
        Customize Your {make} {model}
      </h2>

      {/* Exterior Color */}
      <div>
        <label className="block text-sm font-medium mb-1">Exterior Color</label>
        <select
          value={selectedExterior}
          onChange={(e) => setSelectedExterior(e.target.value)}
          className="border rounded p-2 w-full"
        >
          {exteriorOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>

      {/* Interior Color */}
      <div>
        <label className="block text-sm font-medium mb-1">Interior Color</label>
        <select
          value={selectedInteriorColor}
          onChange={(e) => setSelectedInteriorColor(e.target.value)}
          className="border rounded p-2 w-full"
        >
          {interiorColorOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>

      {/* Interior Fabric */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Interior Fabric
        </label>
        <select
          value={selectedInteriorFabric}
          onChange={(e) => setSelectedInteriorFabric(e.target.value)}
          className="border rounded p-2 w-full"
        >
          {interiorFabricOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={handleAdd}
        className="w-full bg-green-600 text-black py-2 rounded hover:bg-green-700 transition"
      >
        Add to Cart with Customizations
      </button>
    </div>
  );
}
