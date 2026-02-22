import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../Authcontext/AuthContext";
import { useTheme } from "../context/ThemeContext";
import NotificationBell from "./NotificationBell";
import TriageAssistant from "./TriageAssistant";

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

  const navLinks = !user ? publicLinks : [];

  const handleLogout = () => {
    logout();
    navigate("/login");
    setDropdownOpen(false);
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md dark:shadow-gray-900/50 sticky top-0 z-50 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-xl sm:text-2xl font-bold text-accent flex items-center gap-2">
          🏥 <span>Med<span className="text-dark dark:text-white">Care</span></span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-6 lg:gap-8 items-center text-dark dark:text-gray-200 font-medium">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`transition text-sm lg:text-base ${isActive(link.to) ? "text-accent border-b-2 border-accent" : "hover:text-accent"}`}
            >
              {link.label}
            </Link>
          ))}

          {!user ? (
            <>
              <Link to="/login" className="px-3 lg:px-4 py-2 bg-accent text-white rounded-lg hover:opacity-90 transition text-sm lg:text-base">Login</Link>
              <Link to="/register" className="px-3 lg:px-4 py-2 border-2 border-accent text-accent rounded-lg hover:bg-accent hover:text-white transition text-sm lg:text-base">Register</Link>
            </>
          ) : (
            <div className="flex items-center gap-3 lg:gap-4">
              <NotificationBell />
              <Link
                to={
                  user?.role === "patient"
                    ? "/patient/dashboard"
                    : user?.role === "doctor"
                      ? "/doctor/dashboard"
                      : "/admin/dashboard"
                }
                className="px-3 lg:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold text-sm lg:text-base"
              >
                <span className="hidden lg:inline">📊 Dashboard</span>
                <span className="lg:hidden">📊</span>
              </Link>

              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="px-3 lg:px-4 py-2 bg-accent text-white rounded-lg hover:opacity-90 transition flex items-center gap-2 text-sm lg:text-base"
                >
                  <img
                    src={user?.profile_image || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "User")}&background=random`}
                    alt={user?.name || "User"}
                    className="w-8 h-8 rounded-full object-cover border-2 border-accent bg-gray-100 dark:bg-gray-700 mr-2"
                  />
                  <span className="hidden lg:inline">{user?.name}</span>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg dark:shadow-gray-900/50 z-10">
                    <Link to={user?.role === "patient" ? "/patient/profile" : user?.role === "doctor" ? "/doctor/profile" : "/admin/dashboard"} className="block px-4 py-2 text-dark dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700" onClick={() => setDropdownOpen(false)}>Profile</Link>
                    {user?.role === 'patient' && <Link to="/patient/health-summary" className="block px-4 py-2 text-dark dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700" onClick={() => setDropdownOpen(false)}>Health Passport</Link>}
                    <Link to={user?.role === "patient" ? "/patient/settings" : user?.role === "doctor" ? "/doctor/settings" : "#"} className="block px-4 py-2 text-dark dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700" onClick={() => setDropdownOpen(false)}>Settings</Link>
                    <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 border-t dark:border-gray-600">Logout</button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-2">
          {user && <NotificationBell />}
          <button onClick={() => setMobileOpen(!mobileOpen)} className="text-2xl text-accent p-1" aria-label="Toggle menu">{mobileOpen ? "✕" : "☰"}</button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileOpen && (
        <div className="md:hidden bg-background dark:bg-gray-800 border-t border-gray-200 dark:border-gray-600 p-4 space-y-2">
          {!user ? (
            <>
              {navLinks.map(link => (
                <Link key={link.to} to={link.to} onClick={() => setMobileOpen(false)} className={`block px-4 py-2 rounded ${isActive(link.to) ? "bg-accent text-white" : "text-dark dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"}`}>{link.label}</Link>
              ))}
              <Link to="/login" onClick={() => setMobileOpen(false)} className="block px-4 py-2 bg-accent text-white rounded text-center hover:opacity-90">Login</Link>
              <Link to="/register" onClick={() => setMobileOpen(false)} className="block px-4 py-2 border-2 border-accent text-accent rounded text-center hover:bg-accent hover:text-white">Register</Link>
            </>
          ) : (
            <>
              <Link to={user?.role === "patient" ? "/patient/dashboard" : user?.role === "doctor" ? "/doctor/dashboard" : "/admin/dashboard"} onClick={() => setMobileOpen(false)} className="block px-4 py-2 bg-blue-600 text-white rounded text-center font-semibold hover:bg-blue-700">📊 Dashboard</Link>
              <Link to={user?.role === "patient" ? "/patient/profile" : user?.role === "doctor" ? "/doctor/profile" : "/admin/dashboard"} onClick={() => setMobileOpen(false)} className="block px-4 py-2 text-dark dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">👤 Profile</Link>
              {user?.role === 'patient' && <Link to="/patient/health-summary" onClick={() => setMobileOpen(false)} className="block px-4 py-2 text-dark dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">🏥 Health Passport</Link>}
              <Link to={user?.role === "patient" ? "/patient/settings" : user?.role === "doctor" ? "/doctor/settings" : "#"} onClick={() => setMobileOpen(false)} className="block px-4 py-2 text-dark dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">⚙️ Settings</Link>
              <button onClick={() => { handleLogout(); setMobileOpen(false); }} className="block w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-left">Logout</button>
            </>
          )}
        </div>
      )}
      {user?.role === 'patient' && <TriageAssistant />}
    </nav>
  );
}
