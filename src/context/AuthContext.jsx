import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("accessToken") || null);
  const [loading, setLoading] = useState(false);

  const fetchProfile = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const { data } = await axios.get("http://46.62.145.90:500/api/account/profile/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(data,'----------')
      setUser(data); // set user profile
    } catch (error) {
      console.error("Failed to fetch profile:", error);
      logout(); // clear invalid token
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [token]);

  const login = (accessToken) => {
    localStorage.setItem("accessToken", accessToken);
    setToken(accessToken);
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
