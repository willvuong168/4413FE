import { Link } from "react-router-dom";

export default function NotFoundView() {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center p-8">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-xl mb-8">
        Sorry, the page you are looking for does not exist.
      </p>
      <Link to="/" className="text-blue-600 hover:underline">
        Return to Home
      </Link>
    </div>
  );
}
