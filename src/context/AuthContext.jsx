import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { App as AntdApp } from "antd";
import { useNavigate } from "react-router-dom";
import axiosInstance from "@/config/Axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState(null);
  const { message } = AntdApp.useApp();
  const navigate = useNavigate();

  const logout = useCallback(() => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setProfile(null);
    navigate("/login");
  }, [navigate]);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        setProfile(null);
        return;
      }

      const res = await axiosInstance.get("/account/profile/");
      setProfile(Array.isArray(res.data) ? res.data[0] : res.data);
    } catch (err) {
      message.error("Failed to fetch profile data");
    } finally {
      setLoading(false);
    }
  }, [message]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await axiosInstance.post("/account/login/", values);

      if (response?.data?.access) {
        localStorage.setItem("accessToken", response.data.access);
        localStorage.setItem("refreshToken", response.data?.refresh);
      }
      message.success("Login successful!");
      navigate("/");
      fetchProfile();
    } catch (error) {
      message.error(error.response?.data?.detail || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        profile,
        logout,
        setProfile,
        fetchProfile,
        loading,
        onFinish,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
