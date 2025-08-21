import { Link } from "react-router-dom";
import NotFound from "../assets/error-404.png"
export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4 text-center">
      <img
        src={NotFound}// ← غيّر ده لمسار الصورة عندك
        alt="404 Illustration"
        className="w-28  h-auto mb-8"
      />
      <h1 className="text-3xl md:text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="text-gray-600 mb-6">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/"
        className="px-6 py-3 bg-[#d32f2f] text-white rounded-xl hover:bg-red-700 transition"
      >
        Back to Home
      </Link>
     
    </div>
  );
}
