import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../Authcontext/AuthContext";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const isActive = (path) => location.pathname === path;

  const publicLinks = [
    { to: "/", label: "Home" },
    { to: "/doctors", label: "Doctors" },
    { to: "/services", label: "Services" },
    { to: "/about", label: "About" },
  ];

  const getNavigation = () => {
    if (!user) return publicLinks;
    
    switch (user.role) {
      case "patient":
        return [
          { to: "/user/dashboard", label: "Dashboard" },
          { to: "/user/browse-doctors", label: "Find Doctor" },
          { to: "/user/appointments", label: "Appointments" },
          { to: "/user/health-records", label: "Health Records" },
        ];
      case "doctor":
        return [
          { to: "/doctor/dashboard", label: "Dashboard" },
          { to: "/doctor/appointments", label: "Appointments" },
          { to: "/doctor/profile", label: "Profile" },
        ];
      case "admin":
        return [
          { to: "/admin/dashboard", label: "Dashboard" },
          { to: "/admin/patients", label: "Patients" },
          { to: "/admin/doctors", label: "Doctors" },
          { to: "/admin/appointments", label: "Appointments" },
        ];
      default:
        return publicLinks;
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
    setDropdownOpen(false);
  };

  const navLinks = getNavigation();

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
          {!user ? (
            <>
              <Link to="/login" className="px-4 py-2 bg-accent text-white rounded-lg hover:opacity-90 transition">
                Login
              </Link>
              <Link to="/register" className="px-4 py-2 border-2 border-accent text-accent rounded-lg hover:bg-accent hover:text-white transition">
                Register
              </Link>
            </>
          ) : (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="px-4 py-2 bg-accent text-white rounded-lg hover:opacity-90 transition flex items-center gap-2"
              >
                👤 {user.name}
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                  <Link
                    to={user.role === "patient" ? "/user/profile" : user.role === "doctor" ? "/doctor/profile" : "/admin/dashboard"}
                    className="block px-4 py-2 text-dark hover:bg-gray-100"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    to={user.role === "patient" ? "/user/settings" : "#"}
                    className="block px-4 py-2 text-dark hover:bg-gray-100"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 border-t"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
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
          {!user ? (
            <>
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-2 bg-accent text-white rounded text-center hover:opacity-90"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-2 border-2 border-accent text-accent rounded text-center hover:bg-accent hover:text-white"
              >
                Register
              </Link>
            </>
          ) : (
            <>
              <Link
                to={user.role === "patient" ? "/user/profile" : user.role === "doctor" ? "/doctor/profile" : "/admin/dashboard"}
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-2 text-dark hover:bg-gray-100 rounded"
              >
                {user.name}
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setMobileOpen(false);
                }}
                className="block w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-left"
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
