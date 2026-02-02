import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/doctors", label: "Doctors" },
    { to: "/services", label: "Services" },
    { to: "/about", label: "About" },
  ];

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-accent flex items-center gap-2">
          🏥 <span>Med<span className="text-dark">Care</span></span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-8 items-center text-dark font-medium">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`transition ${isActive(link.to) ? "text-accent border-b-2 border-accent" : "hover:text-accent"}`}
            >
              {link.label}
            </Link>
          ))}
          <Link to="/login" className="px-4 py-2 bg-accent text-white rounded-lg hover:opacity-90 transition">
            Login
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-2xl text-accent"
        >
          {mobileOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileOpen && (
        <div className="md:hidden bg-background border-t border-gray-200 p-4 space-y-2">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMobileOpen(false)}
              className={`block px-4 py-2 rounded ${isActive(link.to) ? "bg-accent text-white" : "text-dark hover:bg-gray-100"}`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            to="/login"
            onClick={() => setMobileOpen(false)}
            className="block px-4 py-2 bg-accent text-white rounded text-center hover:opacity-90"
          >
            Login
          </Link>
        </div>
      )}
    </nav>
  );
}
