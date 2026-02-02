import { Link } from "react-router-dom";

export default function Unauthorized() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="bg-white p-6 rounded-xl shadow text-center">
        <h1 className="text-2xl font-bold text-red-500 mb-4">
          Unauthorized Access
        </h1>
        <Link to="/" className="text-accent underline">
          Go Home
        </Link>
      </div>
    </div>
  );
}
