import { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { CartContext } from "../../context/CartContext";

// Dummy data for vehicles
const dummyVehicles = [
  {
    vid: "v001",
    name: "Model X",
    brand: "Tesla",
    price: 87000,
    imageUrl: "/images/tesla-model-x.jpg",
    description: "A SUV built for utility and performance",
    mileage: 12000,
    modelYear: 2021,
    hasDamage: false,
  },
  {
    vid: "vv001",
    name: "Model Y",
    brand: "Tesla",
    price: 99000,
    imageUrl: "/images/tesla-model-y.jpg",
    description: "A fully electric, mid-size SUV",
    mileage: 8000,
    modelYear: 2022,
    hasDamage: false,
  },
  {
    vid: "vd001",
    name: "Taycan",
    brand: "Porsche",
    price: 133000,
    imageUrl: "/images/porsche-taycan.jpg",
    description: "A vehicle with a timeless and instantly recognizable design",
    mileage: 15000,
    modelYear: 2020,
    hasDamage: true,
  },
];

export default function VehicleDetailView() {
  const { vid } = useParams();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addItem } = useContext(CartContext);

  useEffect(() => {
    // Use dummy data instead of API
    const found = dummyVehicles.find((v) => v.vid === vid);
    setVehicle(found || null);
    setLoading(false);
  }, [vid]);

  const handleAddToCart = () => {
    if (vehicle) {
      // addItem expects an object with vid, name, brand, price, imageUrl
      addItem({
        vid: vehicle.vid,
        name: vehicle.name,
        brand: vehicle.brand,
        price: vehicle.price,
        imageUrl: vehicle.imageUrl,
      });
    }
  };

  if (loading) return <p className="p-8">Loading vehicle details...</p>;
  if (!vehicle) return <p className="p-8">Vehicle not found.</p>;

  const {
    name,
    brand,
    price,
    imageUrl,
    description,
    mileage,
    modelYear,
    hasDamage,
  } = vehicle;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <Link
        to="/catalog"
        className="text-blue-600 hover:underline mb-4 inline-block"
      >
        ← Back to Catalog
      </Link>
      <div className="flex flex-col lg:flex-row gap-8">
        <img
          src={imageUrl}
          alt={`${brand} ${name}`}
          className="w-full lg:w-1/2 h-auto object-cover rounded"
        />
        <div className="flex-1">
          <h1 className="text-4xl font-bold mb-2">
            {brand} {name}
          </h1>
          <p className="text-2xl text-gray-700 mb-4">
            ${price.toLocaleString()}
          </p>
          <p className="mb-4">{description}</p>
          <ul className="space-y-1 mb-6">
            <li>
              <strong>Model Year:</strong> {modelYear}
            </li>
            <li>
              <strong>Mileage:</strong> {mileage.toLocaleString()} km
            </li>
            <li>
              <strong>History:</strong>{" "}
              {hasDamage ? "Reported damage" : "No reported damage"}
            </li>
          </ul>
          <button
            onClick={handleAddToCart}
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
