import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import VehicleCard from "../components/VehicleCard";

// Dummy data for featured vehicles
const dummyFeatured = [
  {
    vid: "v001",
    name: "Model X",
    brand: "Tesla",
    price: 87000,
    imageUrl: "/images/tesla-model-x.jpg",
  },
  {
    vid: "vv001",
    name: "Model Y",
    brand: "Tesla",
    price: 99000,
    imageUrl: "/images/tesla-model-y.jpg",
  },
  {
    vid: "vd001",
    name: "Taycan",
    brand: "Porsche",
    price: 133000,
    imageUrl: "/images/porsche-taycan.jpg",
  },
];

export default function Homepage() {
  const [featuredVehicles, setFeaturedVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Use dummy data instead of fetching from API
  useEffect(() => {
    setFeaturedVehicles(dummyFeatured);
    setLoading(false);
  }, []);

  // useEffect(() => {
  //   async function fetchFeatured() {
  //     try {
  //       const response = await axios.get("/api/vehicles/featured");
  //       setFeaturedVehicles(response.data);
  //     } catch (error) {
  //       console.error("Failed to fetch featured vehicles", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   }
  //   fetchFeatured();
  // }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header + Navigation */}
      <header className="bg-gray-800 text-white">
        <nav className="container mx-auto flex justify-center space-x-8 py-4">
          <Link to="/" className="hover:underline">
            Home
          </Link>
          <Link to="/catalog" className="hover:underline">
            Catalog
          </Link>
          <Link to="/cart" className="hover:underline">
            Cart
          </Link>
          <Link to="/admin" className="hover:underline">
            Admin
          </Link>
        </nav>
        <div className="text-center py-16">
          <h1 className="text-5xl font-bold mb-4">Welcome to EV Store</h1>
          <p className="text-xl max-w-xl mx-auto">
            Discover the best electric vehicles—new and pre-owned—at unbeatable
            prices.
          </p>
        </div>
      </header>

      {/* Featured Vehicles */}
      <main className="flex-1 p-8">
        <section>
          <h2 className="text-3xl font-semibold mb-6">Featured Vehicles</h2>

          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredVehicles.map((vehicle) => (
                <VehicleCard key={vehicle.vid} vehicle={vehicle} />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 py-4 text-center text-gray-600 text-sm">
        © {new Date().getFullYear()} EV Store. All Rights Reserved.
      </footer>
    </div>
  );
}
