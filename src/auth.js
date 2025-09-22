import axios from "axios";

export const refreshAccessToken = async (callback) => {
  try {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) {
      throw new Error("Refresh token yoxdur");
    }

    const response = await axios.post(
      "http://46.62.145.90:500/api/account/token/refresh/",
      { refresh: refreshToken }
    );

    const newAccessToken = response.data.access;
    localStorage.setItem("accessToken", newAccessToken);

    // ✅ refresh uğurlu olduqdan sonra callback-i çağır
    if (callback && typeof callback === "function") {
      return callback(newAccessToken);
    }

    return newAccessToken;
  } catch (error) {
    console.error("Access token yenilənmədi:", error);

    return null;
  }
};
