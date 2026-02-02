import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F4FAFF] px-4">
      <div className="bg-white p-6 rounded-xl shadow text-center">
        <h1 className="text-2xl font-bold text-[#08090A] mb-4">
          404 – Page Not Found
        </h1>
        <Link to="/" className="text-[#8789C0] underline">
          Go Home
        </Link>
      </div>
    </div>
  );
}
