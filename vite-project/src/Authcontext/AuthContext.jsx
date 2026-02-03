import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password, userType) => {
    try {
      const response = await axios.post("/auth/login", {
        email,
        password,
        role: userType,
      });

      const { token, user: userData } = response.data;

      setUser(userData);
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));

      return userData;
    } catch (error) {
      const message = error.response?.data?.message || "Login failed";
      throw new Error(message);
    }
  };

  const register = async (registerData) => {
    try {
      const { name, email, password, confirmPassword, userType, specialization, experienceYears, consultationFee, licenseNumber } = registerData;

      if (password !== confirmPassword) {
        throw new Error("Passwords do not match");
      }

      if (password.length < 6) {
        throw new Error("Password must be at least 6 characters");
      }

      const requestBody = {
        name,
        email,
        password,
        role: userType,
      };

      // Add doctor-specific fields
      if (userType === "doctor") {
        requestBody.specialization = specialization;
        requestBody.experienceYears = experienceYears;
        requestBody.consultationFee = consultationFee;
        requestBody.licenseNumber = licenseNumber;
      }

      const response = await axios.post("/auth/register", requestBody);

      const { token, user: userData } = response.data;

      setUser(userData);
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));

      return userData;
    } catch (error) {
      const message = error.response?.data?.message || "Registration failed";
      throw new Error(message);
    }
  };

  const logout = async () => {
    try {
      await axios.post("/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    }
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  const isAuthenticated = !!user;
  const userRole = user?.role;

  const hasRole = (role) => {
    if (typeof role === "string") {
      return userRole === role;
    }
    return role.includes(userRole);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated,
    userRole,
    hasRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
