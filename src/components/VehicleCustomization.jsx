import React, { useState, useContext } from "react";
import { CartContext } from "../context/CartContext";

/**
 * VehicleCustomization
 *
 * Lets users customize vehicle options before adding to cart.
 * Props:
 * - vehicle: {
 *     vid, name, brand, price, imageUrl,
 *     exteriorColor, interiorColor, interiorFabric
 *   }
 */
export default function VehicleCustomization({ vehicle }) {
  const { addItem } = useContext(CartContext);
  const {
    vid,
    name,
    brand,
    price,
    imageUrl,
    exteriorColor,
    interiorColor,
    interiorFabric,
  } = vehicle;

  // Available customization options (can be fetched or defined per model)
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

  const [selectedExterior, setSelectedExterior] = useState(exteriorColor);
  const [selectedInteriorColor, setSelectedInteriorColor] =
    useState(interiorColor);
  const [selectedInteriorFabric, setSelectedInteriorFabric] =
    useState(interiorFabric);

  const handleAdd = () => {
    // Construct customized vehicle object
    const customizedItem = {
      vid,
      name,
      brand,
      price,
      imageUrl,
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
      <h2 className="text-2xl font-semibold">Customize Your Vehicle</h2>

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
        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
      >
        Add to Cart with Customizations
      </button>
    </div>
  );
}
