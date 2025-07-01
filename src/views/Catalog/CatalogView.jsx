import { useEffect, useState, useMemo } from "react";
import VehicleCard from "../../components/VehicleCard";

// Dummy data for vehicles with shape field added
const dummyVehicles = [
  {
    vid: "v001",
    name: "Model X",
    brand: "Tesla",
    price: 87000,
    imageUrl: "/images/tesla-model-x.jpg",
    modelYear: 2021,
    mileage: 12000,
    hasDamage: false,
    shape: "SUV",
  },
  {
    vid: "vv001",
    name: "Model Y",
    brand: "Tesla",
    price: 99000,
    imageUrl: "/images/tesla-model-y.jpg",
    modelYear: 2022,
    mileage: 8000,
    hasDamage: false,
    shape: "SUV",
  },
  {
    vid: "vd001",
    name: "Taycan",
    brand: "Porsche",
    price: 133000,
    imageUrl: "/images/porsche-taycan.jpg",
    modelYear: 2020,
    mileage: 15000,
    hasDamage: true,
    shape: "Sedan",
  },
  // Add more dummy vehicles as needed
  {
    vid: "vg001",
    name: "Ioniq 5",
    brand: "Hyundai",
    price: 56000,
    imageUrl: "/images/hyundai-ioniq5.jpg",
    modelYear: 2023,
    mileage: 3000,
    hasDamage: false,
    shape: "Crossover",
  },
  {
    vid: "vg002",
    name: "Mustang Mach-E",
    brand: "Ford",
    price: 68000,
    imageUrl: "/images/ford-mach-e.jpg",
    modelYear: 2022,
    mileage: 10000,
    hasDamage: true,
    shape: "SUV",
  },
];

export default function CatalogView() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter & sort state
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedShape, setSelectedShape] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedHistory, setSelectedHistory] = useState(""); // "all", "withDamage", "noDamage"
  const [sortOption, setSortOption] = useState(""); // "priceAsc", "priceDesc", "mileageAsc", "mileageDesc"

  useEffect(() => {
    // Use dummy data instead of API
    setVehicles(dummyVehicles);
    setLoading(false);
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
    () => [...new Set(vehicles.map((v) => v.modelYear))].sort(),
    [vehicles]
  );

  // filtered and sorted list
  const displayed = useMemo(() => {
    let list = [...vehicles];

    // filter
    if (selectedBrand) list = list.filter((v) => v.brand === selectedBrand);
    if (selectedShape) list = list.filter((v) => v.shape === selectedShape);
    if (selectedYear)
      list = list.filter((v) => v.modelYear === Number(selectedYear));
    if (selectedHistory === "withDamage")
      list = list.filter((v) => v.hasDamage === true);
    if (selectedHistory === "noDamage") list = list.filter((v) => !v.hasDamage);

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
            <VehicleCard key={v.vid} vehicle={v} />
          ))}
        </div>
      ) : (
        <p>No vehicles match your filters.</p>
      )}
    </div>
  );
}
