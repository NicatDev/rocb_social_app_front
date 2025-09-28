import { lazy } from "react";
import MainLayout from "@/layouts/MainLayout";
// import ProtectedRoute from "@/components/ProtectedRoute";

const Home = lazy(() => import("@/pages/Home"));
const Login = lazy(() => import("@/pages/Login"));
const Register = lazy(() => import("@/pages/Register"));
const Profile = lazy(() => import("@/pages/Profile"));
const PostApprove = lazy(() => import("@/pages/PostApprove"));
const UserProfile = lazy(() => import("@/pages/UserProfile"));

export const routesConfig = [
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },
    ],
  },
  {
    path: "/notifications",
    element: <MainLayout />,
    children: [{ index: true, element: <PostApprove /> }],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/profile/:username",
    element: <MainLayout />,
    children: [{ index: true, element: <UserProfile /> }],
  },
  {
    path: "/profile",
    element: <MainLayout />,
    element: (
        <MainLayout />
    ),
    children: [{ index: true, element: <Profile /> }],
  },
];