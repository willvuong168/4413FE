import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import VehicleCard from "../components/VehicleCard";

export default function Homepage() {
  const [featuredVehicles, setFeaturedVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHotDeals() {
      try {
        setLoading(true);
        const response = await axios.get(
          "https://4413groupa.me/api/vehicles/deals?page=0&size=50"
        );
        setFeaturedVehicles(response.data.content);
      } catch (error) {
        console.error("Failed to fetch hot deals", error);
      } finally {
        setLoading(false);
      }
    }

    fetchHotDeals();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hot Deals */}
      <main className="flex-1 p-8">
        <section>
          <h2 className="text-3xl font-semibold mb-6">Hot Deals</h2>

          {loading ? (
            <p>Loading hot deals...</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredVehicles.map((vehicle) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 py-4 text-center text-gray-600 text-sm">
        © {new Date().getFullYear()} EECS 4413 Group A. All Rights Reserved.
      </footer>
    </div>
  );
}
