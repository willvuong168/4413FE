import { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { CartContext } from "../../context/CartContext";
import VehicleCustomization from "../../components/VehicleCustomization";

export default function VehicleDetailView() {
  const { vid } = useParams();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Review states
  const [reviews, setReviews] = useState([]);
  const [reviewLoading, setReviewLoading] = useState(true);
  const [reviewError, setReviewError] = useState(null);
  const [newReviewer, setNewReviewer] = useState("");
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState("");

  const { addItem } = useContext(CartContext);

  useEffect(() => {
    async function fetchVehicle() {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          `http://localhost:8080/api/vehicles/${vid}`
        );
        setVehicle(response.data);
      } catch (err) {
        console.error("Failed to fetch vehicle details", err);
        setError("Unable to load vehicle details.");
      } finally {
        setLoading(false);
      }
    }

    fetchVehicle();
  }, [vid]);

  useEffect(() => {
    async function fetchReviews() {
      setReviewLoading(true);
      setReviewError(null);
      try {
        const response = await axios.get(
          `http://localhost:8080/api/vehicles/${vid}/reviews`
        );
        setReviews(response.data);
      } catch (err) {
        console.error("Failed to fetch reviews", err);
        setReviewError("Unable to load reviews.");
      } finally {
        setReviewLoading(false);
      }
    }

    fetchReviews();
  }, [vid]);

  const handleAddToCart = () => {
    if (!vehicle) return;
    addItem({
      id: vehicle.id,
      name: `${vehicle.make} ${vehicle.model}`,
      price: vehicle.price,
      imageUrl: vehicle.imageUrls?.[0] || "/placeholder.png",
    });
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!newReviewer || !newComment) return;
    try {
      const response = await axios.post(
        `http://localhost:8080/api/vehicles/${vid}/reviews`,
        {
          reviewer: newReviewer,
          rating: newRating,
          comment: newComment,
        }
      );
      setReviews((prev) => [...prev, response.data]);
      setNewReviewer("");
      setNewRating(5);
      setNewComment("");
    } catch (err) {
      console.error("Failed to submit review", err);
      alert("Unable to submit review. Please try again later.");
    }
  };

  if (loading) return <p className="p-8">Loading vehicle details...</p>;
  if (error) return <p className="p-8 text-red-600">{error}</p>;
  if (!vehicle) return <p className="p-8">Vehicle not found.</p>;

  const {
    make,
    model,
    price,
    description,
    mileage,
    year,
    shape,
    color,
    newVehicle,
    accident,
    hotDeal,
    imageUrls,
  } = vehicle;

  const primaryImage =
    imageUrls && imageUrls.length > 0 ? imageUrls[0] : "/placeholder.png";

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <Link
        to="/catalog"
        className="text-blue-600 hover:underline mb-4 inline-block"
      >
        ← Back to Catalog
      </Link>

      {hotDeal && (
        <span className="inline-block bg-red-500 text-black px-3 py-1 rounded-full mb-4">
          Hot Deal!
        </span>
      )}

      <div className="flex flex-col lg:flex-row gap-8">
        <img
          src={primaryImage}
          alt={`${make} ${model}`}
          className="w-full lg:w-1/2 h-auto object-cover rounded"
        />

        <div className="flex-1">
          <h1 className="text-4xl font-bold mb-2">
            {make} {model}
          </h1>
          <p className="text-2xl text-gray-700 mb-4">
            ${price.toLocaleString()}
          </p>
          <p className="mb-4">{description}</p>

          <ul className="space-y-1 mb-6">
            <li>
              <strong>Model Year:</strong> {year}
            </li>
            <li>
              <strong>Mileage:</strong> {mileage.toLocaleString()} km
            </li>
            <li>
              <strong>Body Style:</strong> {shape}
            </li>
            <li>
              <strong>Color:</strong> {color}
            </li>
            <li>
              <strong>Status:</strong> {newVehicle ? "New" : "Used"}
            </li>
            <li>
              <strong>Accident History:</strong>{" "}
              {accident ? "Reported" : "None"}
            </li>
          </ul>

          <button
            onClick={handleAddToCart}
            className="bg-blue-600 text-black py-2 px-4 rounded hover:bg-blue-700 transition mb-6"
          >
            Add to Cart
          </button>

          <VehicleCustomization vehicle={vehicle} />

          {/* Reviews Section */}
          <section className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">Reviews</h2>
            {reviewLoading ? (
              <p>Loading reviews...</p>
            ) : reviewError ? (
              <p className="text-red-600">{reviewError}</p>
            ) : reviews.length > 0 ? (
              <ul className="space-y-4 mb-6">
                {reviews.map((rev) => (
                  <li key={rev.id} className="border-b pb-4">
                    <div className="flex items-center mb-1">
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <span
                          key={idx}
                          className={`text-xl ${
                            idx < rev.rating
                              ? "text-yellow-500"
                              : "text-gray-300"
                          }`}
                        >
                          ★
                        </span>
                      ))}
                      <span className="ml-2 text-gray-600 text-sm">
                        by {rev.reviewer}
                      </span>
                    </div>
                    <p>{rev.comment}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mb-6">No reviews yet. Be the first to review!</p>
            )}

            <form onSubmit={handleReviewSubmit} className="mb-8">
              <h3 className="text-xl font-semibold mb-2">Write a Review</h3>
              <div className="mb-4">
                <label className="block mb-1 font-medium">Name:</label>
                <input
                  type="text"
                  value={newReviewer}
                  onChange={(e) => setNewReviewer(e.target.value)}
                  className="w-full border rounded p-2"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1 font-medium">Rating:</label>
                <select
                  value={newRating}
                  onChange={(e) => setNewRating(Number(e.target.value))}
                  className="border rounded p-2"
                >
                  {[1, 2, 3, 4, 5].map((r) => (
                    <option key={r} value={r}>
                      {r} Star{r > 1 ? "s" : ""}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block mb-1 font-medium">Comment:</label>
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="w-full border rounded p-2"
                  rows={4}
                  required
                />
              </div>
              <button
                type="submit"
                className="bg-green-600 text-black py-2 px-4 rounded hover:bg-green-700 transition"
              >
                Submit Review
              </button>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}
