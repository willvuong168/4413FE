import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import VehicleCard from "../../components/VehicleCard";

export default function CatalogView() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter & sort state
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedShape, setSelectedShape] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedHistory, setSelectedHistory] = useState(""); // "withDamage", "noDamage"
  const [sortOption, setSortOption] = useState(""); // "priceAsc", "priceDesc", "mileageAsc", "mileageDesc"

  useEffect(() => {
    async function fetchVehicles() {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          "https://4413groupa.me/api/vehicles?page=0&size=50"
        );
        // API returns paginated data with 'content' array
        setVehicles(response.data.content || []);
      } catch (err) {
        console.error("Failed to fetch vehicles", err);
        setError("Unable to load vehicle catalog.");
      } finally {
        setLoading(false);
      }
    }

    fetchVehicles();
  }, []);

  // derive unique filter options
  const brands = useMemo(
    () => [...new Set(vehicles.map((v) => v.brand))],
    [vehicles]
  );
  const shapes = useMemo(
    () => [...new Set(vehicles.map((v) => v.shape))],
    [vehicles]
  );
  const years = useMemo(
    () => [...new Set(vehicles.map((v) => v.year))].sort(),
    [vehicles]
  );

  // filtered and sorted list
  const displayed = useMemo(() => {
    let list = [...vehicles];

    // filter
    if (selectedBrand) list = list.filter((v) => v.brand === selectedBrand);
    if (selectedShape) list = list.filter((v) => v.shape === selectedShape);
    if (selectedYear)
      list = list.filter((v) => v.year === Number(selectedYear));
    if (selectedHistory === "withDamage") list = list.filter((v) => v.accident);
    if (selectedHistory === "noDamage") list = list.filter((v) => !v.accident);

    // sort
    switch (sortOption) {
      case "priceAsc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "priceDesc":
        list.sort((a, b) => b.price - a.price);
        break;
      case "mileageAsc":
        list.sort((a, b) => a.mileage - b.mileage);
        break;
      case "mileageDesc":
        list.sort((a, b) => b.mileage - a.mileage);
        break;
      default:
        break;
    }

    return list;
  }, [
    vehicles,
    selectedBrand,
    selectedShape,
    selectedYear,
    selectedHistory,
    sortOption,
  ]);

  if (loading) return <p className="p-8">Loading catalog...</p>;
  if (error) return <p className="p-8 text-red-600">{error}</p>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Catalog</h1>

      {/* Filters & Sort */}
      <div className="flex flex-col md:flex-row md:items-end md:space-x-6 mb-8">
        <div className="flex space-x-4 mb-4 md:mb-0">
          <div>
            <label className="block text-sm font-medium mb-1">Brand</label>
            <select
              className="border rounded p-2"
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
            >
              <option value="">All</option>
              {brands.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Shape</label>
            <select
              className="border rounded p-2"
              value={selectedShape}
              onChange={(e) => setSelectedShape(e.target.value)}
            >
              <option value="">All</option>
              {shapes.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Year</label>
            <select
              className="border rounded p-2"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              <option value="">All</option>
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">History</label>
            <select
              className="border rounded p-2"
              value={selectedHistory}
              onChange={(e) => setSelectedHistory(e.target.value)}
            >
              <option value="">All</option>
              <option value="noDamage">No Damage</option>
              <option value="withDamage">With Reported Damage</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Sort By</label>
          <select
            className="border rounded p-2"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="">Default</option>
            <option value="priceAsc">Price: Low to High</option>
            <option value="priceDesc">Price: High to Low</option>
            <option value="mileageAsc">Mileage: Low to High</option>
            <option value="mileageDesc">Mileage: High to Low</option>
          </select>
        </div>
      </div>

      {/* Vehicle Grid */}
      {displayed.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayed.map((v) => (
            <VehicleCard key={v.id} vehicle={v} />
          ))}
        </div>
      ) : (
        <p>No vehicles match your filters.</p>
      )}
    </div>
  );
}
