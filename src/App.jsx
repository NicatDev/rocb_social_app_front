import { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import { Loader } from "./components/ui";
import { App as AntdApp, ConfigProvider } from 'antd';
import { themeToken, components, getCustomLocale } from "@/config/Antd/index";
import { setNotificationApi } from './components/utils/notification';
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));

function App() {
  return (
     <ConfigProvider
    theme={{
      components: components,
      token: themeToken,
    }}
    locale={getCustomLocale()}
  >
    <AntdApp>
    <Router>
      <Suspense fallback={<Loader />}>
        <Initializer />
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
          </Route>
          <Route  path="/login" >
             <Route index element={<Login />} />
          </Route>
          <Route  >
             <Route path="/register" element={<Register />} />
          </Route>
        </Routes>
      </Suspense>
    </Router>  </AntdApp>
  </ConfigProvider>
  );
}

const Initializer = () => {
  const { notification } = AntdApp.useApp();
  setNotificationApi(notification);
  return null;
};

export default App;
