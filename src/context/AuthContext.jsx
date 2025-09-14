import { createContext, use, useContext, useEffect, useState } from "react";
import API from '@/api'
const AuthContext = createContext();


export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);


    const logout = () => {
        localStorage.removeItem("accessToken");
        sessionStorage.removeItem("refreshToken");
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, logout, loading }}>
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
