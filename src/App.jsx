import { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import { Loader } from "./components/ui";
import { App as AntdApp, ConfigProvider } from "antd";
import { themeToken, components, getCustomLocale } from "@/config/Antd/index";
import { setNotificationApi } from "./components/utils/notification";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute"; // ✅ yeni component

const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Profile = lazy(() => import("./pages/Profile"));
const PostApprove = lazy(() => import("./pages/PostApprove"));

function App() {
  return (
    <ConfigProvider
      theme={{ components, token: themeToken }}
      locale={getCustomLocale()}
    >
      <AntdApp>
        <Router>
          <AuthProvider>
            <Suspense fallback={<Loader />}>
              <Initializer />
              <Routes>
                <Route path="/" element={<MainLayout />}>
                  <Route index element={<Home />} />
                </Route>
                <Route path="/notifications" element={<MainLayout />}>
                  <Route index element={<PostApprove />} />
                </Route>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Protected Route */}
                <Route element={<ProtectedRoute />}>
                  <Route path="/profile" element={<MainLayout />}>
                    <Route index element={<Profile />} />
                  </Route>
                </Route>
              </Routes>
            </Suspense>
          </AuthProvider>
        </Router>
      </AntdApp>
    </ConfigProvider>
  );
}

const Initializer = () => {
  const { notification } = AntdApp.useApp();
  setNotificationApi(notification);
  return null;
};

export default App;
