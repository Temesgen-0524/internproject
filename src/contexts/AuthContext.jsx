import React, { createContext, useContext, useState, useEffect } from "react";
import { apiService } from "../services/api";
import toast from "react-hot-toast";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem("user");
    
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      // Verify token is still valid
      if (userData.token) {
        verifyToken(userData.token);
      }
    }
    
    setLoading(false);
  }, []);

  const verifyToken = async (token) => {
    try {
      await apiService.getProfile();
    } catch (error) {
      // Token is invalid, logout user
      logout();
    }
  };

  const login = async (username, password) => {
    try {
      setLoading(true);

      // Admin login check
      if (username.toLowerCase() === "admindbu12" && password === "Admin123#") {
        const adminUser = {
          id: "admin_1",
          username: "AdminDbu12",
          name: "System Administrator",
          role: "admin",
          isAdmin: true,
          token: "admin_token_" + Date.now(),
        };

        setUser(adminUser);
        localStorage.setItem("user", JSON.stringify(adminUser));
        
        return adminUser;
      }

      // Student login via API
      try {
        const response = await apiService.login({ username, password });
        const studentUser = {
          ...response.user,
          token: response.token,
          isAdmin: response.user.role === "admin",
        };

        localStorage.setItem("user", JSON.stringify(studentUser));
        setUser(studentUser);
        
        return studentUser;
      } catch (error) {
        console.error('API login failed:', error);
        throw new Error("Invalid username or password");
      }
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await apiService.register(userData);
      
      const newUser = {
        ...response.user,
        token: response.token,
        isAdmin: false,
      };

      localStorage.setItem("user", JSON.stringify(newUser));
      setUser(newUser);
      
      return newUser;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    toast.success("Logged out successfully");
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};